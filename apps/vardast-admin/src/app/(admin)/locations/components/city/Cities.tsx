"use client"

import { useContext, useState } from "react"
import { notFound } from "next/navigation"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import PageHeader from "@vardast/component/PageHeader"
import { City, useGetProvinceQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { useSession } from "next-auth/react"

import DeleteCityModal from "@/app/(admin)/locations/components/city/DeleteCityModal"

import FiltersBar from "../FiltersBar"
import { LocationsContext } from "../LocationsProvider"
import CityCard from "./CityCard"
import CreateCity from "./CreateCity"

type Props = {
  countrySlug: string
  provinceSlug: string
}

const Cities = ({ provinceSlug, countrySlug }: Props) => {
  const { data: session } = useSession()
  const { activesOnly } = useContext(LocationsContext)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [cityToDelete, setCityToDelete] = useState<City>()
  const { isLoading, error, data } = useGetProvinceQuery(
    graphqlRequestClientWithToken,
    {
      slug: provinceSlug
    }
  )

  if (isLoading) return <Loading />
  if (error) return <LoadingFailed />
  if (!data) notFound()

  return (
    <>
      <DeleteCityModal
        cityToDelete={cityToDelete}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      />
      <PageHeader title={data.province.name}>
        {session?.abilities?.includes("gql.base.location.city.index") && (
          <CreateCity provinceId={data.province.id} />
        )}
      </PageHeader>
      {!data.province.cities.length && <NoResult entity="city" />}
      <FiltersBar />
      <div>
        <div className="flex flex-col gap-2">
          {data.province.cities.map(
            (city) =>
              city && (
                <CityCard
                  city={city as City}
                  countrySlug={countrySlug}
                  key={city.id}
                  provinceSlug={provinceSlug}
                  show={activesOnly ? city.isActive : true}
                  onDeleteTriggered={(city) => {
                    setDeleteModalOpen(true)
                    setCityToDelete(city)
                  }}
                />
              )
          )}
        </div>
      </div>
    </>
  )
}

export default Cities
