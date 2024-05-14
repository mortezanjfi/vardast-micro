import { Product } from "@vardast/graphql/generated"

type ProductInfoProps = {
  product: Product
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div className="flex flex-col gap-6 bg-alpha-white py-6">
      <span className="flex-none text-2xl font-semibold text-alpha-800">
        {product.name}
      </span>
      <div className=" tag tag-gray h-8 w-fit border">
        <span>{`کد کالا: ${product.sku}`}</span>
      </div>
    </div>
  )
}

export default ProductInfo
