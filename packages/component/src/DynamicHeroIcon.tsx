import * as OutlineIcons from "@heroicons/react/24/outline"
import * as SolidIcons from "@heroicons/react/24/solid"
import { THeroIconName } from "@vardast/type/layout"

interface Props {
  icon: THeroIconName
  className?: string
  solid?: boolean
}

const DynamicHeroIcon = ({
  solid = false,
  icon,
  ...props
}: Props): JSX.Element => {
  const Icon = solid ? SolidIcons[icon] : OutlineIcons[icon]

  return <Icon {...props} />
}

export default DynamicHeroIcon
