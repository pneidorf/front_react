import React from 'react'
import AppRouter from './components/AppRouter'
const defaultTheme = 'lightTheme'
document.documentElement.setAttribute('data-theme', defaultTheme)
import Header from './components/Header'

class App extends React.Component {
  render() {
    return (
      <div className='App'>
        <Header />
        <AppRouter></AppRouter>
      </div>
    )
  }
}

export default App
