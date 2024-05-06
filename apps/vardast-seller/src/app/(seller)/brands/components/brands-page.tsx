"use client"

import { useCallback, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import NotFoundMessage from "@vardast/component/NotFound"
import {
  Brand,
  GetMyProfileBrandsSellerQuery,
  IndexBrandInput
} from "@vardast/graphql/generated"
import { getMyProfileBrandsSellerQueryFns } from "@vardast/query/queryFns/getMyProfileBrandsSellerQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Session } from "next-auth"

import BrandOrSellerCard from "@/app/components/BrandOrSellerCard"
import BrandsOrSellersContainer from "@/app/components/BrandsOrSellersContainer"

interface BrandsPageProps {
  isMobileView: boolean
  args: IndexBrandInput
  session: Session | null
}

const BrandsPage = ({ session }: BrandsPageProps) => {
  // const { t } = useTranslation()
  const allBrandsQuery = useQuery<GetMyProfileBrandsSellerQuery>(
    [QUERY_FUNCTIONS_KEY.GET_MY_PROFILE_BRANDS_SELLERS],
    () =>
      getMyProfileBrandsSellerQueryFns({ accessToken: session?.accessToken }),
    {
      refetchOnMount: "always"
    }
  )

  const getResolvedData = useCallback(() => {
    const temp: Brand[] = []
    const repeatedItems: Brand[] = []

    allBrandsQuery.data?.myProfileSeller.myProduct.forEach((item) => {
      if (!temp.find((tempItem) => tempItem.id === item?.product?.brand?.id)) {
        temp.push(item?.product.brand as Brand)
      } else {
        repeatedItems.push(item?.product.brand as Brand)
      }
    })

    return temp
  }, [allBrandsQuery.data?.myProfileSeller.myProduct])

  const resolvedData = useMemo(() => getResolvedData(), [getResolvedData])

  if (!allBrandsQuery.data?.myProfileSeller?.myProduct?.length)
    return <NotFoundMessage />

  return (
    <>
      {/* <div className="border-b bg-alpha-white">
        <Breadcrumb
          dynamic={false}
          items={[
            {
              label: t("common:brands_vardast"),
              path: "/brands",
              isCurrent: true
            }
          ]}
        />
      </div> */}

      <BrandsOrSellersContainer>
        {({ selectedItemId, setSelectedItemId }) => (
          <>
            {resolvedData.map(
              (myProduct) =>
                myProduct && (
                  <BrandOrSellerCard
                    selectedItemId={selectedItemId}
                    setSelectedItemId={setSelectedItemId}
                    key={myProduct.id}
                    content={{
                      ...(myProduct as Brand),
                      __typename: "Brand"
                    }}
                  />
                )
            )}
          </>
        )}
      </BrandsOrSellersContainer>
    </>
  )
}

export default BrandsPage
