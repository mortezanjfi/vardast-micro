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
import graphqlRequestClientAdmin from "@vardast/query/queryClients/graphqlRequestClientWhitToken"
import { Button } from "@vardast/ui/button"
import { Session } from "next-auth"
import useTranslation from "next-translate/useTranslation"

import CategoryFormModal from "@/app/(admin)/vocabularies/components/CategoryFormModal"

import CategoryCard from "./CategoryCard"

export type IGetCategoryQueryResult = UseQueryResult<
  GetCategoryQuery,
  unknown
> | null

// eslint-disable-next-line no-unused-vars
export enum CategoryModalEnumType {
  // eslint-disable-next-line no-unused-vars
  EditAttribute = "EditAttribute",
  // eslint-disable-next-line no-unused-vars
  CreateCategory = "CreateCategory",
  // eslint-disable-next-line no-unused-vars
  EditCategory = "EditCategory",
  // eslint-disable-next-line no-unused-vars
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
    let tempModalsOpen: Omit<CategoryActionModalState, "category"> = {
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
    graphqlRequestClientAdmin,
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
          modalsOpen={modalsOpen}
          onOpenChange={onOpenChange}
          actionType="create"
        />
      )}
      <PageHeader title={vocabularyQuery.data.vocabulary.title}>
        {session?.abilities?.includes("gql.base.taxonomy.category.store") && (
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
              session={session}
              category={category as Category}
              modalsOpen={modalsOpen}
              onOpenChange={onOpenChange}
              key={category?.id}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Categories
