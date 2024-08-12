import React from 'react'
import TogleSwitch from './SwitchTheme'
import 'maplibre-gl/dist/maplibre-gl.css'
import '../css/map.css'
import { GridIcon } from '@radix-ui/react-icons'
import { Cross2Icon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'

export default function Header({
  isChecked,
  isChecked2,
  isChecked3,
  handleCheckboxChange,
  handleCheckboxChange2,
  handleCheckboxChange3
}) {
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
