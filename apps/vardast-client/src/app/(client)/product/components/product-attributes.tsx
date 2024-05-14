import { digitsEnToFa } from "@persian-tools/persian-tools"

import { GroupedAttributes } from "@/app/(client)/product/components/ProductPage"
import ProductSectionContainer from "@/app/(client)/product/components/ProductSectionContainer"

type ProductAttributesProps = {
  attributes: GroupedAttributes[]
  title?: string
}

const ProductAttributes = ({
  attributes,
  title = "ویژگی‌ها"
}: ProductAttributesProps) => {
  return (
    <ProductSectionContainer titleCostumClass="!px-0" title={title}>
      <ul className="flex list-disc flex-col gap-y pr-6 decoration-primary">
        {attributes.map((attribute, idx) => (
          <li className="" key={idx}>
            <div className="grid grid-cols-5 sm:grid-cols-4">
              <p className="col-span-2 pl-1 text-secondary md:col-span-1">
                {attribute.name}:
              </p>
              <p className="col-span-3 text-justify md:col-span-3">
                {attribute?.values && digitsEnToFa(attribute.values.join(", "))}{" "}
                {attribute?.uom && digitsEnToFa(attribute.uom.name)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </ProductSectionContainer>
  )
}

export default ProductAttributes
