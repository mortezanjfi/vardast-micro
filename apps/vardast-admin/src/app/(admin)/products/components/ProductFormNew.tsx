"use client"

import { useState } from "react"
import { Product } from "@vardast/graphql/generated"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vardast/ui/tabs"
import useTranslation from "next-translate/useTranslation"

import { ProductFeaturesTab } from "@/app/(admin)/products/components/ProductFeaturesTab"
import { ProductInformationTab } from "@/app/(admin)/products/components/ProductInformationTab"
import { ProductsVariantsTab } from "@/app/(admin)/products/components/ProductsVariantsTab"

export type ProductFormNewType = {}

type ProductFormNewProps = {
  product?: Product
}
export const ProductFormNew = ({ product }: ProductFormNewProps) => {
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState("information")
  const [newProductData, setNewProductData] = useState<ProductFormNewType>()

  console.log({ newProductData })

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="information">
            {t("common:information")}
          </TabsTrigger>
          <TabsTrigger value="catalog"> ویژگی و مشخصات</TabsTrigger>
          <TabsTrigger value="price"> تنوع کالا</TabsTrigger>
        </TabsList>

        <TabsContent value="information">
          <ProductInformationTab
            activeTab={activeTab}
            product={product}
            setActiveTab={setActiveTab}
            setNewProductData={setNewProductData}
          />
        </TabsContent>
        <TabsContent value="catalog">
          <ProductFeaturesTab
            activeTab={activeTab}
            product={product}
            setActiveTab={setActiveTab}
            setNewProductData={setNewProductData}
          />
        </TabsContent>
        <TabsContent value="price">
          <ProductsVariantsTab
            activeTab={activeTab}
            product={product}
            setActiveTab={setActiveTab}
            setNewProductData={setNewProductData}
          />
        </TabsContent>
      </Tabs>{" "}
    </div>
  )
}
