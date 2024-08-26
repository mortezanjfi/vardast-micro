import Card from "@vardast/component/Card"
import Link from "@vardast/component/Link"
import { ISellerDesktopAnalyzeProps } from "@vardast/type/Seller"
import clsx from "clsx"
import { LucidePlus } from "lucide-react"

export const DesktopMenuCard = ({
  id,
  Icon,
  title,
  option,
  listItems
}: ISellerDesktopAnalyzeProps) => {
  return (
    <Card className={`${id === "10" ? "col-span-3" : ""} overflow-hidden p-0 `}>
      <div className="flex justify-between border-b bg-alpha-50 px-7 py-5">
        <div className="flex items-center gap-2">
          <Icon className={clsx("h-6 w-6")} />
          <span>{title}</span>
        </div>
        {option && (
          <div className="flex items-center gap-3 text-primary">
            <span>{option}</span>
            <LucidePlus size={20} />{" "}
          </div>
        )}
      </div>
      <ul className="flex flex-col gap-7 px-7 py-7">
        {listItems.map((listItem) => (
          <li key={listItem.id} className="hover:text-secondary">
            <Link href={listItem.href}>{listItem.listText}</Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
