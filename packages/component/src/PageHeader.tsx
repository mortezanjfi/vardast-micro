import clsx from "clsx"

interface PageHeaderProps {
  pageHeaderClasses?: string
  children?: React.ReactNode
  title: string
  slot?: React.ReactNode
  titleClasses?: string
  containerClass?: string
  titleContainerClasses?: string
}

function PageHeader({
  pageHeaderClasses,
  children,
  title,
  titleClasses = "text-3xl",
  containerClass = "",
  titleContainerClasses = ""
}: PageHeaderProps) {
  return (
    <div className={clsx("mb-6 flex flex-col  gap-6 ", pageHeaderClasses)}>
      {/* <button className="btn-sm btn">
        <ChevronRight className="icon" />
        <span>مناطق جغرافیایی</span>
      </button> */}
      <div className={`flex items-center ${containerClass}`}>
        <div className={`${titleContainerClasses}`}>
          <p className={`font-semibold ${titleClasses} leading`}>{title}</p>
        </div>

        <div className="mr-auto">{children}</div>
      </div>
    </div>
  )
}

export default PageHeader
