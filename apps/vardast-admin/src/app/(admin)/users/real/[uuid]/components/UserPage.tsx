"use client"

import { useMemo } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import DetailsCard from "@vardast/component/desktop/DetailsCard"
import { RealModalEnum } from "@vardast/component/type"
import { DetailsCardPropsType } from "@vardast/component/types/type"
import { useGetUserQuery } from "@vardast/graphql/generated"
import { UserLanguagesEnumFa, UserStatusesEnumFa } from "@vardast/lib/constants"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { useModals } from "@vardast/ui/modal"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"

import UserModal from "@/app/(admin)/users/real/[uuid]/components/UserModal"

type Props = {
  uuid: string
}

const UserPage = ({ uuid }: Props) => {
  const { t } = useTranslation()
  const [modals, onChangeModals, onCloseModals] = useModals<RealModalEnum>()

  const getUserQuery = useGetUserQuery(graphqlRequestClientWithToken, {
    uuid
  })

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  const user = useMemo(() => getUserQuery.data?.user, [getUserQuery])

  // const tableProps: ITableProps<Session> = useTable({
  //   model: {
  //     name: "sessions",
  //     container: {
  //       title: t("common:sessions")
  //     },
  //     fetch: {
  //       directData: {
  //         data: user?.sessions,
  //         directLoading: getUserQuery.isLoading || getUserQuery.isFetching
  //       },
  //       options: {
  //         refetchOnMount: true
  //       }
  //     },
  //     columns: [
  //       {
  //         header: t("common:last_activity"),
  //         id: "lastActivityAt",
  //         accessorFn: ({ lastActivityAt }) =>
  //           digitsEnToFa(
  //             formatDistanceToNow(new Date(lastActivityAt).getTime(), {
  //               addSuffix: true
  //             })
  //           )
  //       },
  //       { header: t("common:agent"), accessorKey: "agent" }
  //     ]
  //   }
  // })

  const detailsCardProps: DetailsCardPropsType = useMemo(
    () => ({
      badges: [
        {
          children: UserStatusesEnumFa[user?.status]?.name_fa,
          variant: UserStatusesEnumFa[user?.status]?.variant
        }
      ],
      items: [
        {
          item: {
            key: t("common:name_company"),
            value: digitsEnToFa(user?.cellphone || "-")
          }
        },
        {
          item: {
            key: t("common:email"),
            value: user?.email
          }
        },
        {
          item: {
            key: t("common:role"),
            value: user?.displayRole?.displayName
          }
        },
        {
          item: {
            key: t("common:firstName"),
            value: user?.firstName
          }
        },
        {
          item: {
            key: t("common:lastName"),
            value: user?.lastName
          }
        },
        {
          item: {
            key: t("common:language"),
            value: UserLanguagesEnumFa[user?.language]?.name_fa
          }
        }
      ],
      card: {
        title: t("common:entity_info", { entity: t("common:company") }),
        button: {
          onClick: () => {
            const {
              cellphone,
              email,
              displayRole,
              firstName,
              language,
              lastName,
              mustChangePassword,
              nationalCode,
              status,
              id
            } = user
            onChangeModals({
              type: RealModalEnum.INFO,
              data: {
                cellphone,
                displayRole,
                email,
                firstName,
                language,
                lastName,
                mustChangePassword,
                nationalCode,
                status,
                id
              }
            })
          },
          disabled: getUserQuery.isLoading || getUserQuery.isFetching,
          text: t("common:edit_entity", {
            entity: t("common:entity_info", { entity: t("common:user") })
          }),
          type: "button"
        }
      }
    }),
    [getUserQuery.data]
  )

  return (
    <>
      <UserModal
        onCloseModals={(data) => {
          if (data) {
            getUserQuery.refetch()
          }
          onCloseModals()
        }}
        onChangeModals={onChangeModals}
        modals={modals}
        open={modals?.type === RealModalEnum.INFO}
      />
      <DetailsCard {...detailsCardProps} />
      {/* <Table {...tableProps} /> */}
    </>
  )
}

export default UserPage
