"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { useQueryClient, UseQueryResult } from "@tanstack/react-query"
import {
  FindPreOrderByIdQuery,
  OfferOrder,
  OrderOfferStatuses,
  PreOrderStates,
  useCreateOrderOfferMutation,
  useUpdateOrderOfferMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import axiosApis, { IServePdf } from "@vardast/query/queryClients/axiosApis"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import { Checkbox } from "@vardast/ui/checkbox"
import { Form, FormControl, FormField, FormItem } from "@vardast/ui/form"
import { ClientError } from "graphql-request"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { ApiCallStatusEnum } from "../../../type/src/Enums"
import { getContentByApiStatus } from "../../../util/src/GetContentByApiStatus"
import CardContainer from "../desktop/CardContainer"
import SellerAdminConfirmationModal from "../desktop/SellerAdminConfirmationModal"
import Link from "../Link"
import Loading from "../Loading"
import LoadingFailed from "../LoadingFailed"
import NoResult from "../NoResult"
import AddSellerModal from "./AddSellerModal"
import OfferDetailModal from "./OfferDetailModal"
import SellerMobileCart from "./SellerMobileCart"

type Props = {
  isClient?: boolean
  isMobileView?: boolean
  uuid: string
  findPreOrderByIdQuery: UseQueryResult<FindPreOrderByIdQuery, unknown>
}

const AddOfferSchema = z.object({
  offerId: z.number()
})

const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NoResult entity="offer" />,
  [ApiCallStatusEnum.DEFAULT]: null
}

export type ConfirmOffer = TypeOf<typeof AddOfferSchema>
function SellersList({
  isClient,
  isMobileView,
  findPreOrderByIdQuery,
  uuid
}: Props) {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const token = session?.accessToken || null
  const router = useRouter()
  const [detailOpen, setDetailOpen] = useState<boolean>(false)
  const [addSellerModalOpen, setAddSellerModalOpen] = useState<boolean>(false)
  const [selectedOfferId, setSelectedOfferId] = useState<number>()
  const [orderId, setOrderId] = useState<number>()
  const [confirmModalOpen, seConfirmModalOpen] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const form = useForm<ConfirmOffer>({ resolver: zodResolver(AddOfferSchema) })
  const queryClient = useQueryClient()

  const thClasses = "border align-middle"

  const updateOrderOfferMutation = useUpdateOrderOfferMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        ;(
          errors.response.errors?.at(0)?.extensions.displayErrors as string[]
        ).map((error) =>
          toast({
            description: error,
            duration: 5000,
            variant: "danger"
          })
        )
      },
      onSuccess: (data) => {
        if (data?.updateOrderOffer?.id) {
          queryClient.invalidateQueries({
            queryKey: ["FindPreOrderById"]
          })
          toast({
            title: "قیمت گذاری با موفقیت به پایان رسید",
            duration: 8000,
            variant: "success"
          })
          router.push(`/my-orders`)
        }
      }
    }
  )

  const submitModal = () => {
    updateOrderOfferMutation.mutate({
      updateOrderOfferInput: {
        id: form.watch("offerId"),
        status: OrderOfferStatuses.Invoice
      }
    })
  }

  const submitButton = () => {
    seConfirmModalOpen(true)
  }

  const createOrderOfferMutation = useCreateOrderOfferMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        ;(
          errors.response.errors?.at(0)?.extensions.displayErrors as string[]
        ).map((error) =>
          toast({
            description: error,
            duration: 5000,
            variant: "danger"
          })
        )
      },
      onSuccess: (data) => {
        if (data?.createOrderOffer?.id) {
          queryClient.invalidateQueries({
            queryKey: ["FindPreOrderById"]
          })
          !isMobileView &&
            toast({
              title: "پیشنهاد شما با موفقیت ثبت شد",
              description:
                "لطفا برای قیمت گذاری بر روی کالاها ادامه فرایند را انجام دهید.",
              duration: 8000,
              variant: "success"
            })
          setOrderId(data.createOrderOffer.id)
          setAddSellerModalOpen(true)
          // router.push(`/my-orders/${uuid}/offers/${data.createOrderOffer.id}`)
        }
      }
    }
  )

  const onAddSeller = (e) => {
    e.stopPropagation()
    e.preventDefault()
    createOrderOfferMutation.mutate({
      createOrderOfferInput: {
        preOrderId: +uuid
      }
    })
  }

  const downLoadPreInvoice = async ({ uuid, access_token }: IServePdf) => {
    const response = await axiosApis.getInvoice({ uuid, access_token })
    const html = response.data
    const blob = new Blob([html], { type: "text/html" })
    const url = window.URL.createObjectURL(blob)

    const newTab = window.open(url, "_blank")
    newTab.focus()
  }

  useEffect(() => {
    form.setValue("offerId", selectedRow)
  }, [selectedRow])
  // z.setErrorMap(zodI18nMap)

  const offerLength = useMemo(
    () => findPreOrderByIdQuery?.data?.findPreOrderById?.offers.length,
    [findPreOrderByIdQuery?.data?.findPreOrderById?.offers.length]
  )

  return (
    <>
      <SellerAdminConfirmationModal
        onSubmit={submitModal}
        content={
          "در صورت تایید، سفارش شما به خریدار ارسال می شود و امکان ویرایش قیمت وجود نخواهد داشت."
        }
        open={confirmModalOpen}
        onOpenChange={seConfirmModalOpen}
      />
      <OfferDetailModal
        isMobileView={isMobileView}
        findPreOrderByIdQuery={findPreOrderByIdQuery}
        selectedOfferId={selectedOfferId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
      <AddSellerModal
        isMobileView={isMobileView}
        detailModalProps={{
          findPreOrderByIdQuery: findPreOrderByIdQuery,
          selectedOfferId: selectedOfferId,
          setSelectedOfferId: setSelectedOfferId,
          open: detailOpen,
          onOpenChange: setDetailOpen
        }}
        orderId={orderId}
        open={addSellerModalOpen}
        onOpenChange={setAddSellerModalOpen}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitButton)}
          className="flex flex-col gap-7"
        >
          <CardContainer title="لیست پیشنهادات">
            <div className="flex flex-col">
              {findPreOrderByIdQuery?.data?.findPreOrderById?.status !==
                PreOrderStates.Closed &&
                !isClient && (
                  <div className="mb-7 flex w-full flex-row-reverse">
                    <Button
                      className="py-2"
                      onClick={(e) => {
                        onAddSeller(e)
                      }}
                      variant="outline-primary"
                    >
                      {t("common:add_entity", { entity: t("common:offer") })}
                    </Button>
                  </div>
                )}
              {isMobileView ? (
                <div className="flex flex-col divide-y">
                  {findPreOrderByIdQuery?.data?.findPreOrderById?.offers.map(
                    (offer, index) => (
                      <SellerMobileCart
                        setSelectedOfferId={setSelectedOfferId}
                        setOpen={setDetailOpen}
                        form={form}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                        key={index}
                        offer={offer as OfferOrder}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-7">
                  {renderedListStatus[
                    getContentByApiStatus(findPreOrderByIdQuery, !!offerLength)
                  ] || (
                    <>
                      <table className="table border-collapse border">
                        <thead>
                          <tr>
                            <th className={thClasses}>{t("common:row")}</th>
                            <th className={thClasses}>
                              {t("common:entity_code", {
                                entity: t("common:price-giver")
                              })}
                            </th>
                            <th className={thClasses}>
                              {t("common:entity_name", {
                                entity: t("common:price-giver")
                              })}
                            </th>
                            <th className={thClasses}>
                              {t("common:invoice-number")}
                            </th>
                            <th className={thClasses}>
                              {t("common:invoice-total-price")} (تومان)
                            </th>
                            <th>{t("common:offer-submition-time")}</th>
                            {findPreOrderByIdQuery?.data?.findPreOrderById
                              ?.status !== PreOrderStates.Closed &&
                              !isClient && (
                                <>
                                  <th className={thClasses}>
                                    {t("common:choose-offer")}
                                  </th>
                                </>
                              )}
                            <th className={thClasses}>
                              {t("common:operation")}
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {findPreOrderByIdQuery.data?.findPreOrderById?.offers
                            ?.length === 0 && !isClient ? (
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>
                                <span>فروشنده مورد نظر خود را اضافه کنید!</span>
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                          ) : (
                            findPreOrderByIdQuery.data?.findPreOrderById?.offers?.map(
                              (offer, index) => (
                                <tr key={offer?.id}>
                                  <td className="w-4 border">
                                    <span>{digitsEnToFa(index + 1)}</span>
                                  </td>
                                  <td className="border">
                                    <span className="font-medium text-alpha-800">
                                      {offer?.id && digitsEnToFa(offer?.id)}
                                    </span>
                                  </td>
                                  <td className="border">
                                    {offer?.request_name}
                                  </td>
                                  <td className="border">
                                    {digitsEnToFa(offer?.uuid)}
                                  </td>
                                  <td className="border">
                                    {digitsEnToFa(addCommas(offer?.total))}
                                  </td>
                                  <td>
                                    {offer?.created_at
                                      ? digitsEnToFa(
                                          new Date(
                                            offer?.created_at
                                          ).toLocaleDateString("fa-IR", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit"
                                          })
                                        )
                                      : ""}
                                  </td>
                                  {findPreOrderByIdQuery?.data?.findPreOrderById
                                    ?.status !== PreOrderStates.Closed &&
                                    !isClient && (
                                      <>
                                        <td className="border">
                                          <FormField
                                            control={form.control}
                                            name="offerId"
                                            render={({ field }) => {
                                              return (
                                                <FormItem className="checkbox-field">
                                                  <FormControl>
                                                    <Checkbox
                                                      checked={
                                                        offer?.id ===
                                                        selectedRow
                                                      }
                                                      onCheckedChange={(
                                                        checked
                                                      ) => {
                                                        setSelectedRow(
                                                          offer?.id
                                                        )
                                                      }}
                                                    />
                                                  </FormControl>
                                                </FormItem>
                                              )
                                            }}
                                          />
                                        </td>
                                      </>
                                    )}
                                  <td className="border">
                                    <span
                                      onClick={() => {
                                        setSelectedOfferId(offer?.id)
                                        setDetailOpen(true)
                                      }}
                                      className="tag cursor-pointer text-blue-500"
                                    >
                                      نمایش جزییات
                                    </span>
                                    /
                                    <span
                                      onClick={() => {
                                        downLoadPreInvoice({
                                          access_token: token,
                                          uuid: `${offer.uuid}`
                                        })
                                      }}
                                      className="tag cursor-pointer text-error"
                                    >
                                      {t("common:pre-invoice")}
                                    </span>
                                    /
                                    <span
                                      onClick={() => {
                                        router.push(
                                          `/profile/orders/${uuid}/verify/${offer.id}`
                                        )
                                      }}
                                      className="tag cursor-pointer text-success"
                                    >
                                      {t("common:payment")}
                                    </span>
                                  </td>
                                </tr>
                              )
                            )
                          )}
                        </tbody>
                      </table>
                    </>
                  )}
                  <div className="absolute bottom-[calc(env(safe-area-inset-bottom)*0.5+8rem)] mt-5 grid w-full grid-cols-2 justify-end gap border-t bg-alpha-white pt-5 md:relative md:bottom-0 md:flex md:justify-end">
                    <Link
                      className="btn btn-md btn-secondary"
                      href="/profile/orders/"
                    >
                      بازگشت به سفارشات
                    </Link>
                    {/* {findPreOrderByIdQuery.data?.findPreOrderById.status ===
                      PreOrderStates.Completed && (
                      <Button
                        disabled={
                          createOrderOfferMutation.isLoading ||
                          findPreOrderByIdQuery.isLoading
                        }
                        loading={createOrderOfferMutation.isLoading}
                        onClick={onCreateOffer}
                        type="button"
                        variant="full-secondary"
                      >
                        قیمت پایین تر دارم!
                      </Button>
                    )} */}
                  </div>
                </div>
              )}
            </div>
          </CardContainer>
          {/* <CardContainer title="تایید قیمت خریدار">
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="offerId"
                render={({ field }) => {
                  return (
                    <FormItem className="checkbox-field flex-col gap-2">
                      <div className="flex gap-2">
                        <FormControl>
                          <Checkbox
                            checked={selectedRow === 0}
                            onCheckedChange={(checked) => {
                              setSelectedRow(0)
                              console.log(selectedRow)

                              console.log(checked)
                            }}
                          />
                        </FormControl>
                        <FormLabel>
                          قیمت خریدار را به عنوان پایین ترین قیمت، تایید می کنم!
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
          </CardContainer> */}
          {findPreOrderByIdQuery?.data?.findPreOrderById?.status !==
            PreOrderStates.Closed &&
            !isClient && (
              <div className="justify between flex flex-row-reverse pt-5 md:border-t">
                <Button
                  disabled={!form.watch("offerId")}
                  className="w-full py-2 md:w-fit"
                  type="submit"
                  variant="primary"
                >
                  ارسال پیشنهاد به فروشنده
                </Button>
              </div>
            )}
        </form>
      </Form>
    </>
  )
}

export default SellersList
