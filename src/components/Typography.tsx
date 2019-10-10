import React, { ComponentProps, FunctionComponent } from 'react'
import { BitmapText } from '@inlet/react-pixi'
// import { hot } from 'react-hot-loader/root'

type Props = Omit<ComponentProps<typeof BitmapText>, 'text'> & {
  size?: number
}
export const Typography: FunctionComponent<Props> = ({
  children,
  size = 18,
  ...props
}) => {
  return (
    <BitmapText
      style={{ font: { name: 'PICO-8', size } }}
      {...props}
      text={Array.isArray(children) ? children.join('') : String(children)}
    />
  )
}

// export const TypographyHot = hot(Typography)
