"use client"

import { notFound } from "next/navigation"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import { Product, useGetProductQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import ProductForm from "@/app/(admin)/products/components/ProductForm"

type Props = {
  id: number
}

const ProductEdit = ({ id }: Props) => {
  const { isLoading, error, data } = useGetProductQuery(
    graphqlRequestClientWithToken,
    {
      id: +id
    },
    {
      staleTime: 1000
    }
  )

  if (isLoading) return <Loading />
  if (error) return <LoadingFailed />
  if (!data) notFound()

  return <ProductForm product={data.product as Product} />
}

export default ProductEdit
