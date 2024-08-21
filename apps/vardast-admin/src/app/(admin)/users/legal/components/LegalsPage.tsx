"use client"

import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import LegalModal from "@vardast/component/src/admin/legal/LegalModal"
import { ITableProps, Table, useTable } from "@vardast/component/table"
import { LegalModalEnum } from "@vardast/component/type"
import { Legal } from "@vardast/graphql/generated"
import { LegalStatusEnumFa } from "@vardast/lib/constants"
import { getAllLegalUsersQueryFn } from "@vardast/query/queryFns/getAllLegalUsersQueryFn"
import { Badge } from "@vardast/ui/badge"
import { Button } from "@vardast/ui/button"
import { useModals } from "@vardast/ui/modal"
import useTranslation from "next-translate/useTranslation"

import LegalDeleteModal from "@/app/(admin)/users/legal/[uuid]/components/LegalDeleteModal"

type Props = { title: string }

const LegalsPage = ({ title }: Props) => {
  const { t } = useTranslation()
  const [modals, onChangeModals, onCloseModals] = useModals<LegalModalEnum>()

  const tableProps: ITableProps<Legal> = useTable({
    model: {
      name: "legals",
      paginable: true,
      container: {
        button: {
          onClick: () =>
            onChangeModals({
              type: LegalModalEnum.ADD
            }),
          text: t("common:add_entity", { entity: t("common:user") }),
          variant: "primary"
        },
        title
      },
      onRow: {
        url: (row) => `/users/legal/${row?.original?.id}`
      },
      fetch: {
        api: getAllLegalUsersQueryFn,
        options: {
          refetchOnMount: true
        }
      },
      columns: [
        {
          header: t("common:entity_name", { entity: t("common:company") }),
          accessorKey: "name_company"
        },
        {
          header: t("common:entity_uuid", { entity: t("common:national") }),
          id: "national_id",
          accessorFn: ({ national_id }) => digitsEnToFa(national_id)
        },
        {
          id: "creator",
          header: t("common:creator"),
          accessorFn: (row) => row?.createdBy?.fullName
        },
        {
          id: "owner",
          header: t("common:entity_name", { entity: t("common:manager") }),
          accessorFn: (row) => row?.owner?.fullName
        },
        {
          id: "wallet",
          header: `${t("common:wallet")} (${t("common:toman")})`,
          accessorFn: (row) => digitsEnToFa(addCommas(row?.wallet))
        },
        {
          header: t("common:status"),
          id: "status",
          cell: ({ row }) => (
            <Badge variant={LegalStatusEnumFa[row?.original?.status]?.variant}>
              {LegalStatusEnumFa[row?.original?.status]?.name_fa}
            </Badge>
          )
        },
        {
          id: "action",
          header: t("common:operation"),
          cell: ({ row }) => {
            return (
              <Button
                variant="link"
                size="small"
                onClick={() => {
                  onChangeModals({
                    type: LegalModalEnum.DELETE,
                    data: row.original
                  })
                }}
              >
                {t("common:delete")}
              </Button>
            )
          }
        }
      ]
    }
  })

  return (
    <>
      <LegalDeleteModal
        onCloseModals={onCloseModals}
        onChangeModals={onChangeModals}
        modals={modals}
        open={modals?.type === LegalModalEnum.DELETE}
      />
      <LegalModal
        onCloseModals={onCloseModals}
        onChangeModals={onChangeModals}
        modals={modals}
        open={modals?.type === LegalModalEnum.ADD}
      />
      <Table {...tableProps} />
    </>
  )
}

export default LegalsPage
