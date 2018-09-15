import React from 'react'
import ReactDOM from 'react-dom'
import StitchApp from './StitchApp'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<StitchApp />, div)
  ReactDOM.unmountComponentAtNode(div)
})
