"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { useGetAllLegalUsersQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import useTranslation from "next-translate/useTranslation"

import CardContainer from "../desktop/CardContainer"
import Pagination from "../Pagination"
import AddLegalUserModal from "./AddLegalUserModal"

type Props = {}

export default (props: Props) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const router = useRouter()
  const onCreateUser = () => {
    setOpen(true)
  }

  const getAllLegalUsers = useGetAllLegalUsersQuery(
    graphqlRequestClientWithToken,
    {
      indexLegalInput: {
        page: 1
      }
    },
    {
      queryKey: [{ page: currentPage }]
    }
  )

  return (
    <>
      <AddLegalUserModal open={open} setOpen={setOpen} />
      <CardContainer
        button={{
          text: "افزودن کاربر",
          variant: "primary",
          onClick: onCreateUser
        }}
        title="لیست‌ کاربران"
      >
        <table className="table-hover table">
          <thead>
            <tr>
              <th>{t("common:row")}</th>
              <th>
                {t("common:entity_name", { entity: t("common:company") })}
              </th>
              <th>
                {t("common:entity_uuid", { entity: t("common:national") })}
              </th>
              <th>
                {t("common:entity_name", { entity: t("common:manager") })}
              </th>
              <th>{t("common:entity_count", { entity: t("common:order") })}</th>
              <th>{t("common:status")}</th>
              <th>{t("common:operation")}</th>
            </tr>
          </thead>

          <tbody className="border-collapse border">
            {getAllLegalUsers?.data?.findAllLegals?.data?.map(
              (user, index) =>
                user && (
                  <tr key={user?.id}>
                    <td className="w-4">
                      <span>{digitsEnToFa(index + 1)}</span>
                    </td>
                    <td>{user?.name_company}</td>
                    <td>{user?.national_id}</td>
                    <td>{user?.createdBy?.fullName}</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
        <Pagination
          total={getAllLegalUsers?.data?.findAllLegals?.lastPage ?? 0}
          page={currentPage}
          onChange={(page) => {
            setCurrentPage(page)
          }}
        />
      </CardContainer>
    </>
  )
}
