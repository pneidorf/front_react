import React from 'react'
import ProjectDescription from './ProjectDescription'
import WindowBlock from './WindowBlock'

class MainPage extends React.Component {
  render() {
    return (
      <div className='App'>
        <ProjectDescription />
        <aside>
          <WindowBlock />
        </aside>
      </div>
    )
  }
}

export default MainPage
