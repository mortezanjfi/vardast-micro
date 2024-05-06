"use client"

const VerticalSpace: React.FC<{ numberOfSpaces?: 1 | 2 | 3 | 4 }> = ({
  numberOfSpaces = 1
}) => {
  return [...Array(numberOfSpaces)].map((_, index) => (
    <div
      key={`vertical-space-${index}`}
      className={`h-[calc(theme(height.spaceY)+env(safe-area-inset-bottom))]`}
      aria-hidden="true"
    ></div>
  ))
}

export default VerticalSpace
