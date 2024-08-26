"use client"

import { notFound } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { GetCategoryQuery } from "@vardast/graphql/generated"
import { setBreadCrumb } from "@vardast/provider/LayoutProvider/use-layout"
import { getCategoryQueryFn } from "@vardast/query/queryFns/categoryQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { CrumbItemProps } from "@vardast/type/breadcrumb"
import { BreadcrumbList, ItemList, WithContext } from "schema-dts"

interface SearchHeaderProps {
  selectedCategoryId: number
  isMobileView: boolean
}

const SearchHeader = ({
  selectedCategoryId,
  isMobileView
}: SearchHeaderProps) => {
  const { data } = useQuery<GetCategoryQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.CATEGORY_QUERY_KEY,
      { id: selectedCategoryId }
    ],
    queryFn: () => getCategoryQueryFn(selectedCategoryId)
  })

  if (!data) notFound()

  const breadcrumbJsonLdArray = []
  data.category.parentsChain.forEach((parent, idx) => {
    breadcrumbJsonLdArray.push({
      "@type": "ListItem",
      position: idx + 2,
      item: {
        "@id": encodeURI(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products/${parent.id}/${parent.title}`
        ),
        name: parent.title
      }
    })
  })

  breadcrumbJsonLdArray.push({
    "@type": "ListItem",
    position: data.category.parentsChain.length + 2,
    item: {
      "@id": encodeURI(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products/${data.category.id}/${data.category.title}`
      ),
      name: data.category.title
    }
  })

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@id": process.env.NEXT_PUBLIC_API_ENDPOINT,
          name: process.env.NEXT_PUBLIC_TITLE
        }
      },
      ...(breadcrumbJsonLdArray as ItemList[])
    ]
  }

  const breadcrumb: CrumbItemProps[] = []
  data.category.parentsChain.forEach((parent) => {
    breadcrumb.push({
      label: parent.title,
      path: isMobileView
        ? `/category/${parent.id}/${parent.title}`
        : `/products/${parent.id}/${parent.title}`,
      isCurrent: false
    })
  })

  breadcrumb.push({
    path: encodeURI(
      `${
        isMobileView
          ? `/category/${data.category.id}/${data.category.title}`
          : `/products/${data.category.id}/${data.category.title}`
      }`
    ),
    label: data.category.title,
    isCurrent: true
  })

  setBreadCrumb(breadcrumb)

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      type="application/ld+json"
    />
  )
}

export default SearchHeader
