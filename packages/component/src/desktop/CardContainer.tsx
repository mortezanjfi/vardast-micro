import { ReactNode } from "react"
import clsx from "clsx"

import Card, { cardButton } from "../Card"

type Props = {
  titleClass?: string
  button?: cardButton
  className?: string
  children: ReactNode
  title?: string
}

function CardContainer({
  titleClass,
  button,
  className,
  children,
  title
}: Props) {
  return (
    <Card
      titleClass={clsx(
        "text-base pb-2 border-b-2 border-primary-600",
        titleClass
      )}
      className={clsx("flex flex-col gap-5 !px-6", className)}
      button={button}
      title={title}
    >
      {children}
    </Card>
  )
}

export default CardContainer
