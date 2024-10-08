"use client"

import { useContext, useState } from "react"
import { notFound } from "next/navigation"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import PageHeader from "@vardast/component/PageHeader"
import { Area, useGetCityQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { useSession } from "next-auth/react"

import DeleteAreaModal from "@/app/(admin)/locations/components/area/DeleteAreaModal"

import FiltersBar from "../FiltersBar"
import { LocationsContext } from "../LocationsProvider"
import AreaCard from "./AreaCard"
import CreateArea from "./CreateArea"

type Props = {
  citySlug: string
}

const Areas = ({ citySlug }: Props) => {
  const { data: session } = useSession()
  const { activesOnly } = useContext(LocationsContext)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [areaToDelete, setAreaToDelete] = useState<Area>()
  const { isLoading, error, data } = useGetCityQuery(
    graphqlRequestClientWithToken,
    {
      slug: citySlug
    }
  )

  if (isLoading) return <Loading />
  if (error) return <LoadingFailed />
  if (!data) notFound()

  return (
    <>
      <DeleteAreaModal
        areaToDelete={areaToDelete}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      />
      <PageHeader title={data.city.name}>
        {session?.abilities?.includes("gql.base.location.area.index") && (
          <CreateArea cityId={data.city.id} />
        )}
      </PageHeader>
      {!data.city.areas.length && <NoResult entity="area" />}
      <FiltersBar />
      <div>
        <div className="flex flex-col gap-2">
          {data.city.areas.map(
            (area) =>
              area && (
                <AreaCard
                  area={area as Area}
                  key={area.id}
                  show={activesOnly ? area.isActive : true}
                  onDeleteTriggered={(area) => {
                    setDeleteModalOpen(true)
                    setAreaToDelete(area)
                  }}
                />
              )
          )}
        </div>
      </div>
    </>
  )
}

export default Areas
