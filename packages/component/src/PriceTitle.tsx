import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"

export const AttributeSize: any = {
  "2xs": "h4",
  xs: "h3",
  sm: "h2",
  large: "text-2xl"
}

export type ITextSize = "xs" | "sm" | "2xs" | "large"

const PriceTitle = ({
  price,
  size = "sm",
  color
}: {
  price: number
  size?: ITextSize
  color?: "error" | "success"
}) => {
  const Attr = size ? AttributeSize[size] : "h2"
  return (
    <Attr
      className={`text-md flex items-center justify-between gap-x-1 text-left`}
    >
      <span
        className={`text-${size === "xs" ? "md" : size} text-${
          color ? color : "gray-700"
        } font-bold`}
      >
        {digitsEnToFa(addCommas(price))}
      </span>
      <span
        className={`text-${
          size === "sm" ? size : size === "large" ? "sm" : "xs"
        } text-${color ? color : "gray-700"} font-medium sm:mr-1`}
      >
        تومان
      </span>
    </Attr>
  )
}

export default PriceTitle
