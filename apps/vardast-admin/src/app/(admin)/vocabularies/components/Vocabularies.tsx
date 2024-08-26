"use client"

import { useState } from "react"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import PageHeader from "@vardast/component/PageHeader"
import {
  useGetAllVocabulariesQuery,
  Vocabulary
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import CreateVocavulary from "@/app/(admin)/vocabularies/components/CreateVocabulary"
import VocabularyDeleteModal from "@/app/(admin)/vocabularies/components/VocabularyDeleteModal"

import VocabularyCard from "./VocabularyCard"

const Vocabularies = () => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [vocabularyToDelete, setVocabularyToDelete] = useState<Vocabulary>()

  const { isLoading, error, data } = useGetAllVocabulariesQuery(
    graphqlRequestClientWithToken
  )

  if (isLoading) return <Loading />
  if (error) return <LoadingFailed />
  if (!data?.vocabularies.data) return <NoResult entity="vocabulary" />

  return (
    <>
      <PageHeader title={t("common:vocabularies_index_title")}>
        {session?.abilities?.includes("gql.base.taxonomy.vocabulary.index") && (
          <CreateVocavulary />
        )}
      </PageHeader>
      <VocabularyDeleteModal
        open={deleteModalOpen}
        vocabularyToDelete={vocabularyToDelete}
        onOpenChange={setDeleteModalOpen}
      />
      <div className="flex flex-col gap-2">
        {data?.vocabularies.data.map(
          (vocabulary) =>
            vocabulary && (
              <VocabularyCard
                key={vocabulary.id}
                vocabulary={vocabulary as Vocabulary}
                onDeleteTriggered={(vocabulary) => {
                  setDeleteModalOpen(true)
                  setVocabularyToDelete(vocabulary)
                }}
              />
            )
        )}
      </div>
    </>
  )
}

export default Vocabularies
