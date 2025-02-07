/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable i18next/no-literal-string */
import { diff } from '@egjs/children-differ'
import { LayersIcon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'
import { useEffect, useRef, useState } from 'react'
import { useMemo } from 'react'
import Modal from 'react-modal'
import Moveable from 'react-moveable'
import Selecto from 'react-selecto'

import { api } from '~/shared/api'
import { HistogramRSRP } from '~/widgets/plots/ui/histogram'
import { HistogramRSRQ } from '~/widgets/plots/ui/histogram'
import { Plot } from '~/widgets/plots/ui/plot'

Modal.setAppElement('#root')
interface Operator {
  code: string
  name: string
}

export const PlotsPage = () => {
  const [showDisplayPlots, setShowDisplayPlots] = useState<boolean>(false)
  const [showPlots, setShowPlots] = useState<boolean>(false)
  const [showHistogramRSRP, setShowHistogramRSRP] = useState<boolean>(false)
  const [showHistogramRSRQ, setShowHistogramRSRQ] = useState<boolean>(false)
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [targets, setTargets] = useState<HTMLElement[]>([])
  const [isHistogramRSRPModalOpen, setIsHistogramRSRPModalOpen] = useState(false)
  const [isHistogramRSRQModalOpen, setIsHistogramRSRQModalOpen] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<string>(
    () => localStorage.getItem('selectedMetric') || ''
  )
  const [operators, setOperators] = useState<Operator[]>([])
  const [selectedOperator, setSelectedOperator] = useState<string>(
    () => localStorage.getItem('selectedOperator') || ''
  )
  const [cellIds, setCellIds] = useState<string[]>([])
  const [selectedCellId, setSelectedCellId] = useState<string>(
    () => localStorage.getItem('selectedCellId') || ''
  )
  const [bands, setBands] = useState<string[]>([])
  const [selectedBand, setSelectedBand] = useState<string>(
    () => localStorage.getItem('selectedBand') || ''
  )
  const [timeStart, setTimeStart] = useState<string>(() => localStorage.getItem('timeStart') || '')
  const [timeEnd, setTimeEnd] = useState<string>(() => localStorage.getItem('timeEnd') || '')
  const [isFinalRequest, setIsFinalRequest] = useState<boolean>(false)

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
  const operatorNames: { [key: string]: string } = useMemo(
    () => ({
      '99': 'Билайн',
      '1': 'МТС',
      '2': 'Мегафон'
    }),
    []
  )

  useEffect(() => {
    if (selectedMetric) {
      api
        .getMnc()
        .then((mncCodes: number[]) => {
          const formattedOperators = mncCodes.map(code => ({
            code: String(code),
            name: operatorNames[String(code)] || `Оператор ${code}`
          }))

          setOperators(formattedOperators)
        })
        .catch(console.error)
    }
  }, [selectedMetric, operatorNames])

  useEffect(() => {
    if (selectedOperator) {
      api
        .getCellId(selectedOperator)
        .then((response: string[]) => {
          setCellIds(response || [])
        })
        .catch(error => {
          console.error('Ошибка при получении Cell ID:', error)
          setCellIds([])
        })
    }
  }, [selectedOperator])

  useEffect(() => {
    if (selectedCellId) {
      api
        .getBand(selectedOperator, selectedCellId)
        .then((response: string[]) => {
          setBands(response || [])
        })
        .catch(error => {
          console.error('Ошибка при получении Band:', error)
          setBands([])
        })
    }
  }, [selectedCellId, selectedOperator])

  useEffect(() => {
    localStorage.setItem('selectedMetric', selectedMetric)
    localStorage.setItem('selectedOperator', selectedOperator)
    localStorage.setItem('selectedCellId', selectedCellId)
    localStorage.setItem('selectedBand', selectedBand)
    localStorage.setItem('timeStart', timeStart)
    localStorage.setItem('timeEnd', timeEnd)
  }, [selectedMetric, selectedOperator, selectedCellId, selectedBand, timeStart, timeEnd])

  const handleShowPlotsChange = () => {
    setShowPlots(!showPlots)
    setShowDisplayPlots(false)
    setIsFinalRequest(false)
  }

  const handleFinalRequest = () => {
    setShowDisplayPlots(true)
    setIsFinalRequest(true)
  }

  const handleReset = () => {
    setIsFinalRequest(false)
    setSelectedMetric('')
    setSelectedOperator('')
    setSelectedCellId('')
    setSelectedBand('')
    setTimeStart('')
    setTimeEnd('')
    localStorage.removeItem('selectedMetric')
    localStorage.removeItem('selectedOperator')
    localStorage.removeItem('selectedCellId')
    localStorage.removeItem('selectedBand')
    localStorage.removeItem('timeStart')
    localStorage.removeItem('timeEnd')
  }

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
                  Отобразить графики
                </label>
              </fieldset>
              {showPlots && (
                <>
                  <select
                    value={selectedMetric}
                    onChange={e => setSelectedMetric(e.target.value)}
                    disabled={isFinalRequest}
                  >
                    <option value=''>Выберите метрику</option>
                    <option value='RSRP'>RSRP</option>
                    <option value='RSRQ'>RSRQ</option>
                  </select>

                  <select
                    value={selectedOperator}
                    onChange={e => setSelectedOperator(e.target.value)}
                    disabled={!selectedMetric || isFinalRequest}
                  >
                    <option value=''>Выберите оператора</option>
                    {operators.map(op => (
                      <option key={op.code} value={op.code}>
                        {op.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedCellId}
                    onChange={e => setSelectedCellId(e.target.value)}
                    disabled={!selectedOperator || isFinalRequest}
                  >
                    <option value=''>Выберите Cell ID</option>
                    {cellIds.map(ci => (
                      <option key={ci} value={ci}>
                        {ci}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedBand}
                    onChange={e => setSelectedBand(e.target.value)}
                    disabled={!selectedCellId || isFinalRequest}
                  >
                    <option value=''>Выберите Band</option>
                    {bands.map(band => (
                      <option key={band} value={band}>
                        {band}
                      </option>
                    ))}
                  </select>

                  <input
                    type='datetime-local'
                    value={timeStart ? new Date(timeStart).toISOString().slice(0, 19) : ''}
                    onChange={e => setTimeStart(new Date(e.target.value).toISOString())}
                    disabled={!selectedBand || isFinalRequest}
                  />

                  <input
                    type='datetime-local'
                    value={timeEnd ? new Date(timeEnd).toISOString().slice(0, 19) : ''}
                    onChange={e => setTimeEnd(new Date(e.target.value).toISOString())}
                    disabled={!selectedBand || isFinalRequest}
                  />

                  <button
                    className='rounded bg-blue-500 p-2 text-white'
                    onClick={handleFinalRequest}
                    disabled={!selectedBand || !timeStart || !timeEnd || isFinalRequest}
                  >
                    Отобразить
                  </button>
                </>
              )}

              {isFinalRequest && (
                <button className='rounded bg-gray-500 p-2 text-white' onClick={handleReset}>
                  Сбросить выбор
                </button>
              )}

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
        {showDisplayPlots && (
          <Plot
            timeStart={timeStart}
            timeEnd={timeEnd}
            selectedMetric={selectedMetric}
            selectedOperator={selectedOperator}
            selectedCellId={selectedCellId}
            selectedBand={selectedBand}
          />
        )}{' '}
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
