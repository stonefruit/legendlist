import { SvgIconProps } from '../types'

export default function Icon({ height, width, fill = 'black' }: SvgIconProps) {
  return (
    <svg
      height={height}
      width={width}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={fill}
        d="M19 7V4H9v3h2.868L9.012 17H5v3h10v-3h-2.868l2.856-10z"
      />
    </svg>
  )
}
