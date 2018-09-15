import React from 'react'
import ReactDOM from 'react-dom'
import 'semantic-ui-css/semantic.min.css'
import StitchApp from './StitchApp'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <StitchApp appId="stitchcraft-picstream-kcpaj" />,
  document.getElementById('root')
)
registerServiceWorker()
