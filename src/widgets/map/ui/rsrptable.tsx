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
