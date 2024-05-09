type ShadowRectangleProps = { className?: string }

const ShadowRectangle = ({ className }: ShadowRectangleProps) => {
  return (
    <div
      className={`absolute inset-y-0 left-0 z-20 h-full w-32 rounded-l-2xl bg-opacity-20 bg-gradient-to-r from-alpha-200 via-transparent to-transparent ${className}`}
    />
  )
}

export default ShadowRectangle
