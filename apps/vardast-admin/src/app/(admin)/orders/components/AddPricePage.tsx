"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { PlusIcon } from "@heroicons/react/24/solid"
import AddPriceModal from "@vardast/component/desktop/AddPriceModal"
import AllOrderDeleteModal from "@vardast/component/desktop/AllOrderDeleteModal"
import { Button } from "@vardast/ui/button"
import useTranslation from "next-translate/useTranslation"

import CardContainer from "@/app/(admin)/orders/components/CardContainer"

type AddPricePageProps = { uuid: string }

const AddPricePage = ({ uuid }: AddPricePageProps) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [open, onOpenChange] = useState<boolean>(false)
  const [priceModalOpen, setPriceModalOpen] = useState<boolean>(false)

  const onDelete = () => {
    console.log("delete")
  }
  const fakeProducts = [
    {
      id: 1,
      images: [],
      name: "test1",
      techNum: 4321,
      brand: "test",
      unit: "test",
      value: 6
    },
    {
      id: 2,
      images: [],
      name: "test1",
      techNum: 4321,
      brand: "test",
      unit: "test",
      value: 6
    }
  ]

  const submit = (data: any) => {
    console.log(data)
    setPriceModalOpen(false)
  }

  return (
    <>
      <AllOrderDeleteModal
        onDelete={onDelete}
        open={open}
        onOpenChange={onOpenChange}
      />
      <AddPriceModal
        submitFunction={submit}
        setOpen={setPriceModalOpen}
        open={priceModalOpen}
      />
      <CardContainer title="افزودن قیمت">
        <div className="flex items-center justify-between border-b py-5">
          <div className="flex flex-col gap-2">
            <span className="text-base font-semibold">لیست کالاهای سفارش</span>
            <p>
              لطفا قیمت کالاهای سفارش را وارد کرده و در صورت تایید نهایی، سفارش
              را ثبت نمایید
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline-primary"
              className="px-4 py-2"
              onClick={() => {
                router.push(`/profile/orders/${uuid}/add-order-products`)
              }}
            >
              <PlusIcon width={20} height={20} />
              اضافه کردن کالا
            </Button>
            <Button
              variant="primary"
              className="px-4 py-2"
              onClick={() => {
                onOpenChange(true)
              }}
            >
              حذف همه{" "}
            </Button>
          </div>
        </div>
        <div className="py-5">
          <table className="table-hover table border-t-0">
            <thead>
              <tr>
                <th>{t("common:title")}</th>
                <th></th>
                <th>{t("common:brand")}</th>
                <th>{t("common:unit")}</th>
                <th>{t("common:value")}</th>
                <th>{t("common:operation")}</th>
              </tr>
            </thead>
            <tbody className="overflow-x-auto border-0.5 ">
              {fakeProducts.map(
                (product) =>
                  product && (
                    <tr key={product.id}>
                      <td className="w-12">
                        <div className="relative aspect-square h-12 w-12 overflow-hidden rounded">
                          <Image
                            src={
                              (product.images.at(0)?.file.presignedUrl
                                .url as string) ?? "/images/seller-blank.png"
                            }
                            alt={product.name}
                            sizes="5vw"
                            fill
                          />
                        </div>
                      </td>
                      <td className="w-12">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-medium text-alpha-800">
                            {product.name}
                          </span>
                          {product.techNum && (
                            <span className="text-xs text-alpha-600">
                              کد کالا: {product.techNum}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="w-[129px] border-r-0.5">
                        {product.brand}
                      </td>
                      <td className="w-[129px] border-r-0.5">{product.unit}</td>
                      <td className="w-[129px] border-r-0.5">
                        {product.value}
                      </td>
                      <td className="w-[159px] border-r-0.5">
                        <div className="flex gap-2">
                          <span
                            onClick={() => {
                              setPriceModalOpen(true)
                            }}
                            className="tag cursor-pointer text-blue-500"
                          >
                            {t("common:add_new_entity", {
                              entity: t("common:price")
                            })}
                          </span>

                          <span
                            className="tag cursor-pointer text-error"
                            // onClick={(e) => {
                            //   e.stopPropagation()
                            //   setDeleteModalOpen(true)
                            //   setBrandToDelete(brand as Brand)
                            // }}
                          >
                            {t("common:delete")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>

          {/* <Pagination
        total={data?.data?.products.lastPage ?? 0}
        page={currentPage}
        onChange={(page) => {
          setCurrentPage(page)
        }}
      /> */}
        </div>
      </CardContainer>
    </>
  )
}

export default AddPricePage
