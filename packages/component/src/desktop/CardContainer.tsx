import clsx from "clsx"

import Card, { CardProps } from "../Card"

export type CardContainerProps = CardProps

function CardContainer({
  titleClass,
  className,
  children,
  ...props
}: CardContainerProps) {
  return (
    <Card
      className={clsx("flex flex-col gap-5 !px-6", className)}
      titleClass={clsx(
        "text-base pb-2 border-b-2 border-primary-600",
        titleClass
      )}
      {...props}
    >
      {children}
    </Card>
  )
}

export default CardContainer
