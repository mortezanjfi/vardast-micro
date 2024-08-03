import clsx from "clsx"

import Card, { CardProps } from "../Card"

export interface CardContainerProps extends CardProps {}

function CardContainer({
  titleClass,
  className,
  children,
  ...props
}: CardContainerProps) {
  return (
    <Card
      titleClass={clsx(
        "text-base pb-2 border-b-2 border-primary-600",
        titleClass
      )}
      className={clsx("flex flex-col gap-5 !px-6", className)}
      {...props}
    >
      {children}
    </Card>
  )
}

export default CardContainer
