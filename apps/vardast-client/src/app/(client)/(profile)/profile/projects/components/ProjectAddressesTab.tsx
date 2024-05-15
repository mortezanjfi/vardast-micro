"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { MapPinIcon } from "@heroicons/react/24/solid"
import PageHeader from "@vardast/component/PageHeader"
import { Button } from "@vardast/ui/button"
import useTranslation from "next-translate/useTranslation"

import AddressDeleteModal from "@/app/(client)/(profile)/profile/projects/components/AddressDeleteModal"
import { AddressModal } from "@/app/(client)/(profile)/profile/projects/components/AddressModal"
import ProjectAddressCart from "@/app/(client)/(profile)/profile/projects/components/ProjectAddressCart"

type ProjectInfoTabProps = {
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<string>>
}

export interface Address {
  id: number
  title: string
  postalAddress: string
  provinceId: number
  cityId: number
  postalCode: number
  transfereeName: string
  transfereeFamilyName: string
  transfereeNumber: number
}

const ProjectInfoTab = ({ activeTab, setActiveTab }: ProjectInfoTabProps) => {
  const { t } = useTranslation()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [addAddressModalModalOpen, setaddAddressModalModalOpen] =
    useState<boolean>(false)

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [addressToDelete, setAddressToDelete] = useState<Address>()

  const tabSubmit = () => {
    console.log(addresses)
    setActiveTab("colleagues")
  }

  return (
    <div className="flex h-full w-full flex-col">
      <AddressDeleteModal
        addressToDelete={addressToDelete}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      />
      <AddressModal
        activeTab={activeTab}
        open={addAddressModalModalOpen}
        onOpenChange={setaddAddressModalModalOpen}
        setAddresses={setAddresses}
      />
      {addresses.length > 0 && (
        <PageHeader
          pageHeaderClasses="!mb-0 py-5 border-b"
          title={
            "آدرس های پروژه خود را تعریف کنید و در تحویل و فاکتورها از آن ها استفاده کنید."
          }
          titleClasses="text-[14px] font-normal "
          containerClass="items-center"
        >
          {" "}
          <Button
            variant="outline-primary"
            size="medium"
            onClick={() => {
              setaddAddressModalModalOpen(true)
            }}
          >
            {t("common:add_new_entity", {
              entity: t("common:address")
            })}
          </Button>
        </PageHeader>
      )}

      <div className="flex w-full flex-col">
        {addresses.length ? (
          addresses.map((address) => (
            <ProjectAddressCart
              key={address.id}
              address={address}
              setAddressToDelete={setAddressToDelete}
              setDeleteModalOpen={setDeleteModalOpen}
              setaddAddressModalModalOpen={setaddAddressModalModalOpen}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-5 py-7">
            <MapPinIcon width={64} height={64} className="text-alpha-400" />
            <p>شما هنوز آدرس اضافه نکرده اید!</p>{" "}
            <Button
              className="my-5"
              size="medium"
              onClick={() => {
                setaddAddressModalModalOpen(true)
              }}
            >
              {t("common:add_new_entity", {
                entity: t("common:address")
              })}
            </Button>
          </div>
        )}
        <div className="flex flex-row-reverse  border-alpha-200 pt-9">
          <Button type="button" variant="primary" onClick={tabSubmit}>
            تایید و ادامه
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProjectInfoTab
