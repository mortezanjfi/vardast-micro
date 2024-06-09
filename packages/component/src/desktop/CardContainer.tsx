import { ReactNode } from "react"
import clsx from "clsx"

import Card from "../Card"

type Props = { className?: string; children: ReactNode; title?: string }

function CardContainer({ className, children, title }: Props) {
  return (
    <Card
      titleClass="text-base pb-2 border-b-2 border-primary-600"
      className={clsx("flex flex-col gap-5 !px-6", className)}
      title={title}
    >
      {children}
    </Card>
  )
}

export default CardContainer
