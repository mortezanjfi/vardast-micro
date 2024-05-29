import {
  digitsFaToEn,
  phoneNumberValidator
} from "@persian-tools/persian-tools"
import { z } from "zod"

import { persianCharactersValidator } from "./persianCharactersValidator"
import { slugValidator } from "./slugValidator"
import { stringHasOnlyNumberValidator } from "./stringHasOnlyNumberValidator"

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
  .refine((data) => phoneNumberValidator(`${digitsFaToEn(data)}`), {
    message: "شماره موبایل صحیح نیست"
  })

export const postalCodeSchema = z
  .string()
  .min(10, {
    message: "کد پستی باید ۱۰ رقم باشد"
  })
  .min(10, {
    message: "کد پستی باید ۱۰ رقم باشد"
  })
  .refine((data) => stringHasOnlyNumberValidator(digitsFaToEn(`${data}`)), {
    message: "کد پستی صحیح نیست"
  })

export const otpSchema = z
  .string()
  .refine((data) => stringHasOnlyNumberValidator(digitsFaToEn(`${data}`)), {
    message: "رمز یکبار مصرف صحیح نیست"
  })

export const amountSchema = z
  .string()
  .refine((data) => stringHasOnlyNumberValidator(digitsFaToEn(`${data}`)), {
    message: "تعداد صحیح نیست"
  })
  .optional()

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
