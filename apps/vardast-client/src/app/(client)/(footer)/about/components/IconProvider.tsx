import Link from "@vardast/component/Link"
import { LucideIcon } from "lucide-react"

const IconProvider = ({
  Icon,
  href = ""
}: {
  Icon: LucideIcon
  href: string
}) => {
  return (
    <Link
      className="mx-auto flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-alpha-50 p-1.5 text-primary"
      href={href}
    >
      <Icon className="h-2/3 w-2/3" />
    </Link>
  )
}

export default IconProvider
