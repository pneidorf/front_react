import React, { useEffect, useState, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import Moveable from 'react-moveable'
import Selecto from 'react-selecto'
import { diff } from '@egjs/children-differ'
import TogleSwitch from './SwitchTheme'
import Map from './Map'
import Graph from './Graph'
import Sidebar from './Sidebar'
import Header from './Header'

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

  return (
    <div className='flex bg-gray-100'>
      {/* 
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
        */}

      <Sidebar />

      <div className='biggest-container'>
        {isChecked && <Graph isChecked1={isChecked} />}

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
        {/* 
        <header
          className='bg-white border-b h-10 flex items-center justify-center main-header'
          style={{
            transform: sidebarPosition,
            zIndex: 9999
          }}
        >
          <div className='flex flex-grow items-center justify-between px-3'>
            <TogleSwitch />
            <button className='text-blue-700 underline'>Войти</button>
          </div>
        </header>
        */}
        <Header />
      </main>
    </div>
  )
}

export default Resizable
