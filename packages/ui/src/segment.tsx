import React, {
  CSSProperties,
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
  useState
} from "react"
import clsx from "clsx"

interface SegmentsProps {
  children: ReactNode
  defaultValue?: string
  value?: string
  className?: string
  onValueChange?: (_: string) => void
  style?: CSSProperties | undefined
}

interface SegmentsListProps {
  children: ReactNode
  wrap?: boolean
  className?: string
  style?: CSSProperties | undefined
}

interface SegmentsListItemProps {
  value: string
  children?: ((_: { isSelected: boolean }) => React.ReactNode) | React.ReactNode
}

interface SegmentsContentProps {
  value: string
  children: ReactNode
}

const Segments: React.FC<SegmentsProps> = ({ children, ...props }) => {
  const [selectedValue, setSelectedValue] = useState<string>(
    props.defaultValue || ""
  )

  const handleSegmentChange = (value: string) => {
    if (props.onValueChange) {
      return props.onValueChange(value)
    }
    setSelectedValue(value)
  }

  return (
    <div
      className={clsx("overflow-hidden", props.className)}
      style={props.style}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SegmentsList) {
            return React.cloneElement(child as ReactElement<any>, {
              selectedValue: props.value ?? selectedValue,
              onSegmentChange: handleSegmentChange
            })
          } else if (child.type === SegmentsContent) {
            return React.cloneElement(child as ReactElement<any>, {
              isVisible: child.props.value === props.value ?? selectedValue
            })
          } else {
            return child
          }
        }
        return null
      })}
    </div>
  )
}

const SegmentsList: React.FC<
  SegmentsListProps & {
    selectedValue?: string
    onSegmentChange?: (_: string) => void
  }
> = ({ children, selectedValue, onSegmentChange, style, className, wrap }) => {
  return (
    <div
      className={clsx(
        "hide-scrollbar relative flex w-full items-start whitespace-nowrap",
        wrap ? "flex flex-wrap justify-center gap-y" : "overflow-x-scroll",
        className
      )}
      style={style}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as ReactElement<any>, {
            isSelected: child.props.value === selectedValue,
            onClick: () => onSegmentChange && onSegmentChange(child.props.value)
          })
        }

        return children
      })}
    </div>
  )
}

const SegmentsListItem = forwardRef(
  (
    {
      noStyle,
      isSelected,
      className,
      onClick,
      style,
      children
    }: SegmentsListItemProps & {
      isSelected?: boolean
      onClick?: () => void
      className?: string
      style?: CSSProperties | undefined
      noStyle?: boolean
    },
    ref: Ref<HTMLDivElement> | undefined
  ) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={clsx(
          "relative inline-block w-auto",
          !noStyle &&
            (isSelected
              ? "mx-1 cursor-pointer rounded-full border border-primary bg-primary text-alpha-white"
              : "mx-1 cursor-pointer rounded-full border border-alpha-300"),
          className
        )}
        style={style}
      >
        {React.Children.map(children as ReactNode, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === SegmentsListItem) {
              return React.cloneElement(child as ReactElement, {
                isSelected
              })
            } else {
              return React.cloneElement(child as ReactElement, {
                isSelected
              })
            }
          }

          return null
        })}
      </div>
    )
  }
)

const SegmentsContent: React.FC<
  SegmentsContentProps & {
    isVisible?: boolean
    id?: string
    className?: string
    style?: CSSProperties | undefined
  }
> = ({ isVisible, style, className, id, children }) => {
  return isVisible ? (
    <div id={id ?? undefined} style={style} className={className}>
      {children}
    </div>
  ) : null
}

const SegmentItemLoader = () => {
  return (
    <div className={clsx("h-full flex-shrink-0 cursor-pointer pl")}>
      <div className={clsx("flex h-full flex-col justify-start gap-y-3")}>
        <div
          className={clsx(
            "animated-card relative h-[20vw] w-[20vw] overflow-hidden rounded-full border border-alpha-400 md:h-[100px] md:w-[100px]"
          )}
        ></div>
        <h5
          className={clsx(
            "animated-card relative z-20 line-clamp-2 h-12 w-full whitespace-pre-wrap rounded-md bg-opacity-60 text-center text-sm font-semibold"
          )}
        ></h5>
      </div>
    </div>
  )
}

export {
  SegmentItemLoader,
  Segments,
  SegmentsContent,
  SegmentsList,
  SegmentsListItem
}
