import { Dispatch, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import Card from "@vardast/component/Card"
import PageHeader from "@vardast/component/PageHeader"
import { Brand } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import { LucidePlus } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { z } from "zod"

import { BrandFilesModal } from "@/app/(admin)/brands/components/BrandFilesModal"
import { NewBrandType } from "@/app/(admin)/brands/components/BrandForm"

export interface FileObject {
  file: File
  name: string
  size: number
  isVisible: string
  fileUuid: string
}
// form for modal properties
export const ModalSchema = z.object({
  priceFileUuid: z.string().optional(),
  catalogFileUuid: z.string().optional(),
  priceName: z.string(),
  priceIsVisible: z.string(),
  catalogName: z.string(),
  catalogIsVisible: z.string()
})

type CatalogOrPriceNewFilesProps = {
  brand?: Brand
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<string>>
  setNewBrandData: Dispatch<SetStateAction<NewBrandType | undefined>>
}

export const formatFileSize = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}
export const CatalogOrPriceNewFiles = ({
  activeTab,
  setActiveTab,
  setNewBrandData,
  brand
}: CatalogOrPriceNewFilesProps) => {
  const { t } = useTranslation()
  const [filesList, setFilesList] = useState<FileObject[]>([])
  const [addCatalogModalOpen, setAddCatalogModalOpen] = useState<boolean>(false)
  const router = useRouter()
  const submit = () => {
    const currentIndex = ["information", "catalog", "price"].indexOf(activeTab)
    if (currentIndex !== -1 && currentIndex < 2) {
      if (currentIndex == 0) {
        console.log(currentIndex)
      }
      const nextTab = ["information", "catalog", "price"][currentIndex + 1]
      setActiveTab(nextTab)
    } else {
      console.log("done")
    }
  }

  const handleDelete = (index: number) => {
    const updatedFilesList = [...filesList]
    updatedFilesList.splice(index, 1)
    setFilesList(updatedFilesList)
  }

  return (
    <>
      <BrandFilesModal
        activeTab={activeTab}
        setFilesList={setFilesList}
        open={addCatalogModalOpen}
        onOpenChange={setAddCatalogModalOpen}
        setNewBrandData={setNewBrandData}
      />
      <div className="flex flex-col gap-7">
        <Card className="h-[722px]">
          <PageHeader
            title={t("common:entity_list", {
              entity: t(`common:${activeTab}`)
            })}
            titleClasses="text-[14px] font-normal "
            containerClass="items-center"
          >
            <Button
              size="medium"
              onClick={() => {
                setAddCatalogModalOpen(true)
              }}
            >
              <LucidePlus size="14.4" />

              {t("common:add_new_entity", { entity: t(`common:${activeTab}`) })}
            </Button>
          </PageHeader>
          <table className="table-hover table">
            <thead>
              <tr>
                <th>
                  {" "}
                  {t("common:entity_name", { entity: t("common:file") })}
                </th>
                <th>{t("common:status")}</th>
                <th>{t("common:operation")}</th>
              </tr>
            </thead>
            {activeTab === "catalog" && brand?.catalog && (
              <tbody>
                <tr>
                  {" "}
                  <td>
                    <div className="flex flex-col">
                      <span>{brand.catalog?.name}</span>
                      <span className="text-xs text-alpha-500">
                        {formatFileSize(brand?.catalog?.size as number)}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
            {activeTab === "price" && brand?.priceList && (
              <tbody>
                <tr>
                  {" "}
                  <td>
                    <div className="flex flex-col">
                      <span>{brand.priceList?.name}</span>
                      <span className="text-xs text-alpha-500">
                        {formatFileSize(brand?.priceList?.size as number)}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
            {filesList.length > 0 && (
              <tbody>
                {filesList.map((catalog, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex flex-col">
                        <span>{catalog.name}</span>
                        <span className="text-xs text-alpha-500">
                          {formatFileSize(catalog.size)}
                        </span>
                      </div>
                    </td>
                    <td>
                      {catalog.isVisible === "true" ? (
                        <span className="tag  tag-sm tag-success">
                          {t("common:active")}
                        </span>
                      ) : (
                        <span className="tag tag-sm tag-danger">
                          {t("common:not_active")}
                        </span>
                      )}
                    </td>
                    <td className=" border-r-0.5">
                      <span className="tag cursor-pointer text-blue-500">
                        {t("common:edit")}
                      </span>
                      <span
                        className="tag cursor-pointer text-error"
                        onClick={() => handleDelete(index)}
                      >
                        {t("common:delete")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
            {filesList.length === 0 &&
              ((activeTab === "price" && !brand?.priceList) ||
                (activeTab === "catalog" && !brand?.catalog)) && (
                <tbody>
                  <tr>
                    <td></td>
                    <td className="flex w-full justify-center">
                      <span>{t("common:no_data_to_show")}</span>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              )}
          </table>
        </Card>
        <hr />
        <Card className="flex w-full justify-end gap-3">
          <Button
            className=" top-0 ml-3 px-16   py-2"
            variant="secondary"
            type="reset"
            onClick={() => {
              router.push("/admin/brands")
            }}
          >
            {t("common:cancel")}
          </Button>
          <Button
            className=" top-0 px-12 py-2"
            type="button"
            onClick={() => {
              submit()
            }}
          >
            {activeTab === "price" ? "افزودن برند" : t("common:next")}
          </Button>
        </Card>
      </div>
    </>
  )
}
