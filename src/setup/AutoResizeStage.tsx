import React, { FunctionComponent, useRef, useEffect } from 'react'
import { Stage, Container } from '@inlet/react-pixi'
import { Application } from 'pixi.js'

import { useSize } from './getSizeProps'

export const AutoResizeStage: FunctionComponent = ({ children }) => {
  const sizeProps = useSize()
  const appRef = useRef<Application | null>(null)

  useEffect(() => {
    const app = appRef.current
    if (app) {
      const canvas = app.view
      canvas.style.width = `${sizeProps.canvas.width}px`
      canvas.style.height = `${sizeProps.canvas.height}px`
    }
  }, [sizeProps.canvas])

  return (
    <>
      <Stage
        {...sizeProps.renderer}
        onMount={app => (appRef.current = app)}
        options={{
          backgroundColor: 0xabcdef,
        }}
      >
        <Container {...sizeProps.stage}>{children}</Container>
      </Stage>
    </>
  )
}
