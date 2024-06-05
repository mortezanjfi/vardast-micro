import { ILayoutProps } from "@vardast/type/layout"

import withLayout from "./withLayout"

export default ({ options }: { options: ILayoutProps }) =>
  withLayout(({ children }) => children, options)
