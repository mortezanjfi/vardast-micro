import { digitsEnToFa } from "@persian-tools/persian-tools"
import ProductSectionContainer from "@vardast/component/ProductSectionContainer"

import { GroupedAttributes } from "@/app/(client)/product/components/ProductPage"

type ProductAttributesProps = {
  attributes: GroupedAttributes[]
  title?: string
}

const ProductAttributes = ({
  attributes,
  title = "ویژگی‌ها"
}: ProductAttributesProps) => {
  return (
    <ProductSectionContainer title={title} titleCostumClass="!px-0">
      <ul className="flex list-disc flex-col gap-y-2  py-3 pr-6 marker:text-alpha-500">
        {attributes.map((attribute, idx) => (
          <li key={idx}>
            <div className="grid grid-cols-3 sm:grid-cols-4">
              <span className="col-span-1 pl-1 text-alpha-500 sm:col-span-2 md:col-span-1">
                {attribute.name}:
              </span>
              <span className="col-span-2 text-justify sm:col-span-3 md:col-span-3">
                {attribute?.values && digitsEnToFa(attribute.values.join(", "))}
                {attribute?.uom && digitsEnToFa(attribute.uom.name)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </ProductSectionContainer>
  )
}

export default ProductAttributes
