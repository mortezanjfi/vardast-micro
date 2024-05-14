type PageTitleProps = { title: string }

const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <div className="flex  w-full">
      <span className=" pb-2 text-lg font-semibold">{title}</span>
    </div>
  )
}

export default PageTitle
