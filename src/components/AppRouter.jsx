import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Registration from './Registration'
import PreRegistration from './PreRegistration'
import Resizable from './Resizable'
import PageMap from './PageMap'

class AppRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Registration />} />
          <Route path='/prereg' element={<PreRegistration />} />
          <Route path='main' element={<Resizable />} />
          <Route path='map' element={<PageMap />} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default AppRouter
