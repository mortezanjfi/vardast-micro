"use client"

import { useState } from "react"

export type UseModalsType<TEnum extends {} = undefined, TData = undefined> = {
  data?: TData
  type?: TEnum
}

export type OnChangeModalsType<TEnum> = <T>(
  modals?: UseModalsType<TEnum, T>
) => void

export type UseModalsReturn<TEnum extends {} = undefined, TData = undefined> = [
  modals: UseModalsType<TEnum, TData> | undefined,
  onChangeModals: OnChangeModalsType<TEnum>,
  onCloseModals: () => void
]

const useModals = <TEnum extends {} = undefined>(): UseModalsReturn<TEnum> => {
  const [modals, setModals] = useState<UseModalsType<TEnum, any>>()

  const onChangeModals: OnChangeModalsType<TEnum> = (modals) => {
    setModals(modals || undefined)
  }

  const onCloseModals = () => {
    setModals(undefined)
  }

  return [modals, onChangeModals, onCloseModals]
}

export { useModals }
