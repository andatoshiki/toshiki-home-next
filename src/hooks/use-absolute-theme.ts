import { useTheme } from 'next-themes'
import usePrefersColorScheme from 'use-prefers-color-scheme'

export function useAbsoluteTheme(): 'dark' | 'light' {
  const { theme: nextTheme } = useTheme()
  const colorScheme = usePrefersColorScheme()

  const isDarkMode =
    nextTheme === 'system' ? colorScheme === 'dark' : nextTheme == 'dark'

  return isDarkMode ? 'dark' : 'light'
}
