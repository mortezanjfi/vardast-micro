import { phoneNumberValidator } from "@persian-tools/persian-tools"
import { z } from "zod"

import { persianCharactersValidator } from "./persianCharactersValidator"
import { slugValidator } from "./slugValidator"

export const optionalTextInputSchema = (schema: z.ZodString) =>
  z
    .union([z.string(), z.undefined()])
    .refine((val) => !val || schema.safeParse(val).success)

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type Literal = z.infer<typeof literalSchema>
type Json = Literal | { [key: string]: Json } | Json[]
export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
)

export const cellphoneNumberSchema = z
  .string()
  .refine((data) => phoneNumberValidator(data), {
    message: "شماره موبایل صحیح نیست"
  })

export const slugInputSchema = z
  .string()
  .refine((data) => slugValidator(data), {
    message: "مقدار نامک صحیح نیست"
  })

export const persianInputSchema = z
  .string()
  .refine((data) => persianCharactersValidator(data), {
    message: "مقدار فیلد باید فارسی باشد"
  })

export const englishInputSchema = z
  .string()
  .refine((data) => !persianCharactersValidator(data), {
    message: "مقدار فیلد باید انگلیسی باشد"
  })

export const passwordInputSchema = z.string()
