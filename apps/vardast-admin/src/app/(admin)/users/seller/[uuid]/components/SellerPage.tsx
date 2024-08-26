"use client"

import { useCallback, useMemo } from "react"
import Image from "next/image"
import DetailsCard from "@vardast/component/desktop/DetailsCard"
import { SellerModalEnum } from "@vardast/component/type"
import { DetailsCardPropsType } from "@vardast/component/types/type"
import { useGetSellerQuery } from "@vardast/graphql/generated"
import {
  ThreeStateSupervisionStatusesFa,
  VisibilityFa
} from "@vardast/lib/constants"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { useModals } from "@vardast/ui/modal"
import { LucideWarehouse } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import SellerModal from "@/app/(admin)/users/seller/[uuid]/components/SellerModal"

export enum SELLER_EDIT_TAB {
  INFO = "information",
  ADDRESS = "addresses",
  CONTACT = "contactInfos",
  MEMBERS = "members"
}

type Props = {
  uuid: string
}

const SellerPage = ({ uuid }: Props) => {
  const { t } = useTranslation()
  const [modals, onChangeModals, onCloseModals] = useModals<SellerModalEnum>()

  const getSellerQuery = useGetSellerQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    },
    {
      staleTime: 1000
    }
  )

  const seller = useMemo(() => getSellerQuery.data?.seller, [getSellerQuery])

  const detailsCardProps: DetailsCardPropsType = useMemo(
    () => ({
      badges: [
        {
          children: ThreeStateSupervisionStatusesFa[seller?.status]?.name_fa,
          variant: ThreeStateSupervisionStatusesFa[seller?.status]?.variant
        },
        {
          children:
            VisibilityFa[String(seller?.isPublic).toUpperCase()]?.name_fa,
          variant: VisibilityFa[String(seller?.isPublic).toUpperCase()]?.variant
        }
      ],
      items: [
        {
          item: {
            value: (
              <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                {seller?.logoFile ? (
                  <Image
                    alt="..."
                    className="object-contain p-3"
                    fill
                    src={seller?.logoFile?.presignedUrl.url}
                  />
                ) : (
                  <LucideWarehouse
                    className="h-8 w-8 text-alpha-400"
                    strokeWidth={1.5}
                  />
                )}
              </div>
            )
          },
          className: "col-span-full"
        },
        {
          item: {
            key: t("common:name"),
            value: seller?.name
          }
        },
        {
          item: {
            key: t("common:bio"),
            value: seller?.bio
          },
          className: "col-span-full"
        }
      ],
      card: {
        title: t("common:entity_info", { entity: t("common:company") }),
        button: {
          onClick: () => {
            const { bio, isPublic, name, rating, status, id } = seller
            onChangeModals({
              type: SellerModalEnum.INFO,
              data: {
                bio,
                isPublic,
                name,
                rating,
                status,
                id
              }
            })
          },
          disabled: getSellerQuery.isLoading || getSellerQuery.isFetching,
          text: t("common:edit_entity", {
            entity: t("common:entity_info", { entity: t("common:seller") })
          }),
          type: "button"
        }
      }
    }),
    [getSellerQuery.data]
  )

  const modalProps = useCallback(
    (type: SellerModalEnum) => ({
      onCloseModals: <T,>(data: T) => {
        if (data) {
          getSellerQuery.refetch()
        }
        onCloseModals()
      },
      onChangeModals,
      modals,
      open: modals?.type === type
    }),
    [getSellerQuery.data, modals]
  )

  return (
    <>
      <SellerModal {...modalProps(SellerModalEnum.INFO)} />
      <DetailsCard {...detailsCardProps} />
    </>
  )
}

export default SellerPage
