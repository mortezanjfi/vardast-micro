"use client"

import Card, { CardProps } from "@vardast/component/Card"
import {
  DetailsWithTitle,
  DetailsWithTitleProps
} from "@vardast/component/desktop/DetailsWithTitle"
import { Badge, BadgeProps } from "@vardast/ui/badge"

type DetailsCardProps = {
  badges?: BadgeProps[]
  items: DetailsWithTitleProps[]
  card?: Omit<CardProps, "children">
}

const DetailsCard = ({ badges, items, card }: DetailsCardProps) => {
  return (
    <Card {...card} template="1/2-sm">
      {badges && badges?.length && (
        <div className="col-span-2 flex gap-6 pb">
          {badges?.map((props) => <Badge {...props} />)}
        </div>
      )}
      {items?.map((props) => (
        <DetailsWithTitle
          textCustomStyle="whitespace-nowrap line-clamp-1"
          {...props}
        />
      ))}
    </Card>
  )
}

export default DetailsCard
