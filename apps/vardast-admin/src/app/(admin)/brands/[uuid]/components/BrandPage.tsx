"use client"

import { BrandModalEnum } from "@vardast/component/type"
import { Brand, useGetBrandQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { useModals } from "@vardast/ui/modal"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"

import BrandInfo from "@/app/(admin)/brands/[uuid]/components/BrandInfo"
import OldBrandForm from "@/app/(admin)/brands/[uuid]/components/OldBrandForm"

type Props = { uuid: string }

function BrandPage({ uuid }: Props) {
  const [modals, onChangeModals, onCloseModals] = useModals<BrandModalEnum>()

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  const getBrandQuery = useGetBrandQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    },
    {
      staleTime: 1000
    }
  )

  return (
    <>
      <BrandInfo
        brand={getBrandQuery?.data?.brand as Brand}
        loading={getBrandQuery.isLoading}
        modal={[modals, onChangeModals, onCloseModals]}
      />
      <OldBrandForm brand={getBrandQuery?.data?.brand as Brand} />
    </>
  )
}

export default BrandPage
