interface PerforatedEdgeProps {
  position: 'top' | 'bottom'
}

export function PerforatedEdge({ position }: PerforatedEdgeProps) {
  const isTop = position === 'top'
  const topStyle = {
    background: `linear-gradient(135deg, transparent 33.33%, #fffbeb 33.33%, #fffbeb 66.66%, transparent 66.66%),\n                            linear-gradient(225deg, transparent 33.33%, #fffbeb 33.33%, #fffbeb 66.66%, transparent 66.66%)`,
    backgroundSize: '6px 6px'
  }
  const bottomStyle = {
    background: `linear-gradient(45deg, transparent 33.33%, #fffbeb 33.33%, #fffbeb 66.66%, transparent 66.66%),\n                            linear-gradient(-45deg, transparent 33.33%, #fffbeb 33.33%, #fffbeb 66.66%, transparent 66.66%)`,
    backgroundSize: '6px 6px'
  }

  return (
    <div
      className={`absolute ${isTop ? '-top-2' : '-bottom-2'} left-0 right-0 h-2`}
      style={isTop ? topStyle : bottomStyle}
    />
  )
}
