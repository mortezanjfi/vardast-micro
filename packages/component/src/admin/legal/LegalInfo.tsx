"use client"

import { useMemo } from "react"
import { addCommas } from "@persian-tools/persian-tools"
import { Legal } from "@vardast/graphql/generated"
import { LegalStatusEnumFa } from "@vardast/lib/constants"
import { UseModalsReturn } from "@vardast/ui/modal"
import useTranslation from "next-translate/useTranslation"

import DetailsCard from "../../desktop/DetailsCard"
import { LegalModalEnum } from "../../type"
import { DetailsCardPropsType } from "../../types/type"
import LegalModal from "./LegalModal"

type LegalInfoProps = {
  legal: Legal
  loading?: boolean
  modal: UseModalsReturn<LegalModalEnum>
}

const LegalInfo = ({ legal, loading, modal }: LegalInfoProps) => {
  const { t } = useTranslation()
  const [modals, onChangeModals, onCloseModals] = modal

  const detailsCardProps: DetailsCardPropsType = useMemo(
    () => ({
      badges: [
        {
          children: LegalStatusEnumFa[legal?.status]?.name_fa,
          variant: LegalStatusEnumFa[legal?.status]?.variant
        }
      ],
      items: [
        {
          item: {
            key: t("common:name_company"),
            value: legal?.name_company
          }
        },
        {
          item: {
            key: t("common:first_name"),
            value: legal?.owner?.firstName
          }
        },
        {
          item: {
            key: t("common:last_name"),
            value: legal?.owner?.lastName
          }
        },
        {
          item: {
            key: t("common:national_id"),
            value: legal?.national_id
          }
        },
        {
          item: {
            key: t("common:entity_number", {
              entity: t("common:account")
            }),
            value: legal?.accountNumber
          }
        },
        {
          item: {
            key: t("common:entity_number", {
              entity: t("common:shaba")
            }),
            value: legal?.shabaNumber
          }
        },
        {
          item: {
            key: t("common:cellphone"),
            value: legal?.owner?.cellphone
          }
        },
        {
          item: {
            key: t("common:wallet"),
            value: legal?.wallet
              ? `${addCommas(legal?.wallet)} (${t("common:toman")})`
              : undefined
          }
        }
      ],
      card: {
        title: t("common:entity_info", { entity: t("common:company") }),
        button: {
          onClick: () => {
            const {
              name_company,
              national_id,
              accountNumber,
              shabaNumber,
              owner,
              wallet,
              status,
              id
            } = legal
            onChangeModals({
              type: LegalModalEnum.INFO,
              data: {
                name_company,
                national_id,
                accountNumber,
                shabaNumber,
                cellphone: owner?.cellphone,
                wallet,
                status,
                id
              }
            })
          },
          disabled: loading,
          text: t("common:edit_entity", {
            entity: t("common:entity_info", { entity: t("common:company") })
          }),
          type: "button"
        }
      }
    }),
    [legal]
  )

  return (
    <>
      <LegalModal
        modals={modals}
        open={modals?.type === LegalModalEnum.INFO}
        onCloseModals={onCloseModals}
      />
      <DetailsCard {...detailsCardProps} />
    </>
  )
}

export default LegalInfo
