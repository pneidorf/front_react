import React from 'react'
import TogleSwitch from './SwitchTheme'

class Header extends React.Component {
  render() {
    return (
      <header
        className='bg-white h-10 flex items-center justify-center main-header'
        style={{
          position: 'fixed',
          left: '60px',
          right: '0px',
          top: '0px',
          zIndex: 9999
        }}
      >
        <div className='flex flex-grow items-center justify-between px-3'>
          <TogleSwitch />
          <button className='text-blue-700 underline'>Войти</button>
        </div>
      </header>
    )
  }
}

export default Header
