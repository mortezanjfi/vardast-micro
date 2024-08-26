"use client"

import { useContext, useState } from "react"
import { notFound } from "next/navigation"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import PageHeader from "@vardast/component/PageHeader"
import { Province, useGetCountryQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { useSession } from "next-auth/react"

import DeleteProvinceModal from "@/app/(admin)/locations/components/province/DeleteProvinceModal"

import FiltersBar from "../FiltersBar"
import { LocationsContext } from "../LocationsProvider"
import CreateProvince from "./CreateProvince"
import ProvinceCard from "./ProvinceCard"

type Props = {
  countrySlug: string
}

const Provinces = ({ countrySlug }: Props) => {
  const { data: session } = useSession()
  const { activesOnly } = useContext(LocationsContext)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [provinceToDelete, setProvinceToDelete] = useState<Province>()
  const { isLoading, error, data } = useGetCountryQuery(
    graphqlRequestClientWithToken,
    {
      slug: countrySlug
    }
  )

  if (isLoading) return <Loading />
  if (error) return <LoadingFailed />
  if (!data) notFound()

  return (
    <>
      <DeleteProvinceModal
        open={deleteModalOpen}
        provinceToDelete={provinceToDelete}
        onOpenChange={setDeleteModalOpen}
      />
      <PageHeader title={data.country.name}>
        {session?.abilities?.includes("gql.base.location.province.index") && (
          <CreateProvince countryId={data.country.id} />
        )}
      </PageHeader>
      {!data.country.provinces.length && <NoResult entity="province" />}
      <FiltersBar />
      <div>
        <div className="flex flex-col gap-2">
          {data.country?.provinces.map(
            (province) =>
              province && (
                <ProvinceCard
                  countrySlug={countrySlug}
                  key={province.id}
                  province={province as Province}
                  show={activesOnly ? province.isActive : true}
                  onDeleteTriggered={(province) => {
                    setDeleteModalOpen(true)
                    setProvinceToDelete(province)
                  }}
                />
              )
          )}
        </div>
      </div>
    </>
  )
}

export default Provinces
