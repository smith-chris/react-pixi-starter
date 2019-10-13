import React, { FunctionComponent } from 'react'
import { Stage, Container } from '@inlet/react-pixi'

import { getSizeProps } from 'setup/getSizeProps'
import { useWindowSize } from 'hooks/useWindowSize'

export const AutoResizeStage: FunctionComponent = ({ children }) => {
  const size = useWindowSize()
  const sizeProps = getSizeProps({ ...size, ratio: 1 })

  return (
    <Stage {...sizeProps.renderer} options={{ backgroundColor: 0xabcdef }}>
      <Container {...sizeProps.stage}>{children}</Container>
    </Stage>
  )
}
