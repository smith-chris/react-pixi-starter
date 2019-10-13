import 'setup/pixiSettings'
import 'setup/picoFont'
import { setConfig } from 'react-hot-loader'
setConfig({
  showReactDomPatchNotification: false,
})

import React from 'react'
import { render } from 'react-dom'

import { Web } from 'setup/Web'

const rootElement = document.getElementById('game')

render(<Web />, rootElement)
