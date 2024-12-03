export const RsrpColorTable = () => {
  const colorRanges = [
    {
      range: '-120 дБм',
      gradientColors: ['#4C004C', '#C71585']
    },
    {
      range: '-110 дБм',
      gradientColors: ['#C71585', '#DC143C']
    },
    {
      range: '-100 дБм',
      gradientColors: ['#DC143C', '#FF7F50']
    },
    {
      range: '-90 дБм',
      gradientColors: ['#FF7F50', '#FFA07A']
    },
    {
      range: '-80 дБм',
      gradientColors: ['#FFA07A', '#FFFFE0']
    },
    {
      range: '-70 дБм',
      gradientColors: ['#FFFFE0', '#fffee0']
    }
  ]

  return (
    <div className='absolute right-10 top-[33rem] z-20 bg-white shadow-md'>
      <table className='table-auto'>
        <thead>
          <tr>
            <th className='border px-4 py-2 font-bold text-black'>RSRP</th>
          </tr>
        </thead>
        <tbody>
          {colorRanges.map((item, index) => (
            <tr key={index}>
              <td
                className='border px-4 py-2 font-bold'
                style={{
                  background: `linear-gradient(to bottom, ${item.gradientColors.join(', ')})`,
                  color: item.range === '-120 дБм' ? '#FFFFFF' : '#000000',
                  height: '50px',
                  textAlign: 'center'
                }}
              >
                {item.range}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const JetColorTable = () => {
  const colorRanges = [
    {
      range: '-120 дБм',
      gradientColors: [
        'rgba(0, 0, 127, 255)',
        'rgba(0, 0, 163, 255)',
        'rgba(0, 0, 222, 255)',
        'rgba(0, 0, 255, 255)',
        'rgba(0, 24, 255, 255)'
      ]
    },
    {
      range: '-110 дБм',
      gradientColors: [
        'rgba(0, 40, 255, 255)',
        'rgba(0, 76, 255, 255)',
        'rgba(0, 128, 255, 255)',
        'rgba(0, 160, 255, 255)',
        'rgba(0, 196, 255, 255)'
      ]
    },
    {
      range: '-100 дБм',
      gradientColors: [
        'rgba(0, 212, 255, 255)',
        'rgba(12, 244, 234, 255)',
        'rgba(54, 255, 192, 255)',
        'rgba(83, 255, 163, 255)',
        'rgba(108, 255, 137, 255)'
      ]
    },
    {
      range: '-90 дБм',
      gradientColors: [
        'rgba(124, 255, 121, 255)',
        'rgba(163, 255, 83, 255)',
        'rgba(192, 255, 54, 255)',
        'rgba(218, 255, 28, 255)',
        'rgba(247, 244, 0, 255)'
      ]
    },
    {
      range: '-80 дБм',
      gradientColors: [
        'rgba(255, 229, 0, 255)',
        'rgba(255, 181, 0, 255)',
        'rgba(255, 148, 0, 255)',
        'rgba(255, 118, 0, 255)',
        'rgba(255, 85, 0, 255)'
      ]
    },
    {
      range: '-70 дБм',
      gradientColors: [
        'rgba(255, 70, 0, 255)',
        'rgba(255, 22, 0, 255)',
        'rgba(222, 0, 0, 255)',
        'rgba(163, 0, 0, 255)',
        'rgba(127, 0, 0, 255)'
      ]
    }
  ]

  return (
    <div className='absolute right-10 top-[33rem] z-20 bg-white shadow-md'>
      <table className='table-auto'>
        <thead>
          <tr>
            <th className='border px-4 py-2 font-bold text-black'>RSRP</th>
          </tr>
        </thead>
        <tbody>
          {colorRanges.map((item, index) => (
            <tr key={index}>
              <td
                className='border px-4 py-2 font-bold'
                style={{
                  background: `linear-gradient(to bottom, ${item.gradientColors.join(', ')})`,
                  color: item.range === '-120 дБм' ? '#FFFFFF' : '#000000',
                  height: '50px',
                  textAlign: 'center'
                }}
              >
                {item.range}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// export const RSRQJetTable = () => {
//   const colorRanges = [
//     {
//       range: '-20 дБ',
//       gradientColors: [
//         'rgba(0, 0, 127, 255)',
//         'rgba(0, 0, 186, 255)',
//         'rgba(0, 0, 245, 255)',
//         'rgba(0, 32, 255, 255)',
//         'rgba(0, 84, 255, 255)',
//         'rgba(0, 140, 255, 255)'
//       ]
//     },
//     {
//       range: '-15 дБ',
//       gradientColors: [
//         'rgba(0, 192, 255, 255)',
//         'rgba(15, 248, 231, 255)',
//         'rgba(57, 255, 189, 255)',
//         'rgba(102, 255, 144, 255)',
//         'rgba(144, 255, 102, 255)'
//       ]
//     },
//     {
//       range: '-10 дБ',
//       gradientColors: [
//         'rgba(189, 255, 57, 255)',
//         'rgba(231, 255, 15, 255)',
//         'rgba(255, 211, 0, 255)',
//         'rgba(255, 163, 0, 255)',
//         'rgba(255, 111, 0, 255)'
//       ]
//     },
//     {
//       range: '-5 дБ',
//       gradientColors: [
//         'rgba(255, 63, 0, 255)',
//         'rgba(245, 11, 0, 255)',
//         'rgba(186, 0, 0, 255)',
//         'rgba(127, 0, 0, 255)'
//       ]
//     }
//   ]

//   return (
//     <div className='absolute right-10 top-[38rem] z-20 bg-white shadow-md'>
//       <table className='table-auto'>
//         <thead>
//           <tr>
//             <th className='border px-4 py-2 font-bold text-black'>RSRQ</th>
//           </tr>
//         </thead>
//         <tbody>
//           {colorRanges.map((item, index) => (
//             <tr key={index}>
//               <td
//                 className='border px-4 py-2 font-bold'
//                 style={{
//                   background: `linear-gradient(to bottom, ${item.gradientColors.join(', ')})`,
//                   color: item.range === '-20 дБ' ? '#FFFFFF' : '#000000',
//                   height: '50px',
//                   textAlign: 'center'
//                 }}
//               >
//                 {item.range}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

export const RSRQMagmaTable = () => {
  const colorRanges = [
    {
      range: '-20 дБ',
      gradientColors: [
        'rgba(0, 0, 3, 255)',
        'rgba(7, 5, 27, 255)',
        'rgba(21, 14, 56, 255)',
        'rgba(40, 17, 89, 255)',
        'rgba(62, 15, 114, 255)',
        'rgba(85, 19, 125, 255)'
      ]
    },
    {
      range: '-15 дБ',
      gradientColors: [
        'rgba(105, 28, 128, 255)',
        'rgba(127, 36, 129, 255)',
        'rgba(148, 43, 128, 255)',
        'rgba(171, 51, 124, 255)',
        'rgba(192, 58, 117, 255)'
      ]
    },
    {
      range: '-10 дБ',
      gradientColors: [
        'rgba(214, 68, 108, 255)',
        'rgba(231, 82, 98, 255)',
        'rgba(244, 104, 91, 255)',
        'rgba(250, 128, 94, 255)',
        'rgba(253, 155, 106, 255)'
      ]
    },
    {
      range: '-5 дБ',
      gradientColors: [
        'rgba(254, 179, 123, 255)',
        'rgba(253, 205, 144, 255)',
        'rgba(252, 229, 166, 255)',
        'rgba(251, 252, 191, 255)'
      ]
    }
  ]

  return (
    <div className='absolute right-10 top-[38rem] z-20 bg-white shadow-md'>
      <table className='table-auto'>
        <thead>
          <tr>
            <th className='border px-4 py-2 font-bold text-black'>RSRQ</th>
          </tr>
        </thead>
        <tbody>
          {colorRanges.map((item, index) => (
            <tr key={index}>
              <td
                className='border px-4 py-2 font-bold'
                style={{
                  background: `linear-gradient(to bottom, ${item.gradientColors.join(', ')})`,
                  color: item.range === '-20 дБ' ? '#FFFFFF' : '#000000',
                  height: '50px',
                  textAlign: 'center'
                }}
              >
                {item.range}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const RSRQJetTable = () => {
  const colorRanges = [
    {
      range: '-20 дБ',
      gradientColors: [
        'rgba(0, 0, 127, 255)',
        'rgba(0, 0, 186, 255)',
        'rgba(0, 0, 245, 255)',
        'rgba(0, 32, 255, 255)',
        'rgba(0, 84, 255, 255)',
        'rgba(0, 140, 255, 255)'
      ]
    },
    {
      range: '-15 дБ',
      gradientColors: [
        'rgba(0, 192, 255, 255)',
        'rgba(15, 248, 231, 255)',
        'rgba(57, 255, 189, 255)',
        'rgba(102, 255, 144, 255)',
        'rgba(144, 255, 102, 255)'
      ]
    },
    {
      range: '-10 дБ',
      gradientColors: [
        'rgba(189, 255, 57, 255)',
        'rgba(231, 255, 15, 255)',
        'rgba(255, 211, 0, 255)',
        'rgba(255, 163, 0, 255)',
        'rgba(255, 111, 0, 255)'
      ]
    },
    {
      range: '-5 дБ',
      gradientColors: [
        'rgba(255, 63, 0, 255)',
        'rgba(245, 11, 0, 255)',
        'rgba(186, 0, 0, 255)',
        'rgba(127, 0, 0, 255)'
      ]
    }
  ]

  return (
    <div className='absolute right-10 top-[38rem] z-20 bg-white shadow-md'>
      <table className='table-auto'>
        <thead>
          <tr>
            <th className='border px-4 py-2 font-bold text-black'>RSRQ</th>
          </tr>
        </thead>
        <tbody>
          {colorRanges.map((item, index) => (
            <tr key={index}>
              <td
                className='border px-4 py-2 font-bold'
                style={{
                  background: `linear-gradient(to bottom, ${item.gradientColors.join(', ')})`,
                  color: item.range === '-20 дБ' ? '#FFFFFF' : '#000000',
                  height: '50px',
                  textAlign: 'center'
                }}
              >
                {item.range}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const PCIMod3Table = () => {
  const colorRanges = [
    {
      range: '0',
      gradientColors: ['rgba(0, 0, 127, 255)', 'rgba(0, 0, 127, 255)']
    },
    {
      range: '1',
      gradientColors: ['rgba(124, 255, 121, 255)', 'rgba(124, 255, 121, 255)']
    },
    {
      range: '2',
      gradientColors: ['rgba(127, 0, 0, 255)', 'rgba(127, 0, 0, 255)']
    }
  ]

  return (
    <div className='absolute right-10 top-[38rem] z-20 bg-white shadow-md'>
      <table className='table-auto'>
        <thead>
          <tr>
            <th className='border px-4 py-2 font-bold text-black'>PCI</th>
          </tr>
        </thead>
        <tbody>
          {colorRanges.map((item, index) => (
            <tr key={index}>
              <td
                className='border px-4 py-2 font-bold'
                style={{
                  background: `linear-gradient(to bottom, ${item.gradientColors.join(', ')})`,
                  color: item.range === '0' ? '#FFFFFF' : '#000000',
                  height: '50px',
                  textAlign: 'center'
                }}
              >
                {item.range}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const PCIMod6Table = () => {
  const colorRanges = [
    {
      range: '0',
      gradientColors: ['rgba(0, 0, 127, 255)', 'rgba(0, 0, 127, 255)']
    },
    {
      range: '1',
      gradientColors: ['rgba(0, 76, 255, 255)', 'rgba(0, 76, 255, 255)']
    },
    {
      range: '2',
      gradientColors: ['rgba(41, 255, 205, 255)', 'rgba(41, 255, 205, 255)']
    },
    {
      range: '3',
      gradientColors: ['rgba(205, 255, 41, 255)', 'rgba(205, 255, 41, 255)']
    },
    {
      range: '4',
      gradientColors: ['rgba(255, 103, 0, 255)', 'rgba(255, 103, 0, 255)']
    },
    {
      range: '5',
      gradientColors: ['rgba(127, 0, 0, 255)', 'rgba(127, 0, 0, 255)']
    }
  ]

  return (
    <div className='absolute right-10 top-[30rem] z-20 bg-white shadow-md'>
      <table className='table-auto'>
        <thead>
          <tr>
            <th className='border px-4 py-2 font-bold text-black'>PCI</th>
          </tr>
        </thead>
        <tbody>
          {colorRanges.map((item, index) => (
            <tr key={index}>
              <td
                className='border px-4 py-2 font-bold'
                style={{
                  background: `linear-gradient(to bottom, ${item.gradientColors.join(', ')})`,
                  color: item.range === '0' ? '#FFFFFF' : '#000000',
                  height: '50px',
                  textAlign: 'center'
                }}
              >
                {item.range}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
