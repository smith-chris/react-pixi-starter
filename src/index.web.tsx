import { setConfig } from 'react-hot-loader'
import React from 'react'
import { render } from 'react-dom'

setConfig({
  showReactDomPatchNotification: false,
})

import 'config/picoFont'
import { Web } from 'Web'

const rootElement = document.getElementById('game')

render(<Web />, rootElement)
