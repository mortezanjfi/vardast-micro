import { ReactNode } from "react"
import Card from "@vardast/component/Card"

type Props = { children: ReactNode; title?: string }

function CardContainer({ children, title }: Props) {
  return (
    <Card
      titleClass="text-base pb-2 border-b-2 border-primary-600"
      className="flex flex-col gap-9 !px-6"
      title={title}
    >
      {children}
    </Card>
  )
}

export default CardContainer
