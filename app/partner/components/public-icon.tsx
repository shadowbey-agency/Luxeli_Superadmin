import Image from "next/image"
import { CSSProperties } from "react"

interface PublicIconProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

export default function PublicIcon({ 
  src, 
  alt, 
  width = 20, 
  height = 20, 
  className = "",
  style
}: PublicIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  )
}
