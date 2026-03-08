// Converts seconds to a formatted string like "9h 55m" or "51m"
export function formatTime(seconds: number, showSeconds = false): string {
  if (seconds <= 0 || isNaN(seconds)) return '0m'
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor(seconds / 60) % 60
  const secs = Math.floor(seconds % 60)
  let time = ''
  if (hours > 0) time += `${hours}h `
  if (mins > 0) time += `${mins}m `
  if (showSeconds && secs > 0) time += `${secs}s`
  return time.trim() || '0m'
}

// Format hours with decimal for tooltip display
export function formatHours(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`
  }
  return `${hours.toFixed(1)}h`
}
