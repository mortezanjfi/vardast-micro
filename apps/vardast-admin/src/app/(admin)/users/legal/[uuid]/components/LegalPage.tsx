"use client"

import { useCallback } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import AddressDeleteModal from "@vardast/component/admin/address/AddressDeleteModal"
import AddressModal from "@vardast/component/admin/address/AddressModal"
import ContactInfoDeleteModal from "@vardast/component/admin/contact/ContactInfoDeleteModal"
import ContactInfoModal from "@vardast/component/admin/contact/ContactInfoModal"
import LegalInfo from "@vardast/component/admin/legal/LegalInfo"
import { ITableProps, Table, useTable } from "@vardast/component/table"
import { LegalModalEnum } from "@vardast/component/type"
import {
  Address,
  AddressRelatedTypes,
  ContactInfo,
  ContactInfoRelatedTypes,
  Legal,
  Member,
  UpdateMemberInput,
  useGetOneLegalQuery
} from "@vardast/graphql/generated"
import {
  ContactInfoTypesFa,
  MemberRolesFa,
  ThreeStateSupervisionStatusesFa
} from "@vardast/lib/constants"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Badge } from "@vardast/ui/badge"
import { Button } from "@vardast/ui/button"
import { useModals } from "@vardast/ui/modal"
import { LucideCheck, LucideX } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import LegalMemberDeleteModal from "@/app/(admin)/users/legal/[uuid]/components/LegalMemberDeleteModal"
import LegalMemberModal from "@/app/(admin)/users/legal/[uuid]/components/LegalMemberModal"

type Props = { uuid: string }

function LegalPage({ uuid }: Props) {
  const [modals, onChangeModals, onCloseModals] = useModals<LegalModalEnum>()
  const { t } = useTranslation()
  const getOneLegalQuery = useGetOneLegalQuery(graphqlRequestClientWithToken, {
    id: +uuid
  })

  const addressTableProps: ITableProps<Address> = useTable({
    model: {
      name: "user-address",
      container: {
        button: {
          onClick: () =>
            onChangeModals<Pick<Address, "relatedId" | "relatedType">>({
              type: LegalModalEnum.ADDRESS,
              data: { relatedId: +uuid, relatedType: AddressRelatedTypes.Legal }
            }),
          text: t("common:add_new_entity", {
            entity: t("common:address")
          })
        },
        title: t(`common:addresses`)
      },
      onRow: {
        onClick: (row) => {
          onChangeModals({
            type: LegalModalEnum.ADDRESS,
            data: row.original
          })
        }
      },
      fetch: {
        directData: {
          data: getOneLegalQuery?.data?.findOneLegal?.addresses as Address[],
          directLoading:
            getOneLegalQuery.isLoading || getOneLegalQuery.isFetching
        }
      },
      columns: [
        { header: t("common:title"), accessorKey: "title" },
        {
          header: t("common:city"),
          id: "city",
          accessorFn: ({ province, city }) => `${province.name}, ${city.name}`
        },
        { header: t("common:address"), accessorKey: "address" },
        {
          header: t("common:postalCode"),
          id: "postalCode",
          accessorFn: ({ postalCode }) => digitsEnToFa(postalCode || "-")
        },
        {
          header: t("common:status"),
          id: "status",
          cell: ({ row }) => (
            <Badge
              variant={
                ThreeStateSupervisionStatusesFa[row?.original?.status]?.variant
              }
            >
              {ThreeStateSupervisionStatusesFa[row?.original?.status]?.name_fa}
            </Badge>
          )
        },
        {
          header: t("common:visibility"),
          id: "isPublic",
          cell: ({ row }) =>
            row?.original?.isPublic ? (
              <Badge variant="success">
                <LucideCheck className="icon" />
              </Badge>
            ) : (
              <Badge variant="danger">
                <LucideX className="icon" />
              </Badge>
            )
        },
        {
          id: "action",
          header: t("common:operation"),
          cell: ({ row }) => {
            return (
              <Button
                size="small"
                variant="link"
                onClick={() => {
                  onChangeModals({
                    type: LegalModalEnum.DELETE_ADDRESS,
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

  const memberTableProps: ITableProps<Member> = useTable({
    model: {
      name: "user-member",
      container: {
        button: {
          onClick: () =>
            onChangeModals<Pick<Member, "relatedId">>({
              type: LegalModalEnum.MEMBER,
              data: { relatedId: +uuid }
            }),
          text: t("common:add_new_entity", {
            entity: t("common:colleague")
          })
        },
        title: t(`common:colleagues`)
      },
      onRow: {
        onClick: (row) => {
          const { user, id, isActive, position, relatedId, role } = row.original
          onChangeModals<UpdateMemberInput>({
            type: LegalModalEnum.MEMBER,
            data: {
              id,
              cellphone: user?.cellphone,
              isActive,
              position,
              relatedId,
              role
            }
          })
        }
      },
      fetch: {
        directData: {
          data: getOneLegalQuery?.data?.findOneLegal?.members as Member[],
          directLoading:
            getOneLegalQuery.isLoading || getOneLegalQuery.isFetching
        }
      },
      columns: [
        {
          header: t("common:fullName"),
          id: "fullName",
          accessorFn: ({ user }) => digitsEnToFa(`${user?.fullName}` || "-")
        },
        {
          header: t("common:cellphone"),
          id: "cellphone",
          accessorFn: ({ user }) => digitsEnToFa(`${user?.cellphone}` || "-")
        },
        { header: t("common:position"), accessorKey: "position" },
        {
          header: t("common:role"),
          id: "role",
          cell: ({ row }) => (
            <Badge variant={MemberRolesFa[row?.original?.role]?.variant}>
              {MemberRolesFa[row?.original?.role]?.name_fa}
            </Badge>
          )
        },
        {
          header: t("common:status"),
          id: "isActive",
          cell: ({ row }) =>
            row?.original?.isActive ? (
              <Badge variant="success">{t("common:active")}</Badge>
            ) : (
              <Badge variant="danger">{t("common:inactive")}</Badge>
            )
        },
        {
          id: "action",
          header: t("common:operation"),
          cell: ({ row }) => {
            return (
              <Button
                size="small"
                variant="link"
                onClick={() => {
                  onChangeModals({
                    type: LegalModalEnum.DELETE_MEMBER,
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

  const contactTableProps: ITableProps<ContactInfo> = useTable({
    model: {
      name: "user-contact",
      container: {
        button: {
          onClick: () =>
            onChangeModals({
              type: LegalModalEnum.CONTACT,
              data: {
                relatedId: +uuid,
                relatedType: ContactInfoRelatedTypes.Legal
              }
            }),
          text: t("common:add_new_entity", {
            entity: t("common:cellphone")
          })
        },
        title: t("common:entity_info", {
          entity: t("common:call")
        })
      },
      onRow: {
        onClick: (row) => {
          onChangeModals({
            type: LegalModalEnum.CONTACT,
            data: row.original
          })
        }
      },
      fetch: {
        directData: {
          data: getOneLegalQuery?.data?.findOneLegal?.contacts as ContactInfo[],
          directLoading:
            getOneLegalQuery.isLoading || getOneLegalQuery.isFetching
        }
      },
      columns: [
        { header: t("common:title"), accessorKey: "title" },
        {
          header: t("common:type"),
          id: "type",
          cell: ({ row }) => (
            <Badge variant={ContactInfoTypesFa[row?.original?.type]?.variant}>
              {ContactInfoTypesFa[row?.original?.type]?.name_fa}
            </Badge>
          )
        },
        {
          header: t("common:number"),
          id: "number",
          accessorFn: ({ number }) => digitsEnToFa(`${number}` || "-")
        },
        {
          header: t("common:status"),
          id: "status",
          cell: ({ row }) => (
            <Badge
              variant={
                ThreeStateSupervisionStatusesFa[row?.original?.status]?.variant
              }
            >
              {ThreeStateSupervisionStatusesFa[row?.original?.status]?.name_fa}
            </Badge>
          )
        },
        {
          header: t("common:visibility"),
          id: "isPublic",
          cell: ({ row }) =>
            row?.original?.isPublic ? (
              <Badge variant="success">
                <LucideCheck className="icon" />
              </Badge>
            ) : (
              <Badge variant="danger">
                <LucideX className="icon" />
              </Badge>
            )
        },
        {
          id: "action",
          header: t("common:operation"),
          cell: ({ row }) => {
            return (
              <Button
                size="small"
                variant="link"
                onClick={() => {
                  onChangeModals({
                    type: LegalModalEnum.DELETE_CONTACT,
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

  const modalProps = useCallback(
    (type: LegalModalEnum) => ({
      onCloseModals: <T,>(data: T) => {
        if (data) {
          getOneLegalQuery.refetch()
        }
        onCloseModals()
      },
      onChangeModals,
      modals,
      open: modals?.type === type
    }),
    [getOneLegalQuery.data, modals]
  )

  return (
    <>
      <LegalInfo
        legal={getOneLegalQuery?.data?.findOneLegal as Legal}
        loading={getOneLegalQuery.isLoading}
        modal={[
          modals,
          onChangeModals,
          () => {
            onCloseModals()
            getOneLegalQuery.refetch()
          }
        ]}
      />
      <LegalMemberModal {...modalProps(LegalModalEnum.MEMBER)} />
      <ContactInfoModal {...modalProps(LegalModalEnum.CONTACT)} />
      <ContactInfoDeleteModal {...modalProps(LegalModalEnum.DELETE_CONTACT)} />
      <LegalMemberDeleteModal {...modalProps(LegalModalEnum.DELETE_MEMBER)} />
      <AddressModal {...modalProps(LegalModalEnum.ADDRESS)} />
      <AddressDeleteModal {...modalProps(LegalModalEnum.DELETE_ADDRESS)} />
      <Table {...memberTableProps} />
      <Table {...addressTableProps} />
      <Table {...contactTableProps} />
    </>
  )
}

export default LegalPage
