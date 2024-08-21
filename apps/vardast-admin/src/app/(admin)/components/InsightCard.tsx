import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import Card from "@vardast/component/Card"
import DynamicHeroIcon from "@vardast/component/DynamicHeroIcon"
import Link from "@vardast/component/Link"
import { THeroIconName } from "@vardast/type/layout"
import clsx from "clsx"

type Props = {
  icon: THeroIconName
  title: string
  count: number
  iconBackground: string
  href: string
}

const InsightCard = ({ icon, title, count, iconBackground, href }: Props) => {
  return (
    <Card>
      <Link href={href}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-alpha-500 ">{title}</span>
            <span className="text-lg text-alpha-800">
              {digitsEnToFa(addCommas(count))}
            </span>
          </div>
          <DynamicHeroIcon
            icon={icon}
            className={clsx("h-12 w-12 rounded p-2 text-white", iconBackground)}
            solid
          />
        </div>
      </Link>
    </Card>
  )
}

export default InsightCard
