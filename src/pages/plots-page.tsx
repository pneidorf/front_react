/* eslint-disable i18next/no-literal-string */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { diff } from '@egjs/children-differ'
import { LayersIcon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'
import { useRef, useState } from 'react'
import Modal from 'react-modal'
import Moveable from 'react-moveable'
import Selecto from 'react-selecto'

import { api } from '~/shared/api'
import { HistogramRSRP } from '~/widgets/plots/ui/histogram'
import { HistogramRSRQ } from '~/widgets/plots/ui/histogram'
import { Plot } from '~/widgets/plots/ui/plot'
import { PlotRSRQ } from '~/widgets/plots/ui/plotRSRQ'

Modal.setAppElement('#root')

export const PlotsPage = () => {
  const [editPlots, setEditPlots] = useState(false)
  const [showPlots, setShowPlots] = useState<boolean>(false)
  const [showPlotsRSRQ, setShowPlotsRSRQ] = useState<boolean>(false)
  const [showHistogramRSRP, setShowHistogramRSRP] = useState<boolean>(false)
  const [showHistogramRSRQ, setShowHistogramRSRQ] = useState<boolean>(false)
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [targets, setTargets] = useState<HTMLElement[]>([])
  const [isPlotsModalOpen, setIsPlotsModalOpen] = useState(false)
  const [isPlotsRSRQModalOpen, setIsPlotsRSRQModalOpen] = useState(false)
  const [isHistogramRSRPModalOpen, setIsHistogramRSRPModalOpen] = useState(false)
  const [isHistogramRSRQModalOpen, setIsHistogramRSRQModalOpen] = useState(false)
  const [timeStart, setTimeStart] = useState('')
  const [timeEnd, setTimeEnd] = useState('')
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [inputValues, setInputValues] = useState<{
    LteMnc: string
    LteMcc: string
    LteCi: string
    LtePci: string
    LteRsrp: string
    LteRsrq: string
  }>({
    LteMnc: '',
    LteMcc: '',
    LteCi: '',
    LtePci: '',
    LteRsrp: '',
    LteRsrq: ''
  })
  const [responseData, setResponseData] = useState(null)
  const moveableRef = useRef<Moveable>(null)
  const selectoRef = useRef<Selecto>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value
    })
  }

  const handleApplyInfo = async () => {
    const params = Object.entries(inputValues)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}-${value}`)
      .join('/')

    setShowInfo(true)
    try {
      const response = await api.getInfoQuality(`${params}`)
      setResponseData(response)
    } catch (error) {
      console.error('Ошибка запроса:', error)
    } finally {
      setIsInfoModalOpen(false)
    }
  }

  const handleShowPlotsChange = () => {
    if (!showPlots) {
      setIsPlotsModalOpen(true)
    } else {
      setShowPlots(false)
    }
  }

  const handleShowPlotsRSRQChange = () => {
    if (!showPlotsRSRQ) {
      setIsPlotsRSRQModalOpen(true)
    } else {
      setShowPlotsRSRQ(false)
    }
  }

  const handleShowHistogramRSRPChange = () => {
    if (!showHistogramRSRP) {
      setIsHistogramRSRPModalOpen(true)
    } else {
      setShowHistogramRSRP(false)
    }
  }

  const handleShowHistogramRSRQChange = () => {
    if (!showHistogramRSRQ) {
      setIsHistogramRSRQModalOpen(true)
    } else {
      setShowHistogramRSRQ(false)
    }
  }

  const handlePlotsModalApply = () => {
    const formattedTimeStart = new Date(timeStart).toISOString()
    const formattedTimeEnd = new Date(timeEnd).toISOString()

    console.log(
      `График RSRP: Время начала - ${formattedTimeStart}, Время конца - ${formattedTimeEnd}`
    )

    setTimeStart(formattedTimeStart)
    setTimeEnd(formattedTimeEnd)
    setIsPlotsModalOpen(false)
    setShowPlots(true)
  }

  const handlePlotsRSRQModalApply = () => {
    const formattedTimeStart = new Date(timeStart).toISOString()
    const formattedTimeEnd = new Date(timeEnd).toISOString()

    console.log(
      `График RSRQ: Время начала - ${formattedTimeStart}, Время конца - ${formattedTimeEnd}`
    )

    setTimeStart(formattedTimeStart)
    setTimeEnd(formattedTimeEnd)
    setIsPlotsRSRQModalOpen(false)
    setShowPlotsRSRQ(true)
  }

  const handleHistogramRSRPModalApply = () => {
    const formattedTimeStart = new Date(timeStart).toISOString()
    const formattedTimeEnd = new Date(timeEnd).toISOString()

    console.log(
      `Гистограмма RSRP: Время начала - ${formattedTimeStart}, Время конца - ${formattedTimeEnd}`
    )

    setTimeStart(formattedTimeStart)
    setTimeEnd(formattedTimeEnd)
    setIsHistogramRSRPModalOpen(false)
    setShowHistogramRSRP(true)
  }

  const handleHistogramRSRQModalApply = () => {
    const formattedTimeStart = new Date(timeStart).toISOString()
    const formattedTimeEnd = new Date(timeEnd).toISOString()

    console.log(
      `Гистограмма RSRQ: Время начала - ${formattedTimeStart}, Время конца - ${formattedTimeEnd}`
    )

    setTimeStart(formattedTimeStart)
    setTimeEnd(formattedTimeEnd)
    setIsHistogramRSRQModalOpen(false)
    setShowHistogramRSRQ(true)
  }

  const handleEditPlotsChange = () => {
    setEditPlots(!editPlots)
    if (!editPlots) {
      console.log('Редактирование графиков включено')
    } else {
      console.log('Редактирование графиков выключено')
    }
  }

  const handleShowInfoChange = () => {
    if (!showInfo) {
      setIsInfoModalOpen(true)
    } else {
      setShowInfo(false)
    }
  }

  return (
    <div className='relative ml-[2rem] h-[55rem] w-[113rem] border-2 border-none'>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className='pl-10 pt-10'>
            <LayersIcon className='h-[50px] w-[50px]' />
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
              <p className='Text' style={{ marginBottom: 10 }}>
                Графики
              </p>
              <fieldset className='Fieldset'>
                <label>
                  <input type='checkbox' checked={showPlots} onChange={handleShowPlotsChange} />
                  Отобразить график RSRP
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input
                    type='checkbox'
                    checked={showPlotsRSRQ}
                    onChange={handleShowPlotsRSRQChange}
                  />
                  Отобразить график RSRQ
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input
                    type='checkbox'
                    checked={showHistogramRSRP}
                    onChange={handleShowHistogramRSRPChange}
                  />
                  Отобразить гистограмму RSRP
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input
                    type='checkbox'
                    checked={showHistogramRSRQ}
                    onChange={handleShowHistogramRSRQChange}
                  />
                  Отобразить гистограмму RSRQ
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input type='checkbox' checked={editPlots} onChange={handleEditPlotsChange} />
                  Редактировать графики
                </label>
              </fieldset>
              <fieldset className='Fieldset'>
                <label>
                  <input type='checkbox' checked={showInfo} onChange={handleShowInfoChange} />
                  Получить информацию
                </label>
              </fieldset>
            </div>
            <Popover.Close className='PopoverClose' aria-label='Close'></Popover.Close>
            <Popover.Arrow className='PopoverArrow' />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* Модальное окно для графика RSRP */}
      <Modal
        isOpen={isPlotsModalOpen}
        onRequestClose={() => setIsPlotsModalOpen(false)}
        className='modal-content'
        overlayClassName='modal-overlay'
      >
        <h2 className='mb-4 text-lg font-bold'>Укажите период времени для графика RSRP</h2>
        <form className='space-y-4'>
          <div>
            <label htmlFor='timeStart' className='mb-1 block font-medium'>
              Дата начала
            </label>
            <input
              type='datetime-local'
              id='timeStart'
              value={timeStart}
              onChange={e => setTimeStart(e.target.value)}
              className='w-full rounded border px-2 py-1'
            />
          </div>
          <div>
            <label htmlFor='timeEnd' className='mb-1 block font-medium'>
              Дата конца
            </label>
            <input
              type='datetime-local'
              id='timeEnd'
              value={timeEnd}
              onChange={e => setTimeEnd(e.target.value)}
              className='w-full rounded border px-2 py-1'
            />
          </div>
          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              className='rounded bg-gray-300 px-4 py-2'
              onClick={() => setIsPlotsModalOpen(false)}
            >
              Отменить
            </button>
            <button
              type='button'
              className='rounded bg-blue-500 px-4 py-2 text-white'
              onClick={handlePlotsModalApply}
            >
              Применить
            </button>
          </div>
        </form>
      </Modal>

      {/* Модальное окно для графика RSRQ */}
      <Modal
        isOpen={isPlotsRSRQModalOpen}
        onRequestClose={() => setIsPlotsRSRQModalOpen(false)}
        className='modal-content'
        overlayClassName='modal-overlay'
      >
        <h2 className='mb-4 text-lg font-bold'>Укажите период времени для графика RSRQ</h2>
        <form className='space-y-4'>
          <div>
            <label htmlFor='timeStart' className='mb-1 block font-medium'>
              Дата начала
            </label>
            <input
              type='datetime-local'
              id='timeStart'
              value={timeStart}
              onChange={e => setTimeStart(e.target.value)}
              className='w-full rounded border px-2 py-1'
            />
          </div>
          <div>
            <label htmlFor='timeEnd' className='mb-1 block font-medium'>
              Дата конца
            </label>
            <input
              type='datetime-local'
              id='timeEnd'
              value={timeEnd}
              onChange={e => setTimeEnd(e.target.value)}
              className='w-full rounded border px-2 py-1'
            />
          </div>
          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              className='rounded bg-gray-300 px-4 py-2'
              onClick={() => setIsPlotsRSRQModalOpen(false)}
            >
              Отменить
            </button>
            <button
              type='button'
              className='rounded bg-blue-500 px-4 py-2 text-white'
              onClick={handlePlotsRSRQModalApply}
            >
              Применить
            </button>
          </div>
        </form>
      </Modal>

      {/* Модальное окно для гистограммы RSRP */}
      <Modal
        isOpen={isHistogramRSRPModalOpen}
        onRequestClose={() => setIsHistogramRSRPModalOpen(false)}
        className='modal-content'
        overlayClassName='modal-overlay'
      >
        <h2 className='mb-4 text-lg font-bold'>Укажите период времени для гистограммы RSRP</h2>
        <form className='space-y-4'>
          <div>
            <label htmlFor='timeStart' className='mb-1 block font-medium'>
              Дата начала
            </label>
            <input
              type='datetime-local'
              id='timeStart'
              value={timeStart}
              onChange={e => setTimeStart(e.target.value)}
              className='w-full rounded border px-2 py-1'
            />
          </div>
          <div>
            <label htmlFor='timeEnd' className='mb-1 block font-medium'>
              Дата конца
            </label>
            <input
              type='datetime-local'
              id='timeEnd'
              value={timeEnd}
              onChange={e => setTimeEnd(e.target.value)}
              className='w-full rounded border px-2 py-1'
            />
          </div>
          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              className='rounded bg-gray-300 px-4 py-2'
              onClick={() => setIsHistogramRSRPModalOpen(false)}
            >
              Отменить
            </button>
            <button
              type='button'
              className='rounded bg-blue-500 px-4 py-2 text-white'
              onClick={handleHistogramRSRPModalApply}
            >
              Применить
            </button>
          </div>
        </form>
      </Modal>

      {/* Модальное окно для гистограммы RSRQ */}
      <Modal
        isOpen={isHistogramRSRQModalOpen}
        onRequestClose={() => setIsHistogramRSRQModalOpen(false)}
        className='modal-content'
        overlayClassName='modal-overlay'
      >
        <h2 className='mb-4 text-lg font-bold'>Укажите период времени для гистограммы RSRQ</h2>
        <form className='space-y-4'>
          <div>
            <label htmlFor='timeStart' className='mb-1 block font-medium'>
              Дата начала
            </label>
            <input
              type='datetime-local'
              id='timeStart'
              value={timeStart}
              onChange={e => setTimeStart(e.target.value)}
              className='w-full rounded border px-2 py-1'
            />
          </div>
          <div>
            <label htmlFor='timeEnd' className='mb-1 block font-medium'>
              Дата конца
            </label>
            <input
              type='datetime-local'
              id='timeEnd'
              value={timeEnd}
              onChange={e => setTimeEnd(e.target.value)}
              className='w-full rounded border px-2 py-1'
            />
          </div>
          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              className='rounded bg-gray-300 px-4 py-2'
              onClick={() => setIsHistogramRSRQModalOpen(false)}
            >
              Отменить
            </button>
            <button
              type='button'
              className='rounded bg-blue-500 px-4 py-2 text-white'
              onClick={handleHistogramRSRQModalApply}
            >
              Применить
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isInfoModalOpen}
        onRequestClose={() => setIsInfoModalOpen(false)}
        className='modal-content'
        overlayClassName='modal-overlay'
      >
        <h2 className='mb-4 text-lg font-bold'>Введите данные</h2>
        <form className='space-y-4'>
          {['LteMnc', 'LteMcc', 'LteCi', 'LtePci', 'LteRsrp', 'LteRsrq'].map(field => (
            <div key={field}>
              <label htmlFor={field} className='mb-1 block font-medium'>
                {field}:
              </label>
              <input
                type='number'
                id={field}
                name={field}
                value={inputValues[field as keyof typeof inputValues]}
                onChange={handleInputChange}
                className='w-full rounded border px-2 py-1'
              />
            </div>
          ))}
          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              className='rounded bg-gray-300 px-4 py-2'
              onClick={() => setIsInfoModalOpen(false)}
            >
              Отменить
            </button>
            <button
              type='button'
              className='rounded bg-blue-500 px-4 py-2 text-white'
              onClick={handleApplyInfo}
            >
              Применить
            </button>
          </div>
        </form>
      </Modal>

      <div>
        {showPlots && <Plot timeStart={timeStart} timeEnd={timeEnd} />}
        {showPlotsRSRQ && <PlotRSRQ timeStart={timeStart} timeEnd={timeEnd} />}
        {showHistogramRSRP && <HistogramRSRP timeStart={timeStart} timeEnd={timeEnd} />}
        {showHistogramRSRQ && <HistogramRSRQ timeStart={timeStart} timeEnd={timeEnd} />}

        {showInfo && (
          <div className='mt-8 rounded border p-4'>
            <h3 className='text-lg font-bold'>Результат:</h3>
            <pre className='bg-gray-100 p-2'>{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        )}
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
          selectableTargets={['.map-container-small', '.map-container-form']}
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
