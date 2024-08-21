"use client"

import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import UserModal from "@vardast/component/admin/user/UserModal"
import {
  FilterComponentTypeEnum,
  ITableProps,
  Table,
  useTable
} from "@vardast/component/table"
import { RealModalEnum } from "@vardast/component/type"
import {
  IndexUserInputSchema,
  User,
  UserStatusesEnum
} from "@vardast/graphql/generated"
import { UserStatusesEnumFa } from "@vardast/lib/constants"
import { getAllUsersQueryFn } from "@vardast/query/queryFns/user/getAllUsersQueryFn"
import { Badge } from "@vardast/ui/badge"
import { useModals } from "@vardast/ui/modal"
import { newTimeConvertor } from "@vardast/util/convertToPersianDate"
import { getEnumValues } from "@vardast/util/getEnumValues"
import useTranslation from "next-translate/useTranslation"

const UserInputSchema = IndexUserInputSchema()
  .omit({
    page: true,
    perPage: true,
    displayRoleId: true
  })
  .optional()

type Props = {
  title?: string
  roleIds?: number[]
}

const UsersPage = ({ title, roleIds }: Props) => {
  const { t } = useTranslation()
  const [modals, onChangeModals, onCloseModals] = useModals<RealModalEnum>()

  const tableProps: ITableProps<User, typeof UserInputSchema> = useTable({
    model: {
      name: `users-${roleIds}`,
      paginable: true,
      container: {
        button: {
          onClick: () =>
            onChangeModals({
              type: RealModalEnum.INFO
            }),
          text: t("common:add_entity", { entity: t("common:user") }),
          variant: "primary"
        },
        title
      },
      filters: {
        schema: UserInputSchema,
        options: [
          {
            type: FilterComponentTypeEnum.INPUT,
            name: "cellphone",
            title: t("common:cellphone"),
            inputType: "number"
          },
          {
            type: FilterComponentTypeEnum.INPUT,
            name: "nationalCode",
            title: t("common:entity_code", { entity: t("common:national") })
          },
          {
            type: FilterComponentTypeEnum.INPUT,
            name: "email",
            title: t("common:email")
          },
          {
            type: FilterComponentTypeEnum.SELECT,
            name: "status",
            title: t("common:status"),
            options: getEnumValues(UserStatusesEnum).map((item) => ({
              key: UserStatusesEnumFa[item]?.name_fa,
              value: item.toUpperCase()
            }))
          }
        ]
      },
      onRow: {
        url: (row) => `/users/real/${row?.original?.uuid}`
      },
      fetch: {
        api: getAllUsersQueryFn(roleIds),
        options: {
          refetchOnMount: true
        }
      },
      columns: [
        { header: t("common:fullName"), accessorKey: "fullName" },
        {
          header: t("common:cellphone"),
          id: "cellphone",
          accessorFn: ({ cellphone }) => digitsEnToFa(cellphone || "-")
        },
        {
          header: t("common:entity_code", { entity: t("common:national") }),
          id: "entity_code",
          accessorFn: ({ nationalCode }) => digitsEnToFa(nationalCode || "-")
        },
        {
          header: t("common:email"),
          id: "email",
          accessorFn: ({ email }) => email || "-"
        },
        {
          header: t("common:status"),
          id: "status",
          cell: ({ row }) => (
            <Badge variant={UserStatusesEnumFa[row?.original?.status]?.variant}>
              {UserStatusesEnumFa[row?.original?.status]?.name_fa}
            </Badge>
          )
        },
        {
          id: "wallet",
          header: `${t("common:wallet")} (تومان)`,
          accessorFn: (row) => digitsEnToFa(addCommas(row?.wallet) || "0")
        },
        {
          header: t("common:last_login"),
          id: "lastLoginAt",
          accessorFn: ({ lastLoginAt }) => newTimeConvertor(lastLoginAt) || "-"
        }
      ]
    }
  })

  return (
    <>
      <UserModal
        onCloseModals={onCloseModals}
        onChangeModals={onChangeModals}
        modals={modals}
        open={modals?.type === RealModalEnum.INFO}
      />
      <Table {...tableProps} />
    </>
  )
}

export default UsersPage
