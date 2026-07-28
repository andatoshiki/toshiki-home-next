'use client'

import { useEffect, useMemo, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { useAbsoluteTheme } from '~/hooks/use-absolute-theme'
import type { MapLocation } from './journey-data'
import {
  JOURNEY_STATUSES,
  JOURNEY_STATUS_DETAILS,
  type JourneyStatusFilter
} from './journey-status'
import '../journey.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ''
const LOCATION_SOURCE_ID = 'locations'
const LOCATION_LAYER_ID = 'location-dots'
const SECONDS_PER_REVOLUTION = 240
const MAX_SPIN_ZOOM = 5

interface GlobeMapProps {
  locations: MapLocation[]
  activeStatus: JourneyStatusFilter
}

interface LocationFeatureProperties {
  id: string
  name: string
  status: MapLocation['status']
  description: string
  color: string
}

function locationsToGeoJSON(locations: readonly MapLocation[]) {
  return {
    type: 'FeatureCollection' as const,
    features: locations.map(location => ({
      type: 'Feature' as const,
      properties: {
        id: location.id,
        name: location.name,
        status: location.status,
        description: location.description ?? '',
        color: JOURNEY_STATUS_DETAILS[location.status].color
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [
          location.coordinates.longitude,
          location.coordinates.latitude
        ]
      }
    }))
  }
}

function getMapStyle(theme: 'dark' | 'light') {
  return theme === 'dark'
    ? 'mapbox://styles/mapbox/dark-v11'
    : 'mapbox://styles/mapbox/light-v11'
}

function setAtmosphere(map: mapboxgl.Map, theme: 'dark' | 'light') {
  map.setFog({
    color: theme === 'dark' ? 'rgb(20, 20, 30)' : 'rgb(220, 220, 230)',
    'high-color': theme === 'dark' ? 'rgb(36, 36, 50)' : 'rgb(180, 200, 230)',
    'horizon-blend': 0.02,
    'space-color': theme === 'dark' ? 'rgb(10, 10, 15)' : 'rgb(200, 210, 230)',
    'star-intensity': theme === 'dark' ? 0.6 : 0.1
  })
}

function addLocationLayer(
  map: mapboxgl.Map,
  locations: readonly MapLocation[]
) {
  if (!map.getSource(LOCATION_SOURCE_ID)) {
    map.addSource(LOCATION_SOURCE_ID, {
      type: 'geojson',
      data: locationsToGeoJSON(locations)
    })
  }

  if (!map.getLayer(LOCATION_LAYER_ID)) {
    map.addLayer({
      id: LOCATION_LAYER_ID,
      type: 'circle',
      source: LOCATION_SOURCE_ID,
      paint: {
        'circle-radius': 6,
        'circle-color': ['get', 'color'],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    })
  }
}

function createPopupContent({
  name,
  description
}: Pick<LocationFeatureProperties, 'name' | 'description'>) {
  const content = document.createElement('div')
  content.className = 'journey-popup-content'

  const title = document.createElement('div')
  title.className = 'journey-popup-title'
  title.textContent = name
  content.appendChild(title)

  if (description) {
    const descriptionElement = document.createElement('div')
    descriptionElement.className = 'journey-popup-description'
    descriptionElement.textContent = description
    content.appendChild(descriptionElement)
  }

  return content
}

export function GlobeMap({ locations, activeStatus }: GlobeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const currentStyleRef = useRef<string | null>(null)
  const theme = useAbsoluteTheme()

  const filteredLocations = useMemo(
    () =>
      activeStatus === 'all'
        ? locations
        : locations.filter(location => location.status === activeStatus),
    [activeStatus, locations]
  )
  const filteredLocationsRef = useRef(filteredLocations)
  const themeRef = useRef(theme)

  filteredLocationsRef.current = filteredLocations
  themeRef.current = theme

  useEffect(() => {
    const container = mapContainerRef.current
    if (!container || !MAPBOX_TOKEN) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    const initialTheme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
    const initialStyle = getMapStyle(initialTheme)
    const map = new mapboxgl.Map({
      container,
      style: initialStyle,
      center: [120, 30],
      zoom: 1.5,
      projection: 'globe',
      attributionControl: false,
      dragRotate: true,
      dragPan: true,
      touchZoomRotate: true
    })
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12
    })
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    mapRef.current = map
    currentStyleRef.current = initialStyle

    map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'bottom-right'
    )

    map.on('style.load', () => {
      setAtmosphere(map, themeRef.current)
      addLocationLayer(map, filteredLocationsRef.current)
    })

    map.on('mouseenter', LOCATION_LAYER_ID, event => {
      const feature = event.features?.[0]
      if (!feature || feature.geometry.type !== 'Point') return

      map.getCanvas().style.cursor = 'pointer'

      const coordinates = feature.geometry.coordinates.slice(0, 2) as [
        number,
        number
      ]
      const properties = feature.properties as LocationFeatureProperties

      while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360
      }

      popup
        .setLngLat(coordinates)
        .setDOMContent(createPopupContent(properties))
        .addTo(map)
    })

    map.on('mouseleave', LOCATION_LAYER_ID, () => {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })

    let userInteracting = false

    const spinGlobe = () => {
      if (userInteracting || reducedMotion.matches) return

      const zoom = map.getZoom()
      if (zoom >= MAX_SPIN_ZOOM) return

      let distancePerSecond = 360 / SECONDS_PER_REVOLUTION
      if (zoom > MAX_SPIN_ZOOM - 1) {
        distancePerSecond *= MAX_SPIN_ZOOM - zoom
      }

      const center = map.getCenter()
      center.lng -= distancePerSecond / 60
      map.easeTo({ center, duration: 1000, easing: progress => progress })
    }

    const startInteraction = () => {
      userInteracting = true
    }
    const endInteraction = () => {
      userInteracting = false
      spinGlobe()
    }
    const handleMotionPreferenceChange = () => {
      if (reducedMotion.matches) map.stop()
      else spinGlobe()
    }

    map.on('mousedown', startInteraction)
    map.on('touchstart', startInteraction)
    map.on('dragstart', startInteraction)
    map.on('mouseup', endInteraction)
    map.on('touchend', endInteraction)
    map.on('dragend', endInteraction)
    map.on('pitchend', endInteraction)
    map.on('rotateend', endInteraction)
    map.on('moveend', spinGlobe)
    reducedMotion.addEventListener('change', handleMotionPreferenceChange)

    spinGlobe()

    return () => {
      reducedMotion.removeEventListener('change', handleMotionPreferenceChange)
      popup.remove()
      map.remove()
      mapRef.current = null
      currentStyleRef.current = null
    }
  }, [locations])

  useEffect(() => {
    const source = mapRef.current?.getSource(
      LOCATION_SOURCE_ID
    ) as mapboxgl.GeoJSONSource

    source?.setData(locationsToGeoJSON(filteredLocations))
  }, [filteredLocations])

  useEffect(() => {
    const map = mapRef.current
    const nextStyle = getMapStyle(theme)

    if (!map || currentStyleRef.current === nextStyle) return

    currentStyleRef.current = nextStyle
    map.setStyle(nextStyle)
  }, [theme])

  if (!MAPBOX_TOKEN) {
    return (
      <div
        className="flex h-[400px] w-full items-center justify-center rounded-3xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 sm:h-[600px]"
        role="alert"
      >
        <div className="px-6 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            MapBox access token is not configured.
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in the environment variables.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="journey-map relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800">
      <div
        ref={mapContainerRef}
        className="h-[400px] w-full bg-[#e5e7eb] dark:bg-[#0a0a0f] sm:h-[600px]"
      />
      <div
        className="pointer-events-none absolute bottom-4 left-4 right-14 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-white/90 px-4 py-2 text-sm backdrop-blur-sm dark:bg-neutral-900/90 sm:left-auto sm:right-4 sm:flex-nowrap"
        aria-label="Map legend"
      >
        {JOURNEY_STATUSES.map(status => {
          const details = JOURNEY_STATUS_DETAILS[status]

          return (
            <div key={status} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full border border-white"
                style={{ backgroundColor: details.color }}
              />
              <span className="text-neutral-700 dark:text-neutral-300">
                {details.legendLabel}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
