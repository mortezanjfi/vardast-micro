"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import zodI18nMap from "@vardast/util/zodErrorMap"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type Props = { isMobileView: boolean; uuid: string }

export type CreateLegalUserInfoType = TypeOf<typeof CreateLegalUserSchema>

const CreateLegalUserSchema = z.object({
  projectId: z.string(),
  expire_date: z.string(),
  addressId: z.number(),
  payment_methods: z.string(),
  descriptions: z.string().optional()
})

export default ({ isMobileView, uuid }: Props) => {
  const { t } = useTranslation()

  const form = useForm<CreateLegalUserInfoType>({
    resolver: zodResolver(CreateLegalUserSchema)
  })

  z.setErrorMap(zodI18nMap)
  return <div>UserBaseInfoForm</div>
}
