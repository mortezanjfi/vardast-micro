"use client"

import { useContext, useState } from "react"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import PageHeader from "@vardast/component/PageHeader"
import { Country, useGetAllCountriesQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import DeleteCountryModal from "@/app/(admin)/locations/components/country/DeleteCountryModal"

import FiltersBar from "../FiltersBar"
import { LocationsContext } from "../LocationsProvider"
import CountryCard from "./CountryCard"
import CreateCountry from "./CreateCountry"

const Countries = () => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const { activesOnly } = useContext(LocationsContext)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [countryToDelete, setCountryToDelete] = useState<Country>()
  const { isLoading, error, data } = useGetAllCountriesQuery(
    graphqlRequestClientWithToken
  )

  if (isLoading) return <Loading />
  if (error) return <LoadingFailed />
  if (!data?.countries.data) return <NoResult entity="country" />

  return (
    <>
      <DeleteCountryModal
        countryToDelete={countryToDelete}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      />
      <PageHeader title={t("common:locations_index_title")}>
        {session?.abilities?.includes("gql.base.location.country.store") && (
          <CreateCountry />
        )}
      </PageHeader>
      <FiltersBar />
      <div>
        <div className="flex flex-col gap-2">
          {data.countries.data.map(
            (country) =>
              country && (
                <CountryCard
                  show={activesOnly ? country.isActive : true}
                  key={country.id}
                  onDeleteTriggered={(country) => {
                    setDeleteModalOpen(true)
                    setCountryToDelete(country)
                  }}
                  country={country as Country}
                />
              )
          )}
        </div>
      </div>
    </>
  )
}

export default Countries
