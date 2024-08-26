"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import { UseQueryResult } from "@tanstack/react-query"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import PageHeader from "@vardast/component/PageHeader"
import {
  Category,
  GetCategoryQuery,
  useGetVocabularyQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import { Session } from "next-auth"
import useTranslation from "next-translate/useTranslation"

import CategoryFormModal from "@/app/(admin)/vocabularies/components/CategoryFormModal"

import CategoryCard from "./CategoryCard"

export type IGetCategoryQueryResult = UseQueryResult<
  GetCategoryQuery,
  unknown
> | null

 
export enum CategoryModalEnumType {
   
  EditAttribute = "EditAttribute",
   
  CreateCategory = "CreateCategory",
   
  EditCategory = "EditCategory",
   
  RemoveCategory = "RemoveCategory"
}

export type CategoryActionModalState = {
  [CategoryModalEnumType.EditAttribute]: boolean
  [CategoryModalEnumType.EditCategory]: boolean
  [CategoryModalEnumType.RemoveCategory]: boolean
  [CategoryModalEnumType.CreateCategory]: boolean
  category?: Category | undefined
}

type Props = {
  slug: string
  session: Session | null
}

export type OnOpenCategoryChangeProps = {
  currentCategory?: Category | undefined
  type: CategoryModalEnumType
}

const Categories = ({ slug, session }: Props) => {
  const { t } = useTranslation()

  const [modalsOpen, setModalsOpen] = useState<CategoryActionModalState>({
    [CategoryModalEnumType.EditAttribute]: false,
    [CategoryModalEnumType.EditCategory]: false,
    [CategoryModalEnumType.RemoveCategory]: false,
    [CategoryModalEnumType.CreateCategory]: false
  })

  const onOpenChange = ({
    currentCategory,
    type
  }: OnOpenCategoryChangeProps) => {
    const tempModalsOpen: Omit<CategoryActionModalState, "category"> = {
      [CategoryModalEnumType.EditAttribute]: false,
      [CategoryModalEnumType.EditCategory]: false,
      [CategoryModalEnumType.RemoveCategory]: false,
      [CategoryModalEnumType.CreateCategory]: false
    }
    setModalsOpen({
      ...tempModalsOpen,
      [type]: !modalsOpen[type],
      category: currentCategory ?? undefined
    })
  }

  const vocabularyQuery = useGetVocabularyQuery(
    graphqlRequestClientWithToken,
    {
      slug: slug
    },
    {
      queryKey: ["admin-category-create"]
    }
  )

  if (vocabularyQuery.isLoading) return <Loading />
  if (vocabularyQuery.error) return <LoadingFailed />
  if (!vocabularyQuery.data) notFound()

  return (
    <>
      {modalsOpen[CategoryModalEnumType.CreateCategory] && (
        <CategoryFormModal
          actionType="create"
          modalsOpen={modalsOpen}
          onOpenChange={onOpenChange}
        />
      )}
      <PageHeader title={vocabularyQuery.data.vocabulary.title}>
        {session?.abilities?.includes("gql.base.taxonomy.category.index") && (
          <Button
            size="medium"
            onClick={() =>
              onOpenChange({ type: CategoryModalEnumType.CreateCategory })
            }
          >
            {t("common:add_entity", { entity: t("common:category") })}
          </Button>
        )}
      </PageHeader>
      {!vocabularyQuery.data.vocabulary.categories.length && (
        <NoResult entity="category" />
      )}

      <div>
        <div className="flex flex-col gap-2">
          {vocabularyQuery.data.vocabulary.categories.map((category) => (
            <CategoryCard
              category={category as Category}
              key={category?.id}
              modalsOpen={modalsOpen}
              session={session}
              onOpenChange={onOpenChange}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Categories
