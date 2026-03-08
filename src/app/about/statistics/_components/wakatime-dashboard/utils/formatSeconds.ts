// Converts seconds to a formatted string like "9h 55m 37s" or "51m"
export function formatSeconds(seconds: number, showSeconds = true): string {
  if (seconds <= 0 || isNaN(seconds)) return '0m'
  const hour = Math.floor(seconds / 3600)
  const min = Math.floor(seconds / 60) % 60
  const sec = Math.floor(seconds % 60)
  let time = ''
  if (hour > 0) time += `${hour}h `
  if (min > 0) time += `${min}m `
  if (showSeconds && sec > 0) time += `${sec}s`
  return time.trim() || '0m'
}
