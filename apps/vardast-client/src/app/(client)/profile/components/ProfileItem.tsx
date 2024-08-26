import Link from "@vardast/component/Link"
import { LucideIcon } from "lucide-react"

interface IProfileItem {
  href: string
  Icon: LucideIcon
  title: string
  id: number
}

const ProfileItem: React.FC<IProfileItem> = ({ href, Icon, title }) => {
  return (
    <Link className="flex items-center gap-x px-6 py-5" href={href}>
      <Icon className="h-6 w-6" />
      {title}
    </Link>
  )
}

export default ProfileItem
