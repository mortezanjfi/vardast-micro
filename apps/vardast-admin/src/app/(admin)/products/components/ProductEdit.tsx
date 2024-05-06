"use client"

import { notFound } from "next/navigation"
import graphqlRequestClientAdmin from "@/graphqlRequestClientAdmin"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import { Product, useGetProductQuery } from "@vardast/graphql/generated"

import ProductForm from "@/app/(admin)/products/components/ProductForm"

type Props = {
  id: number
}

const ProductEdit = ({ id }: Props) => {
  const { isLoading, error, data } = useGetProductQuery(
    graphqlRequestClientAdmin,
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
