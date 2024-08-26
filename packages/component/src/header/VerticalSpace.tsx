"use client"

const VerticalSpace: React.FC<{ numberOfSpaces?: 1 | 2 | 3 | 4 }> = ({
  numberOfSpaces = 1
}) => {
  return [...Array(numberOfSpaces)].map((_, index) => (
    <div
      aria-hidden="true"
      className={`h-20`}
      key={`vertical-space-${index}`}
    ></div>
  ))
}

export default VerticalSpace
