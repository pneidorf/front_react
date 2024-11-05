/* eslint-disable i18next/no-literal-string */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { diff } from '@egjs/children-differ'
import { PieChartIcon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'
import { useRef } from 'react'
import { useState } from 'react'
import Moveable from 'react-moveable'
import Selecto from 'react-selecto'

import { Diagram } from '~/widgets/diagrams/ui/diagram'

export const DiagramsPage = () => {
  const [editPlots, setEditPlots] = useState(false)

  const [showPlots, setShowPlots] = useState<boolean>(false)
  const [targets, setTargets] = useState<HTMLElement[]>([])
  const moveableRef = useRef<Moveable>(null)
  const selectoRef = useRef<Selecto>(null)

  const handleShowPlotsChange = () => {
    setShowPlots(!showPlots)
    if (!showPlots) {
      console.log('Отображение диаграмм включено')
    } else {
      console.log('Отображение диаграмм выключено')
    }
  }

  const handleEditPlotsChange = () => {
    setEditPlots(!editPlots)
    if (!editPlots) {
      console.log('Редактирование диаграмм включено')
    } else {
      console.log('Редактирование диаграмм выключено')
    }
  }

  return (
    <div className='relative ml-[2rem] h-[55rem] w-[113rem] border-2 border-none'>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className='pl-10 pt-10'>
            <PieChartIcon className='h-[50px] w-[50px]' />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className='PopoverContent bg-tertiary'
            side='right'
            sideOffset={20}
            style={{ zIndex: 9999 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p className='Text pb-2'>Диаграммы</p>
              <fieldset className='Fieldset'>
                <label>
                  <input type='checkbox' checked={showPlots} onChange={handleShowPlotsChange} />
                  Отобразить диаграмму
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input type='checkbox' checked={editPlots} onChange={handleEditPlotsChange} />
                  Редактировать диаграмму
                </label>
              </fieldset>
            </div>
            <Popover.Close className='PopoverClose' aria-label='Close'></Popover.Close>
            <Popover.Arrow className='PopoverArrow' />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <div>
        {showPlots && <Diagram />}
        <Moveable
          ref={moveableRef}
          target={targets}
          draggable={true}
          resizable={true}
          rotatable={true}
          pinchable={true}
          pinchOutside={true}
          edge={true}
          keepRatio={true}
          snappable={true}
          bounds={{
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            position: 'css'
          }}
          onRender={(e: any) => {
            e.target.style.cssText += e.cssText
          }}
          onClickGroup={(e: any) => {
            selectoRef.current && selectoRef.current.clickTarget(e.inputEvent, e.inputTarget)
          }}
          onDrag={(e: any) => {
            e.target.style.transform = e.transform
          }}
          onDragGroup={(e: any) => {
            e.events.forEach((ev: any) => {
              ev.target.style.transform = ev.transform
            })
          }}
          onClick={(e: any) => {
            if (e.isDouble) {
              const inputTarget = e.inputTarget as HTMLElement
              const selectableElements = selectoRef.current!.getSelectableElements()

              if (selectableElements.includes(inputTarget)) {
                selectoRef.current!.setSelectedTargets([inputTarget])
                setTargets([inputTarget])
              }
            }
          }}
        />
        <Selecto
          ref={selectoRef}
          dragContainer={window}
          selectableTargets={['.diagram-container-small', '.map-container-form']}
          hitRate={0}
          selectByClick={true}
          selectFromInside={false}
          toggleContinueSelect={['shift']}
          ratio={0}
          onDragStart={(e: any) => {
            const moveable = moveableRef.current
            const target = e.inputEvent.target as HTMLElement

            if (
              moveable?.isMoveableElement(target) ||
              targets.some(t => t === target || t.contains(target))
            ) {
              e.stop()
            }
          }}
          onSelectEnd={(e: any) => {
            const moveable = moveableRef.current
            let selected = e.selected as HTMLElement[]

            selected = selected.filter(target =>
              selected.every(target2 => target === target2 || !target2.contains(target))
            )

            const result = diff(e.startSelected, selected)

            e.currentTarget.setSelectedTargets(selected)

            if (!result.added.length && !result.removed.length) {
              return
            }
            if (e.isDragStartEnd) {
              e.inputEvent.preventDefault()

              moveable?.waitToChangeTarget().then(() => {
                moveable?.dragStart(e.inputEvent)
              })
            }
            setTargets(selected)
          }}
        />
      </div>
    </div>
  )
}
