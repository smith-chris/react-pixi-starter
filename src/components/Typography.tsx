import React, { ComponentProps, FunctionComponent } from 'react'
import { BitmapText } from '@inlet/react-pixi'

export type TypographyProps = Omit<
  ComponentProps<typeof BitmapText>,
  'text'
> & {
  size?: number
}
export const Typography: FunctionComponent<TypographyProps> = ({
  children,
  size = 8,
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
