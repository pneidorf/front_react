// import { MapboxOverlay as DeckOverlay, MapboxOverlayProps } from '@deck.gl/mapbox'
// import { ScatterplotLayer } from 'deck.gl'
// import 'maplibre-gl/dist/maplibre-gl.css'
// import React, { useEffect, useState } from 'react'
// import { Map, NavigationControl, Popup, useControl } from 'react-map-gl/maplibre'

// const INITIAL_VIEW_STATE = {
//   latitude: 55.0295, // Центр Новосибирска
//   longitude: 83.027,
//   zoom: 13,
//   bearing: 0,
//   pitch: 30
// }

// const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

// function DeckGLOverlay(props: MapboxOverlayProps) {
//   const overlay = useControl(() => new DeckOverlay(props))
//   overlay.setProps(props)
//   return null
// }

// export const MapDeck: React.FC = () => {
//   const [selected, setSelected] = useState(null)
//   const [data, setData] = useState([])

//   // Загрузка данных из JSON файла
//   useEffect(() => {
//     // Здесь путь к вашему JSON файлу
//     fetch('result.json')
//       .then(response => response.json())
//       .then(data => setData(data))
//       .catch(error => console.error('Error loading JSON:', error))
//   }, [])

//   // Создаем слой для визуализации точек по RSRP
//   const layers = [
//     new ScatterplotLayer({
//       id: 'rsrp-layer',
//       data: data,
//       pickable: true,
//       opacity: 0.8,
//       stroked: false,
//       filled: true,
//       radiusScale: 200,
//       radiusMinPixels: 2,
//       radiusMaxPixels: 10,
//       getPosition: d => [parseFloat(d.longitude), parseFloat(d.latitude)], // Преобразуем строковые значения в числа
//       getFillColor: d => {
//         const rsrp = parseInt(d.rsrp, 10)
//         if (rsrp > -85) return [0, 200, 0] // Зеленый: хороший сигнал
//         if (rsrp > -95) return [255, 165, 0] // Оранжевый: средний сигнал
//         return [200, 0, 0] // Красный: слабый сигнал
//       },
//       onClick: info => setSelected(info.object)
//     })
//   ]

//   return (
//     <Map initialViewState={INITIAL_VIEW_STATE} mapStyle={MAP_STYLE}>
//       {selected && (
//         <Popup
//           key={selected.uuid}
//           anchor='bottom'
//           longitude={parseFloat(selected.longitude)}
//           latitude={parseFloat(selected.latitude)}
//           onClose={() => setSelected(null)}
//         >
//           <div>
//             <strong>UUID: {selected.uuid}</strong>
//             <br />
//             Time: {selected.time}
//             <br />
//             RSRP: {selected.rsrp} dBm
//             <br />
//             RSSI: {selected.rssi} dBm
//           </div>
//         </Popup>
//       )}
//       <DeckGLOverlay layers={layers} />
//       <NavigationControl position='top-left' />
//     </Map>
//   )
// }

// // /* Запуск приложения */
// // const container = document.body.appendChild(document.createElement('div'))
// // createRoot(container).render(<Root />)
