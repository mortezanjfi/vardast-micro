import { memo, useMemo } from "react"
import dynamic from "next/dynamic"
import { LucideProps } from "lucide-react"
import dynamicIconImports from "lucide-react/dynamicIconImports"

interface IconProps extends LucideProps {
  name: keyof typeof dynamicIconImports
}

const DynamicIcon = memo(({ name, ...props }: IconProps) => {
  const LucideIcon = useMemo(() => dynamic(dynamicIconImports[name]), [name])

  return <LucideIcon {...props} />
})

export default DynamicIcon
