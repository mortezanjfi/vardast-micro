"use client"

import { useState } from "react"
import { MapPinIcon } from "@heroicons/react/24/solid"
import Loading from "@vardast/component/Loading"
import PageHeader from "@vardast/component/PageHeader"
import { ProjectAddress } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import useTranslation from "next-translate/useTranslation"

import AddressDeleteModal from "@/app/(client)/(profile)/profile/projects/components/address/AddressDeleteModal"
import { AddressModal } from "@/app/(client)/(profile)/profile/projects/components/address/AddressModal"
import ProjectAddressCart from "@/app/(client)/(profile)/profile/projects/components/address/ProjectAddressCart"
import { ProjectTabProps } from "@/app/(client)/(profile)/profile/projects/components/project/ProjectForm"

export enum SELECTED_ITEM_TYPE {
  DELETE = "DELETE",
  ADD = "ADD",
  EDIT = "EDIT"
}

export type SELECTED_ITEM = {
  type: SELECTED_ITEM_TYPE
  data?: ProjectAddress
}

export type ProjectAddressCartProps = {
  isMobileView?: boolean
  selectedAddresses: SELECTED_ITEM
  onCloseModal: (_?: any) => void
  uuid: string
}

const ProjectAddressesTab = ({
  isMobileView,
  uuid,
  findOneProjectQuery
}: ProjectTabProps) => {
  const { t } = useTranslation()
  const [selectedAddresses, setSelectedAddresses] = useState<SELECTED_ITEM>()

  const onCloseModal = () => {
    setSelectedAddresses(undefined)
  }

  const onOpenModal = (selectedAddresses: SELECTED_ITEM) => {
    setSelectedAddresses(selectedAddresses)
  }

  return (
    <>
      <AddressDeleteModal
        uuid={uuid}
        onCloseModal={onCloseModal}
        selectedAddresses={selectedAddresses}
      />
      <AddressModal
        isMobileView={isMobileView}
        uuid={uuid}
        onCloseModal={onCloseModal}
        selectedAddresses={selectedAddresses}
      />

      {findOneProjectQuery?.data?.findOneProject?.address.length > 0 && (
        <PageHeader
          pageHeaderClasses="!mb-0 py-5 border-b"
          title={
            "آدرس های پروژه خود را تعریف کنید و در تحویل و فاکتورها از آن ها استفاده کنید."
          }
          titleClasses="text-[14px] font-normal "
          containerClass={isMobileView && "!flex-col"}
        >
          <Button
            className="py-2"
            variant="outline-primary"
            size="medium"
            onClick={() => {
              onOpenModal({
                type: SELECTED_ITEM_TYPE.ADD,
                data: undefined
              })
            }}
          >
            {t("common:add_new_entity", {
              entity: t("common:address")
            })}
          </Button>
        </PageHeader>
      )}

      {findOneProjectQuery.isFetching && findOneProjectQuery.isLoading ? (
        <div className="flex h-full items-center justify-center pt-6">
          <Loading hideMessage />
        </div>
      ) : findOneProjectQuery?.data?.findOneProject?.address.length > 0 ? (
        <>
          {" "}
          {findOneProjectQuery?.data?.findOneProject?.address.map((address) => (
            <ProjectAddressCart
              key={address.id}
              address={address.address as ProjectAddress}
              onOpenModal={onOpenModal}
            />
          ))}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-5 py-7">
          <MapPinIcon
            width={isMobileView ? 48 : 64}
            height={isMobileView ? 48 : 64}
            className="text-alpha-400"
          />
          <p>شما هنوز آدرس اضافه نکرده اید!</p>{" "}
          <Button
            className="my-5 py-3"
            size="medium"
            onClick={() => {
              onOpenModal({
                type: SELECTED_ITEM_TYPE.ADD,
                data: undefined
              })
            }}
          >
            {t("common:add_new_entity", {
              entity: t("common:address")
            })}
          </Button>
        </div>
      )}

      {isMobileView && (
        <div className="mt-auto flex w-full justify-end md:mt-5">
          <Button
            className="w-full"
            disabled={
              findOneProjectQuery?.data?.findOneProject?.address.length === 0
            }
            loading={
              findOneProjectQuery.isFetching && findOneProjectQuery.isLoading
            }
            type="submit"
            variant="primary"
          >
            ذخیره اطلاعات
          </Button>
        </div>
      )}
    </>
  )
}

export default ProjectAddressesTab
