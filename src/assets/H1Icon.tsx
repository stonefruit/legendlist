import { SvgIconProps } from '../types'

export default function Icon({ height, width, fill = 'black' }: SvgIconProps) {
  return (
    <svg
      height={height}
      width={width}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" fill="none" width="24" height="24" />
      <g>
        <path
          fill={fill}
          d="M11 7h2v10h-2v-4H7v4H5V7h2v4h4V7zm6.57 0c-.594.95-1.504 1.658-2.57 2v1h2v7h2V7h-1.43z"
        />
      </g>
    </svg>
  )
}
