interface PageHeaderProps {
  children?: React.ReactNode
  title: string
  slot?: React.ReactNode
  titleClasses?: string
  containerClass?: string
  titleContainerClasses?: string
}

function PageHeader({
  children,
  title,
  titleClasses = "text-3xl",
  containerClass = "",
  titleContainerClasses = ""
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col  gap-6 ">
      {/* <button className="btn-sm btn">
        <ChevronRight className="icon" />
        <span>مناطق جغرافیایی</span>
      </button> */}
      <div className={`flex items-end ${containerClass}`}>
        <div className={`${titleContainerClasses}`}>
          {" "}
          <h2 className={` font-black text-alpha-800 ${titleClasses} leading`}>
            {title}
          </h2>
        </div>

        <div className="mr-auto">{children}</div>
      </div>
    </div>
  )
}

export default PageHeader
