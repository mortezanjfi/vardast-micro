import Link from "@vardast/component/Link"

type PageTitleProps = { title: string; backButtonUrl?: string }

const PageTitle = ({ title, backButtonUrl }: PageTitleProps) => {
  return (
    <div className="flex w-full items-center justify-between pt">
      <span className="pb-2 text-lg font-semibold">{title}</span>
      {backButtonUrl && (
        <Link className="btn btn-md btn-secondary" href={backButtonUrl}>
          بازگشت
        </Link>
      )}
    </div>
  )
}

export default PageTitle
