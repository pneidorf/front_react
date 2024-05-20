import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProjectDescription from './components/ProjectDescription';
import WindowBlock from './components/WindowBlock';
import Registration from './components/Registration';
import AppRouter from './components/AppRouter';


class App extends React.Component {
  render () {
    return (
      <div className="App">
        <Header />
        <AppRouter></AppRouter>
      </div>
    )
  }

}

export default App;
