import { digitsEnToFa } from "@persian-tools/persian-tools"

const TotalItemsReport = ({
  total,
  title
}: {
  total?: string | number
  title: string
}) => {
  return (
    <div className="flex items-center justify-start gap-x-2 px pt text-sm font-semibold text-primary">
      <span className="text-alpha-400">تعداد {title}:</span>
      {total ? digitsEnToFa(`${total}`) : "..."}
    </div>
  )
}
export default TotalItemsReport
