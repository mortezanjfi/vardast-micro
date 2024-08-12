import { BadgeProps } from "@vardast/ui/badge"

import { CardProps } from "../Card"
import { DetailsWithTitleProps } from "../desktop/DetailsWithTitle"

export type DetailsCardPropsType = {
  badges?: BadgeProps[]
  items: DetailsWithTitleProps[]
  card?: Omit<CardProps, "children">
}
