import { OnChangeModalsType, UseModalsType } from "@vardast/ui/modal"

export enum OrderModalEnum {
  DELETE_ADDRESS,
  ADDRESS,
  DELETE_USER,
  USER,
  INFO,
  LINE,
  SELLER,
  OFFER,
  ADD_OFFER,
  ADD_ORDER,
  ADD_PRICE,
  ADD_PROJECT
}

export interface IOrderPageProps {
  uuid?: string
}

export interface IOrderPageSectionProps<T> extends IOrderPageProps {
  open?: boolean
  onCloseModals?: (_?: T) => void
  onChangeModals?: OnChangeModalsType<OrderModalEnum>
  modals?: UseModalsType<OrderModalEnum, T>
}

export interface IOrdersTabProps {
  onChangeModals?: OnChangeModalsType<OrderModalEnum>
}
