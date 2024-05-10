/* eslint-disable no-unused-vars */
declare module "@react-stately/toast" {
  // interface User extends LoginUserMutation { }
  interface ToastOptions {
    intent?: "success" | "danger" | "warning" | "info"
    position?:
      | "bottom-left"
      | "bottom-center"
      | "bottom-right"
      | "top-left"
      | "top-center"
      | "top-right"
  }
}
