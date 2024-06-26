"use client"

import { useState } from "react"
import useTranslation from "next-translate/useTranslation"

import CardContainer from "../../desktop/CardContainer"
import Link from "../../Link"
import {
  SELECTED_ITEM,
  SELECTED_ITEM_TYPE
} from "../../project/user/ProjectUsersTab"
import { UserModal } from "../../project/user/UserModal"

type Props = { readOnlyMode?: boolean; uuid: string; isMobileView?: boolean }

function UsersDetail({ readOnlyMode, isMobileView, uuid }: Props) {
  const { t } = useTranslation()
  const [selectedUsers, setSelectedUsers] = useState<SELECTED_ITEM>()
  const onOpenModal = (selectedUsers: SELECTED_ITEM) => {
    setSelectedUsers(selectedUsers)
  }
  const onCloseModal = () => {
    setSelectedUsers(undefined)
  }
  return (
    <>
      {!readOnlyMode && (
        <UserModal
          isMobileView={isMobileView}
          uuid={uuid}
          onCloseModal={onCloseModal}
          selectedUsers={selectedUsers}
        />
      )}
      <CardContainer
        button={
          !readOnlyMode && {
            text: "افزودن همکار",
            variant: "primary",
            onClick: () =>
              onOpenModal({
                type: SELECTED_ITEM_TYPE.ADD,
                data: undefined
              })
          }
        }
        title={readOnlyMode ? "همکاران" : "اطلاعات خواسته شده را وارد نمایید"}
        titleClass={!readOnlyMode && "!border-0 font-normal"}
      >
        <table className="table-hover table">
          <thead>
            <tr>
              <th>{t("common:row")}</th>
              <th>
                {t("common:entity_name", { entity: t("common:colleague") })}
              </th>
              <th>{t("common:cellphone")}</th>
              <th>{t("common:colleague-role")}</th>
              <th>{t("common:status")}</th>
              {!readOnlyMode && <th>{t("common:operation")}</th>}
            </tr>
          </thead>

          <tbody className="border-collapse border">
            <tr>
              <td className="w-4">
                <span></span>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              {!readOnlyMode && <td></td>}
            </tr>
          </tbody>
        </table>
      </CardContainer>
      {!readOnlyMode && (
        <div className=" mt-7 flex w-full flex-row-reverse gap border-t pt-6 ">
          <Link
            className="btn btn-md btn-primary"
            href={`/users/legal/${uuid}/submission`}
          >
            تایید و ادامه
          </Link>
          <Link className="btn btn-md btn-secondary" href={"/users/legal"}>
            بازگشت به کاربران
          </Link>
        </div>
      )}
    </>
  )
}

export default UsersDetail
