import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './Registration';
import PreRegistration from './PreRegistration';
import MainPage from './MainPage';

class AppRouter extends React.Component {
    render () {
      return (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Registration />} />
              <Route path="/prereg" element={<PreRegistration />} />
              <Route path="main" element={<MainPage />} />
            </Routes>
          </BrowserRouter>
      )
    }
  
  }
  
  export default AppRouter;