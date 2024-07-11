import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, ImageOverlay, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import Moveable from 'react-moveable'
import Selecto from 'react-selecto'
import { diff } from '@egjs/children-differ'
import TogleSwitch from './SwitchTheme'
import { useMediaQuery } from 'react-responsive'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import Map from './Map'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

const Resizable = ({ onImageLoaded }) => {
  const [activeItem, setActiveItem] = useState(null)

  const [targets, setTargets] = React.useState([])
  const selectoRef = React.useRef(null)
  const moveableRef = React.useRef(null)

  const handleSelectItem = item => {
    setActiveItem(item)
  }

  const [imageBase64, setImageBase64] = useState('')
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:5000/generate_signal')

        if (result.data.imageBase64) {
          setImageBase64(result.data.imageBase64)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()

    if (onImageLoaded) {
      onImageLoaded({ imageBase64 })
    }
  }, [])

  const [isClosed, setClosed] = React.useState(false)

  const [sidebarPosition, setSidebarPosition] = useState('translate-x-full')

  const openSidebar = () => {
    setClosed(false)
    setSidebarPosition('translate-x-0')
  }

  const closeSidebar = () => {
    setClosed(true)
    setSidebarPosition('translate-x-full')
  }

  const [isChecked, setIsChecked] = useState(false)
  const [isChecked2, setIsChecked2] = useState(false)
  const [isChecked3, setIsChecked3] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }
  const handleCheckboxChange2 = () => {
    setIsChecked2(!isChecked2)
  }
  const handleCheckboxChange3 = () => {
    setIsChecked3(!isChecked3)
  }

  const [markersData, setMarkersData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://78.24.222.170:8080/api/sockets/thermalmapdata')

        if (result.data && Array.isArray(result.data)) {
          const filteredData = result.data.filter((_, index) => index % 100 === 0)
          setMarkersData(
            filteredData.map(data => ({
              position: [data.longitude, data.latitude],
              key: data.id,
              rsrp: data.rsrp,
              time: data.time
            }))
          )
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className='flex bg-gray-100'>
      {!isClosed && (
        <div
          className='bg-white w-64 min-h-screen flex flex-col application-block transform transition-transform duration-1000 ease-in-out'
          style={{
            transform: sidebarPosition,
            zIndex: 9999
          }}
        >
          <div className='bg-white border-r border-b px-4 h-10 flex items-center application-block application-header'>
            <span className='text-blue py-2'>Application</span>
          </div>

          <div className='border-r flex-grow application-block'>
            <nav>
              <ul>
                <li className='p-3'>
                  <label>
                    <input type='checkbox' checked={isChecked} onChange={handleCheckboxChange} />
                    Plots
                  </label>
                </li>
                <li className='p-3'>
                  <label>
                    <input type='checkbox' checked={isChecked2} onChange={handleCheckboxChange2} />
                    Maps
                  </label>
                </li>
                <li className='p-3'>
                  <label>
                    <input type='checkbox' checked={isChecked3} onChange={handleCheckboxChange3} />
                    Sin
                  </label>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      <div className='biggest-container'>
        {isChecked && (
          <div className='map-block'>
            <div className='map-container-small'>
              {' '}
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart width={500} height={300} data={markersData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='time' />
                  <YAxis domain={[-200, 'dataMax + 50']} />
                  <Tooltip />
                  <Legend />
                  <Line type='monotone' dataKey='rsrp' stroke='#8884d8' activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {isChecked2 && <Map isChecked2={isChecked2} />}

        <Moveable
          ref={moveableRef}
          target={targets}
          draggable={true}
          resizable={true}
          rotatable={true}
          pinchable={true}
          pinchOutside={true}
          onRender={e => {
            e.target.style.cssText += e.cssText
          }}
          onClickGroup={e => {
            selectoRef.current.clickTarget(e.inputEvent, e.inputTarget)
          }}
          onDrag={e => {
            e.target.style.transform = e.transform
          }}
          onDragGroup={e => {
            e.events.forEach(ev => {
              ev.target.style.transform = ev.transform
            })
          }}
          onClick={e => {
            if (e.isDouble) {
              const inputTarget = e.inputTarget
              const selectableElements = selectoRef.current.getSelectedElements()

              if (selectableElements.includes(inputTarget)) {
                selectoRef.current.setSelectedTargets([inputTarget])
                setTargets([inputTarget])
              }
            }
          }}
        />
        <Selecto
          ref={selectoRef}
          dragContainer={window}
          selectableTargets={['.map-wrapper', '.map-container-small']}
          hitRate={0}
          selectByClick={true}
          selectFromInside={false}
          toggleContinueSelect={['shift']}
          ratio={0}
          onDragStart={e => {
            const moveable = moveableRef.current
            const target = e.inputEvent.target
            if (
              moveable.isMoveableElement(target) ||
              targets.some(t => t === target || t.contains(target))
            ) {
              e.stop()
            }
          }}
          onSelectEnd={e => {
            const moveable = moveableRef.current
            let selected = e.selected

            selected = selected.filter(target => {
              return selected.every(target2 => {
                return target === target2 || !target2.contains(target)
              })
            })

            const result = diff(e.startSelected, selected)

            e.currentTarget.setSelectedTargets(selected)

            if (!result.added.length && !result.removed.length) {
              return
            }
            if (e.isDragStartEnd) {
              e.inputEvent.preventDefault()

              moveable.waitToChangeTarget().then(() => {
                moveable.dragStart(e.inputEvent)
              })
            }
            setTargets(selected)
          }}
        />
      </div>

      <main className='flex-grow flex flex-col min-h-screen'>
        <header
          className='bg-white border-b h-10 flex items-center justify-center main-header'
          style={{
            transform: sidebarPosition,
            zIndex: 9999
          }}
        >
          {isClosed ? (
            <button
              tabIndex='1'
              aria-label='Открыть меню'
              title='Open menu'
              className='w-10 p-1 main-button min-w-8'
              onClick={openSidebar}
            >
              <svg
                aria-hidden='true'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path d='M4 6h16M4 12h16M4 18h16'></path>
              </svg>
            </button>
          ) : (
            <button
              tabIndex='1'
              aria-label='Закрыть меню'
              title='Close menu'
              className='w-10 p-1 main-button min-w-8'
              onClick={closeSidebar}
            >
              <svg
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path d='M6 18L18 6M6 6l12 12'></path>
              </svg>
            </button>
          )}
          <div className='flex flex-grow items-center justify-between px-3'>
            <h1>Домой</h1>
            <TogleSwitch />
            <button className='text-blue-700 underline'>Войти</button>
          </div>
        </header>
      </main>
    </div>
  )
}

export default Resizable
