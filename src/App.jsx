import React from 'react'
import Header from './components/Header'
import AppRouter from './components/AppRouter'
const defaultTheme = 'lightTheme'
document.documentElement.setAttribute('data-theme', defaultTheme)

class App extends React.Component {
  render() {
    return (
      <div className='App'>
        <AppRouter></AppRouter>
      </div>
    )
  }
}

export default App
