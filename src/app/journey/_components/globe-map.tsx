'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useAbsoluteTheme } from '~/hooks/use-absolute-theme'
import { STATUS_COLORS, JourneyStatus } from './status-tabs'

// Mapbox access token - should be set in environment variables
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

export interface LocationData {
  id: string
  name: string
  coordinates: {
    longitude: number
    latitude: number
  }
  country: string
  region?: string
  city?: string
  status: JourneyStatus
  visitDate?: string
  description?: string
  tags: string[]
  featured: boolean
}

interface GlobeMapProps {
  locations: LocationData[]
  activeStatus: JourneyStatus | 'all'
}

// Convert locations to GeoJSON
function locationsToGeoJSON(locations: LocationData[]) {
  return {
    type: 'FeatureCollection' as const,
    features: locations.map(loc => ({
      type: 'Feature' as const,
      properties: {
        id: loc.id,
        name: loc.name,
        status: loc.status,
        visitDate: loc.visitDate || '',
        description: loc.description || '',
        color: STATUS_COLORS[loc.status]
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [loc.coordinates.longitude, loc.coordinates.latitude]
      }
    }))
  }
}

export function GlobeMap({ locations, activeStatus }: GlobeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const popup = useRef<any>(null)
  const theme = useAbsoluteTheme()
  const [mapLoaded, setMapLoaded] = useState(false)

  // Filter locations based on active status
  const filteredLocations =
    activeStatus === 'all'
      ? locations
      : locations.filter(loc => loc.status === activeStatus)

  // Map style based on theme
  const mapStyle =
    theme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v11'
      : 'mapbox://styles/mapbox/light-v11'

  // Add custom popup styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .mapboxgl-canvas {
        touch-action: none !important;
      }
      .mapboxgl-popup-content {
        padding: 0 !important;
        border-radius: 8px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
      }
      .mapbox-popup-dark .mapboxgl-popup-content {
        background: #262626 !important;
      }
      .mapbox-popup-light .mapboxgl-popup-content {
        background: #ffffff !important;
      }
      .mapbox-popup-dark .mapboxgl-popup-tip {
        border-top-color: #262626 !important;
      }
      .mapbox-popup-light .mapboxgl-popup-tip {
        border-top-color: #ffffff !important;
      }
      .popup-content {
        padding: 6px 10px;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .popup-title {
        font-weight: 600;
        font-size: 12px;
        white-space: nowrap;
      }
      .mapbox-popup-dark .popup-title {
        color: #f5f5f5;
      }
      .mapbox-popup-light .popup-title {
        color: #171717;
      }
      .popup-date {
        margin-right: 6px;
        opacity: 0.7;
      }
      .popup-desc {
        font-size: 11px;
        margin-top: 2px;
        max-width: 180px;
      }
      .mapbox-popup-dark .popup-desc {
        color: #a3a3a3;
      }
      .mapbox-popup-light .popup-desc {
        color: #525252;
      }
    `
    document.head.appendChild(style)

    return () => {
      style.remove()
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN || !mapboxgl) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [120, 30],
      zoom: 1.5,
      projection: 'globe',
      attributionControl: false,
      dragRotate: true,
      dragPan: true,
      touchZoomRotate: true
    })

    map.current = mapInstance

    // Create popup instance
    popup.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
      className: theme === 'dark' ? 'mapbox-popup-dark' : 'mapbox-popup-light'
    })

    // Add navigation control
    mapInstance.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'bottom-right'
    )

    mapInstance.on('style.load', () => {
      // Add atmosphere effect
      mapInstance.setFog({
        color: theme === 'dark' ? 'rgb(20, 20, 30)' : 'rgb(220, 220, 230)',
        'high-color':
          theme === 'dark' ? 'rgb(36, 36, 50)' : 'rgb(180, 200, 230)',
        'horizon-blend': 0.02,
        'space-color':
          theme === 'dark' ? 'rgb(10, 10, 15)' : 'rgb(200, 210, 230)',
        'star-intensity': theme === 'dark' ? 0.6 : 0.1
      })

      // Add GeoJSON source
      mapInstance.addSource('locations', {
        type: 'geojson',
        data: locationsToGeoJSON(filteredLocations)
      })

      // Add circle layer for dots
      mapInstance.addLayer({
        id: 'location-dots',
        type: 'circle',
        source: 'locations',
        paint: {
          'circle-radius': 6,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      })

      // Hover effect - show popup
      mapInstance.on('mouseenter', 'location-dots', (e: any) => {
        mapInstance.getCanvas().style.cursor = 'pointer'

        const coordinates = e.features[0].geometry.coordinates.slice()
        const { name, visitDate, description } = e.features[0].properties

        // Ensure popup stays on screen when wrapping around globe
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        const html = `
          <div class="popup-content">
            <div class="popup-title">
              ${visitDate ? `<span class="popup-date">${visitDate}</span>` : ''}${name}
            </div>
            ${description ? `<div class="popup-desc">${description}</div>` : ''}
          </div>
        `

        popup.current.setLngLat(coordinates).setHTML(html).addTo(mapInstance)
      })

      mapInstance.on('mouseleave', 'location-dots', () => {
        mapInstance.getCanvas().style.cursor = ''
        popup.current.remove()
      })

      setMapLoaded(true)
    })

    // Auto-rotate the globe
    const secondsPerRevolution = 240
    const maxSpinZoom = 5
    let userInteracting = false

    function spinGlobe() {
      if (!map.current) return
      const zoom = map.current.getZoom()
      if (!userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution
        if (zoom > maxSpinZoom - 1) {
          const zoomDif =
            (maxSpinZoom - zoom) / (maxSpinZoom - (maxSpinZoom - 1))
          distancePerSecond *= zoomDif
        }
        const center = map.current.getCenter()
        center.lng -= distancePerSecond / 60
        map.current.easeTo({ center, duration: 1000, easing: (n: number) => n })
      }
    }

    // Mouse events
    mapInstance.on('mousedown', () => {
      userInteracting = true
    })
    mapInstance.on('mouseup', () => {
      userInteracting = false
      spinGlobe()
    })

    // Touch events for mobile
    mapInstance.on('touchstart', () => {
      userInteracting = true
    })
    mapInstance.on('touchend', () => {
      userInteracting = false
      spinGlobe()
    })

    mapInstance.on('dragstart', () => {
      userInteracting = true
    })
    mapInstance.on('dragend', () => {
      userInteracting = false
      spinGlobe()
    })
    mapInstance.on('pitchend', () => {
      userInteracting = false
      spinGlobe()
    })
    mapInstance.on('rotateend', () => {
      userInteracting = false
      spinGlobe()
    })
    mapInstance.on('moveend', () => {
      spinGlobe()
    })

    spinGlobe()

    return () => {
      mapInstance.remove()
    }
  }, [theme, mapStyle]) // eslint-disable-line react-hooks/exhaustive-deps

  // Update data when filter changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    const source = map.current.getSource('locations')
    if (source) {
      source.setData(locationsToGeoJSON(filteredLocations))
    }
  }, [filteredLocations, mapLoaded])

  // Update style when theme changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    map.current.once('style.load', () => {
      // Re-add source and layer after style change
      if (!map.current.getSource('locations')) {
        map.current.addSource('locations', {
          type: 'geojson',
          data: locationsToGeoJSON(filteredLocations)
        })

        map.current.addLayer({
          id: 'location-dots',
          type: 'circle',
          source: 'locations',
          paint: {
            'circle-radius': 6,
            'circle-color': ['get', 'color'],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        })
      }

      // Update fog
      map.current.setFog({
        color: theme === 'dark' ? 'rgb(20, 20, 30)' : 'rgb(220, 220, 230)',
        'high-color':
          theme === 'dark' ? 'rgb(36, 36, 50)' : 'rgb(180, 200, 230)',
        'horizon-blend': 0.02,
        'space-color':
          theme === 'dark' ? 'rgb(10, 10, 15)' : 'rgb(200, 210, 230)',
        'star-intensity': theme === 'dark' ? 0.6 : 0.1
      })
    })

    map.current.setStyle(mapStyle)
  }, [theme, mapStyle]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center rounded-3xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            MapBox access token is not configured.
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment
            variables.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800">
      <div
        ref={mapContainer}
        className="h-[400px] w-full sm:h-[600px]"
        style={{ background: theme === 'dark' ? '#0a0a0f' : '#e5e7eb' }}
      />
      {/* Legend */}
      <div className="absolute bottom-4 right-4 flex items-center gap-4 rounded-xl bg-white/90 px-4 py-2 text-sm backdrop-blur-sm dark:bg-neutral-900/90">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full border border-white"
              style={{ backgroundColor: color }}
            />
            <span className="capitalize text-neutral-700 dark:text-neutral-300">
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
