import React from 'react'

class Header extends React.Component {
  render() {
    return (
      <div
        className='bg-white border-b h-10 flex items-center justify-center main-header'
        style={{
          transform: sidebarPosition,
          zIndex: 9999
        }}
      />
    )
  }
}

export default Header
