"use client"

import { useState } from "react"

export type UseModalsType<TEnum extends {} = undefined, TData = undefined> = {
  data?: TData
  type?: TEnum
}

export type OnChangeModalsType<TEnum, TData = undefined> = <T>(
  modals?: UseModalsType<TEnum, TData extends undefined ? T : TData>
) => void

export type UseModalsReturn<TEnum extends {} = undefined, TData = undefined> = [
  modals: UseModalsType<TEnum, TData> | undefined,
  onChangeModals: OnChangeModalsType<TEnum, TData>,
  onCloseModals: () => void
]

export interface IUseModal<TEnum extends {} = undefined, TData = undefined> {
  onCloseModals?: <T>(_?: T) => void
  onChangeModals?: OnChangeModalsType<TEnum>
  modals?: UseModalsType<TEnum, TData>
  open?: boolean
}

const useModals = <
  TEnum extends {} = undefined,
  TData = undefined
>(): UseModalsReturn<TEnum, TData> => {
  const [modals, setModals] = useState<UseModalsType<TEnum, any>>()

  const onChangeModals: OnChangeModalsType<TEnum, TData> = (modals) => {
    setModals(modals || undefined)
  }

  const onCloseModals = () => {
    setModals(undefined)
  }

  return [modals, onChangeModals, onCloseModals]
}

export { useModals }
