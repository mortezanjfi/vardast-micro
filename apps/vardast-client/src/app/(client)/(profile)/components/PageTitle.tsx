import Link from "@vardast/component/Link"
import clsx from "clsx"

type PageTitleProps = {
  titleClass?: string
  title: string
  backButtonUrl?: string
}

const PageTitle = ({ titleClass, title, backButtonUrl }: PageTitleProps) => {
  return (
    <div className="flex w-full items-center justify-between pt">
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
