import { UseFormReturn } from "react-hook-form"
import { TypeOf, z } from "zod"

import { CreateLineInput } from "../../graphql/src/generated"

export const CreateOrderLineSchema = z.object({
  attribuite: z.string().optional(),
  brand: z.string(),
  descriptions: z.string().optional(),
  item_name: z.string(),
  qty: z.string().optional(),
  uom: z.string(),
  type: z.string().optional()
})

export type CreateOrderLineType = TypeOf<typeof CreateOrderLineSchema> & {
  type?: CreateLineInput["type"]
}

export interface OrderProductTabContentProps {
  addProductLine: (productLine: CreateOrderLineType) => void
  form: UseFormReturn<CreateOrderLineType>
  uuid?: string
}

export enum ACTION_BUTTON_TYPE {
  ADD_PRODUCT_ORDER = "ADD_PRODUCT_ORDER",
  ADD_PRODUCT_OFFER = "ADD_PRODUCT_OFFER"
}
