import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import '../css/map.css'
import { GridIcon } from '@radix-ui/react-icons'
import * as Checkbox from '@radix-ui/react-checkbox'
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
  Cross2Icon
} from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'

export default function Sidebar({
  isChecked,
  isChecked2,
  isChecked3,
  handleCheckboxChange,
  handleCheckboxChange2,
  handleCheckboxChange3
}) {
  return (
    <div className='sidebar' style={{ zIndex: 9999 }}>
      <div className='sidebar-content'>
        <div className='sidebar-content-header'>
          <Popover.Root>
            <Popover.Trigger asChild>
              <div className='mb-[50px] cursor-pointer'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='30px'
                  height='30px'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M21 21H6.2C5.07989 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V3M7 15L12 9L16 13L21 7'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              </div>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className='PopoverContent'
                side='right'
                sideOffset={20}
                style={{ zIndex: 9999 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p className='Text' style={{ marginBottom: 10 }}>
                    Графики
                  </p>
                  <fieldset className='Fieldset'>
                    <label>
                      <input type='checkbox' checked={isChecked} onChange={handleCheckboxChange} />
                      Отобразить графики
                    </label>
                  </fieldset>
                  <fieldset className='Fieldset'>
                    <label>
                      <input
                        type='checkbox'
                        checked={isChecked3}
                        onChange={handleCheckboxChange3}
                      />
                      Редактировать графики
                    </label>
                  </fieldset>
                </div>
                <Popover.Close className='PopoverClose' aria-label='Close'>
                  <Cross2Icon />
                </Popover.Close>
                <Popover.Arrow className='PopoverArrow' />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <Popover.Root>
            <Popover.Trigger asChild>
              <div className='mb-[50px] cursor-pointer'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='30px'
                  height='30px'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M12 6H12.01M9 20L3 17V4L5 5M9 20L15 17M9 20V14M15 17L21 20V7L19 6M15 17V14M15 6.2C15 7.96731 13.5 9.4 12 11C10.5 9.4 9 7.96731 9 6.2C9 4.43269 10.3431 3 12 3C13.6569 3 15 4.43269 15 6.2Z'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              </div>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className='PopoverContent'
                side='right'
                sideOffset={20}
                style={{ zIndex: 9999 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p className='Text' style={{ marginBottom: 10 }}>
                    Карта
                  </p>
                  <fieldset className='Fieldset'>
                    <label>
                      <input
                        type='checkbox'
                        checked={isChecked2}
                        onChange={handleCheckboxChange2}
                      />
                      Отобразить карту
                    </label>
                  </fieldset>
                  <fieldset className='Fieldset'>
                    <label>
                      <input type='checkbox' />
                      Слой номер 1
                    </label>
                  </fieldset>
                </div>
                <Popover.Close className='PopoverClose' aria-label='Close'>
                  <Cross2Icon />
                </Popover.Close>
                <Popover.Arrow className='PopoverArrow' />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <div
            style={{
              paddingBottom: '50px'
            }}
          >
            <GridIcon width={30} height={30} />
          </div>
        </div>
      </div>
    </div>
  )
}
