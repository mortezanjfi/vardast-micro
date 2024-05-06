"use client"

import { useState } from "react"
import { Brand } from "@vardast/graphql/generated"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vardast/ui/tabs"
import zodI18nMap from "@vardast/util/zodErrorMap"
import useTranslation from "next-translate/useTranslation"
import { z } from "zod"

import { CatalogModalType } from "@/app/(admin)/brands/components/BrandFilesModal"
import BrandInformationForm, {
  type NewBrandInformationType
} from "@/app/(admin)/brands/components/BrandInformationForm"
import { CatalogOrPriceNewFiles } from "@/app/(admin)/brands/components/CatalogOrPriceNewFiles"

export type NewBrandType = {
  generalInformation: NewBrandInformationType
  brandCatalogUploadedInfo: CatalogModalType[]
  brandPriceUploadedInfo: CatalogModalType[]
}

type BrandFormProps = {
  brand?: Brand
}
export const BrandForm = ({ brand }: BrandFormProps) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("information")
  const [newBrandData, setNewBrandData] = useState<NewBrandType>()
  console.log(newBrandData)

  z.setErrorMap(zodI18nMap)

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger disabled value="information">
            {t("common:information")}
          </TabsTrigger>
          <TabsTrigger disabled value="catalog">
            {t("common:catalog")}
          </TabsTrigger>
          <TabsTrigger disabled value="price">
            {t("common:price_list")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="information">
          <BrandInformationForm
            brand={brand as Brand}
            setNewBrandData={setNewBrandData}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </TabsContent>
        <TabsContent value="catalog">
          <CatalogOrPriceNewFiles
            brand={brand as Brand}
            setNewBrandData={setNewBrandData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
        <TabsContent value="price">
          <CatalogOrPriceNewFiles
            brand={brand as Brand}
            setNewBrandData={setNewBrandData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
      </Tabs>{" "}
    </div>
  )
}
