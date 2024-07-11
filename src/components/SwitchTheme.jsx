import React, { Component, useLayoutEffect, useEffect, useState } from 'react'
import Switch from 'react-switch'

const defaultTheme = 'lightTheme'

export const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || defaultTheme)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('app-theme', theme)
  }, [theme])

  return { theme, setTheme }
}
const Togle = ({ theme, handleToggleChange }) => {
  const [checked, setChecked] = useState(theme === 'darkTheme' ? true : false)
  const handleChange = nextChecked => {
    setChecked(nextChecked)
    handleToggleChange()
  }
  return (
    <label className='switch-theme px-3'>
      <Switch
        checked={checked}
        onChange={handleChange}
        offColor='#c4c4c4'
        onColor='#66545e'
        handleDiameter={26}
        offHandleColor='#707070'
        onHandleColor='#ed784a'
        height={23}
        activeBoxShadow='0px 0px 1px 2px #ff0000'
        uncheckedIcon={false}
        checkedIcon={false}
        uncheckedHandleIcon={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: 'white',
              fontSize: 20
            }}
          >
            ☼
          </div>
        }
        checkedHandleIcon={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: 'white',
              fontSize: 18
            }}
          >
            ☽
          </div>
        }
      />
    </label>
  )
}

function TogleSwitch() {
  const { theme, setTheme } = useTheme()
  const handleToggleChange = () => {
    if (theme == 'lightTheme') {
      setTheme('darkTheme')
    } else {
      setTheme('lightTheme')
    }
  }
  return <Togle theme={theme} handleToggleChange={handleToggleChange} />
}
export default TogleSwitch
