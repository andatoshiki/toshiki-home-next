export function getVisitorInfo() {
  if (typeof window === 'undefined') {
    return {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      os: 'Unknown',
      browser: 'Unknown',
      screenSize: 'Unknown'
    }
  }

  const ua = navigator.userAgent
  let os = 'Unknown'
  let browser = 'Unknown'

  // Detect OS
  if (ua.includes('Win')) os = 'Windows'
  else if (ua.includes('Mac')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

  // Detect Browser
  if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Edg')) browser = 'Edge'
  else if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari')) browser = 'Safari'

  return {
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    os,
    browser,
    screenSize: `${window.innerWidth}x${window.innerHeight}`
  }
}
