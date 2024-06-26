"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { Legal, useGetAllLegalUsersQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import useTranslation from "next-translate/useTranslation"

import CardContainer from "../desktop/CardContainer"
import Link from "../Link"
import Pagination from "../Pagination"
import AddLegalUserModal from "./AddLegalUserModal"
import LegalDeleteModal from "./LegalDeleteModal"

type Props = { title: string }

const thClass = "border"

export default ({ title }: Props) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [deletModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [legalToDelete, setLegalToDelete] = useState<Legal>()
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
      <LegalDeleteModal
        open={deletModalOpen}
        onOpenChange={setDeleteModalOpen}
        legalToDelete={legalToDelete}
      />
      <AddLegalUserModal open={open} setOpen={setOpen} />
      <CardContainer
        button={{
          text: "افزودن کاربر",
          variant: "primary",
          onClick: onCreateUser
        }}
        title={title}
      >
        <table className="table-hover table">
          <thead>
            <tr>
              <th className={thClass}>{t("common:row")}</th>
              <th className={thClass}>
                {t("common:entity_name", { entity: t("common:company") })}
              </th>
              <th className={thClass}>
                {t("common:entity_uuid", { entity: t("common:national") })}
              </th>
              <th className={thClass}>{t("common:creator")}</th>
              <th className={thClass}>
                {t("common:entity_name", { entity: t("common:manager") })}
              </th>

              <th className={thClass}>{t("common:wallet")} (تومان)</th>
              <th className={thClass}>
                {t("common:entity_count", { entity: t("common:order") })}
              </th>
              <th className={thClass}>{t("common:status")}</th>
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
                    <td className="border">{user?.name_company}</td>
                    <td className="border">{user?.national_id}</td>
                    <td className="border">{user?.createdBy?.fullName}</td>
                    <td className="border">{user?.owner?.fullName}</td>
                    <td className="border">
                      {digitsEnToFa(addCommas(user?.wallet))}
                    </td>
                    <td className="border">--</td>
                    <td className="border">--</td>
                    <td className="border">
                      <Link href={`/users/legal/${user?.id}/?tab=addresses`}>
                        <span className="tag cursor-pointer text-blue-500">
                          {t("common:edit")}
                        </span>
                      </Link>
                      /
                      <span
                        className="tag cursor-pointer text-error"
                        onClick={(e) => {
                          e.stopPropagation()
                          setLegalToDelete(user as Legal)
                          setDeleteModalOpen(true)
                        }}
                      >
                        {t("common:delete")}
                      </span>
                    </td>
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
