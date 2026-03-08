'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MenuTooltip } from '../../../../components/ui/tooltip'
// import { throttle } from '../../../../lib/utils/lodash'

export function Meow() {
  // Default pupil positions (centered in each eye)
  // Default pupil positions (centered in each eye, original size)
  const [pupils, setPupils] = useState({
    left: { cx: 301.377, cy: 120.203 },
    right: { cx: 410.549, cy: 120.203 }
  })

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      // Both eyes move together, same direction/amount
      // Eye centers from SVG
      const leftEye = { cx: 320.377, cy: 151.203 }
      const rightEye = { cx: 429.549, cy: 151.203 }
      // SVG viewBox: 0 0 493 470
      const svgW = 493
      const svgH = 470
      // Map mouse to SVG coordinates
      const mouseX = (event.clientX / window.innerWidth) * svgW
      const mouseY = (event.clientY / window.innerHeight) * svgH
      // Max pupil movement radius
      const r = 18
      // Use left eye as reference for direction
      const dx = mouseX - leftEye.cx
      const dy = mouseY - leftEye.cy
      const angle = Math.atan2(dy, dx)
      // Both pupils move in same direction
      setPupils({
        left: {
          cx: leftEye.cx + Math.cos(angle) * r,
          cy: leftEye.cy + Math.sin(angle) * r
        },
        right: {
          cx: rightEye.cx + Math.cos(angle) * r,
          cy: rightEye.cy + Math.sin(angle) * r
        }
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <MenuTooltip label="meow" side="top">
      <Link href="/vibes" className="group cursor-pointer" aria-label="meow">
        <span className="relative flex flex-col items-center">
          <svg viewBox="0 0 493 470" fill="none" width={90} height={90}>
            <circle
              className="eye fill-[#ffee94]"
              cx={320.377}
              cy={151.203}
              r={44}
            />
            <circle
              className="eye fill-[#ffee94]"
              cx={429.549}
              cy={151.203}
              r={44}
            />
            <circle
              className="pupil fill-[#ffb399]"
              cx={pupils.left.cx}
              cy={pupils.left.cy}
              r={25}
            />
            <circle
              className="pupil fill-[#ffb399]"
              cx={pupils.right.cx}
              cy={pupils.right.cy}
              r={25}
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M259.889 15.0499V70.8143H259.876V221.295L258.4 221.295H256.925V221.306C204.644 222.094 162.506 264.721 162.506 317.189C162.506 317.682 162.51 318.174 162.517 318.664H162.506L162.506 432.262C108.996 416.323 97.8602 285.614 97.5813 232.691C97.589 232.336 97.5928 231.979 97.5928 231.622C97.5928 231.19 97.5872 230.759 97.576 230.33C97.5769 229.247 97.5827 228.202 97.5928 227.196L97.3926 227.176C95.1473 202.372 74.2973 182.937 48.908 182.937C23.6523 182.937 2.88829 202.168 0.460371 226.785C0.379264 226.92 0.300188 227.057 0.223163 227.196C-5.67803 379.447 106.937 458.326 162.506 469.145L397.078 469.145L398.554 469.145V469.134C450.834 468.345 492.973 425.719 492.973 373.25C492.973 372.983 492.972 372.716 492.969 372.449C492.969 372.36 492.968 372.272 492.967 372.183C492.965 372.047 492.964 371.911 492.962 371.775H492.973V221.295V71.4081H492.986V15.3468C493.478 7.47851 480.594 -5.89754 466.431 3.54437C452.416 12.8874 421.837 51.8923 407.857 70.8143H345.238C331.36 52.0065 300.533 12.6397 286.445 3.24749C272.282 -6.19442 259.397 7.18163 259.889 15.0499ZM360.21 152.253C360.21 174.252 342.376 192.086 320.377 192.086C298.377 192.086 280.543 174.252 280.543 152.253C280.543 130.253 298.377 112.42 320.377 112.42C342.376 112.42 360.21 130.253 360.21 152.253ZM429.549 192.086C451.548 192.086 469.382 174.252 469.382 152.253C469.382 130.253 451.548 112.42 429.549 112.42C407.549 112.42 389.716 130.253 389.716 152.253C389.716 174.252 407.549 192.086 429.549 192.086Z"
              className="fill-[#777] dark:fill-[#444]"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M377.899 191.671C384.633 191.124 389.702 188.743 389.702 185.888C389.702 182.628 383.097 179.986 374.949 179.986C366.801 179.986 360.196 182.628 360.196 185.888C360.196 188.743 365.264 191.124 371.998 191.671V206.542H366.097C364.468 206.542 363.146 207.863 363.146 209.492C363.146 211.122 364.468 212.443 366.097 212.443H366.1H383.797H383.801C385.43 212.443 386.751 211.122 386.751 209.492C386.751 207.863 385.43 206.542 383.801 206.542H377.899V191.671Z"
              className="fill-[#ffb399]"
            />
          </svg>
        </span>
      </Link>
    </MenuTooltip>
  )
}
