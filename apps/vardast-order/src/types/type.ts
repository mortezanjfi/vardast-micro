import { OnChangeModalsType, UseModalsType } from "@vardast/component/modal"

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
  ADD_ORDER
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
