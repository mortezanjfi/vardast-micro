"use client"

import { useMemo } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { User } from "@vardast/graphql/generated"
import { UserLanguagesEnumFa, UserStatusesEnumFa } from "@vardast/lib/constants"
import { Badge } from "@vardast/ui/badge"
import { UseModalsReturn } from "@vardast/ui/modal"
import useTranslation from "next-translate/useTranslation"

import DetailsCard from "../../desktop/DetailsCard"
import { RealModalEnum } from "../../type"
import { DetailsCardPropsType } from "../../types/type"
import UserModal from "./UserModal"

type UserInfoProps = {
  user: User
  loading?: boolean
  modal: UseModalsReturn<RealModalEnum>
}

const isAdmin = process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "admin"

const UserInfo = ({ user, loading, modal }: UserInfoProps) => {
  const { t } = useTranslation()
  const [modals, onChangeModals, onCloseModals] = modal

  const items = useMemo(() => {
    let result: DetailsCardPropsType["items"] = [
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
          key: t("common:cellphone"),
          value: digitsEnToFa(user?.cellphone || "-")
        }
      },
      {
        item: {
          key: t("common:entity_code", { entity: t("common:national") }),
          value: digitsEnToFa(user?.nationalCode || "-")
        }
      },
      {
        item: {
          key: t("common:date_entity", { entity: t("common:birth") }),
          value: user?.birth
            ? digitsEnToFa(
                new Date(user?.birth).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "numeric",
                  minute: "numeric"
                })
              )
            : "-"
        }
      },
      {
        item: {
          key: t("common:email"),
          value: user?.email
        }
      }
    ]

    if (isAdmin) {
      result.push({
        item: {
          key: t("common:language"),
          value: UserLanguagesEnumFa[user?.language]?.name_fa
        }
      })
      result.push({
        item: {
          key: t("common:roles"),
          value: user?.roles.map((role) => (
            <Badge variant="secondary" className="mx-2">
              {role.displayName}
            </Badge>
          ))
        },
        className: "col-span-full"
      })
    }

    return result
  }, [user, isAdmin])

  const detailsCardProps: DetailsCardPropsType = useMemo(
    () => ({
      badges: isAdmin
        ? [
            {
              children: UserStatusesEnumFa[user?.status]?.name_fa,
              variant: UserStatusesEnumFa[user?.status]?.variant
            },
            {
              variant: "primary",
              children: user?.displayRole?.displayName
            }
          ]
        : undefined,
      items,
      card: {
        title: t("common:info"),
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
              id,
              roles,
              birth
            } = user
            let data = {
              email,
              firstName,
              lastName,
              id,
              cellphone,
              nationalCode,
              birth
            }
            onChangeModals({
              type: RealModalEnum.INFO,
              data: isAdmin
                ? {
                    ...data,
                    mustChangePassword,
                    language,
                    status,
                    displayRoleId: `${displayRole?.id}`,
                    roleIds: roles.map((role) => role.id)
                  }
                : data
            })
          },
          disabled: loading,
          text: t("common:edit"),
          type: "button"
        }
      }
    }),
    [user, isAdmin]
  )

  return (
    <>
      <DetailsCard {...detailsCardProps} />
      <UserModal
        onCloseModals={onCloseModals}
        modals={modals}
        open={modals?.type === RealModalEnum.INFO}
      />
    </>
  )
}

export default UserInfo
