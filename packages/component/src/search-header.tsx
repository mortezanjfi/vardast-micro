"use client"

import { notFound } from "next/navigation"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { useQuery } from "@tanstack/react-query"
import { GetCategoryQuery } from "@vardast/graphql/generated"
import { getCategoryQueryFn } from "@vardast/query/queryFns/categoryQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { BreadcrumbList, ItemList, WithContext } from "schema-dts"

import Breadcrumb, { CrumbItemProps } from "./Breadcrumb"

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
          "@id": process.env.NEXT_PUBLIC_API_ENDPOINT as string,
          name: process.env.NEXT_PUBLIC_TITLE as string
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
    label: `${data.category.title} (${digitsEnToFa(
      addCommas(data.category.productsCount)
    )} کالا)`,
    isCurrent: true
  })

  return (
    <>
      <div className="bg-alpha-white">
        <Breadcrumb dynamic={false} items={breadcrumb} />
      </div>

      {/* <div className="mb-8">
        <h2 className="text-xl font-extrabold text-alpha-800">
          {data.category.title}
        </h2>
      </div> */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  )
}

export default SearchHeader
