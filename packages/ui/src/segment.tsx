import React, {
  CSSProperties,
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
  useState
} from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import convertToPersianDate from "@vardast/util/convertToPersianDate"
import clsx from "clsx"

interface SegmentsProps<T extends string> {
  children: ReactNode
  defaultValue?: T
  value?: T
  className?: string
  onValueChange?: (_: T) => void
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

const Segments = <T extends string>({
  children,
  ...props
}: SegmentsProps<T>) => {
  const [selectedValue, setSelectedValue] = useState<string>(
    props.defaultValue || ""
  )

  const handleSegmentChange = (value: T) => {
    if (props.onValueChange) {
      return props.onValueChange(value)
    }
    setSelectedValue(value)
  }

  return (
    <div className={clsx(props.className)} style={props.style}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SegmentsList) {
            return React.cloneElement(child as ReactElement<any>, {
              selectedValue: props.value ?? selectedValue,
              onSegmentChange: handleSegmentChange
            })
          } else if (child.type === SegmentsContent) {
            return React.cloneElement(child as ReactElement<any>, {
              isVisible: child.props.value === props.value || selectedValue
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
    <div className="overflow-x-auto">
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
              onClick: () =>
                onSegmentChange && onSegmentChange(child.props.value)
            })
          }

          return children
        })}
      </div>
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
        className={clsx(
          "relative inline-block w-auto",
          !noStyle &&
            (isSelected
              ? "mx-1 cursor-pointer rounded-full border border-primary bg-primary text-alpha-white"
              : "mx-1 cursor-pointer rounded-full border border-alpha-300"),
          className
        )}
        ref={ref}
        style={style}
        onClick={onClick}
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
    <div className={className} id={id ?? undefined} style={style}>
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

type SegmentTabType = {
  value: string
  title: JSX.Element
  className?: string
  Content: () => JSX.Element
}

interface ISegmentTab<T extends string> {
  tabs: SegmentTabType[]
  isMobileView?: boolean
  activeTab: T
  onValueChange: (_: T) => void
}

const SegmentTab = <T extends string>({
  tabs,
  isMobileView,
  onValueChange,
  activeTab
}: ISegmentTab<T>) => {
  return (
    <Segments
      className="col-span-full flex w-full flex-col bg-alpha-white"
      value={activeTab}
      onValueChange={onValueChange}
    >
      <SegmentsList className="!justify-start border-b pb md:py-6" wrap={false}>
        {tabs.map(({ title, value }) => (
          <SegmentsListItem
            className={clsx("no-select")}
            key={value}
            noStyle
            style={{
              width:
                !isMobileView || tabs.length > 3
                  ? "auto"
                  : `${100 / tabs.length}%`
            }}
            value={value}
          >
            <>
              <div
                className={clsx(
                  "mx-1 cursor-pointer rounded-full border bg-alpha-white px-4 py-2.5 text-sm",
                  value === activeTab
                    ? "border-primary bg-primary text-alpha-white"
                    : "border-alpha-300"
                )}
              >
                {title}
              </div>
            </>
          </SegmentsListItem>
        ))}
      </SegmentsList>
      {tabs.map(({ Content, className, ...props }) => (
        <SegmentsContent
          className={clsx("grid flex-1 grid-cols-2 gap py-6", className)}
          key={props.value}
          value={props.value}
        >
          <Content />
        </SegmentsContent>
      ))}
    </Segments>
  )
}

const SegmentTabTitle = ({
  total,
  title = "",
  createdDate
}: {
  total?: number
  createdDate?: string
  title: string
}) => {
  return (
    <div className="flex items-center justify-center gap-x-2">
      <span className="font-semibold">{title}</span>
      {total ? (
        <span className="text-xs">({digitsEnToFa(total)})</span>
      ) : createdDate ? (
        <span className="text-xs">
          ({digitsEnToFa(convertToPersianDate({ dateString: createdDate }))})
        </span>
      ) : null}
    </div>
  )
}

export {
  SegmentItemLoader,
  Segments,
  SegmentsContent,
  SegmentsList,
  SegmentsListItem,
  SegmentTab,
  SegmentTabTitle
}
