"use client"

import { Badge } from "@vardast/ui/badge"

import Card from "../Card"
import { DetailsCardPropsType } from "../types/type"
import { DetailsWithTitle } from "./DetailsWithTitle"

const DetailsCard = ({ badges, items, card }: DetailsCardPropsType) => {
  return (
    <Card {...card} template="1/2-sm">
      {badges && badges?.length && (
        <div className="col-span-full flex gap-6 pb">
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
