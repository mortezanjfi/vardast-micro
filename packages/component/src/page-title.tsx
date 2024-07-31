import clsx from "clsx"
import Link from "./Link"

type PageTitleProps = {
  className?: string
  titleClass?: string
  title: string
  backButtonUrl?: string
}

const PageTitle = ({
  className,
  titleClass,
  title,
  backButtonUrl
}: PageTitleProps) => {
  return (
    <div
      className={clsx("flex w-full items-center justify-between pt", className)}
    >
      <span className={clsx("pb-2 text-lg font-semibold", titleClass)}>
        {title}
      </span>
      {backButtonUrl && (
        <Link className="btn btn-md btn-secondary" href={backButtonUrl}>
          بازگشت
        </Link>
      )}
    </div>
  )
}

export default PageTitle
