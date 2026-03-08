import React from 'react'
// import './signature.css';

export function Signature({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="-20 0 160 136"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="atstroke"
        d="M25 80.8543C28.6667 71.8543 25.6911 56.3012 10.4911 73.9012C-8.50895 95.9012 13.5 98.8543 23 82.3543C32.5 65.8543 33.5 68.8543 33 69.3543C32.5 69.8543 15 93.3543 18 102.354C20.4 109.554 26.8334 103.188 32.5 93.8543L61.5 50.5808C86.3334 17.4141 126.1 -35.2819 70.5 46.3181L40.5 106.561C31.6637 124.394 15.9929 153.581 38 111.581"
        stroke="black"
        strokeLinecap="round"
      />
      <path
        id="tbar"
        d="M39 45L136.5 38.5"
        stroke="black"
        strokeLinecap="round"
      />
    </svg>
  )
}
