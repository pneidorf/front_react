import { useTheme } from 'next-themes'
import { memo, useEffect, useState } from 'react'

export const ThemeSwitcher = memo(() => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme, themes } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  return <div>theme-switcher</div>
})
