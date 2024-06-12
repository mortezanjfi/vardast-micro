"use client"

import { useRouter } from "next/navigation"
import useTranslation from "next-translate/useTranslation"

import CardContainer from "../../src/desktop/CardContainer"

type Props = {}

const PurchasersPage = (props: Props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const onCreateUser = () => {
    router.push(`/users/purchasers/2/info`)
  }

  return (
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
            <th>{t("common:entity_name", { entity: t("common:company") })}</th>
            <th>{t("common:entity_uuid", { entity: t("common:national") })}</th>
            <th>{t("common:entity_name", { entity: t("common:manager") })}</th>
            <th>{t("common:entity_count", { entity: t("common:order") })}</th>
            <th>{t("common:status")}</th>
            <th>{t("common:operation")}</th>
          </tr>
        </thead>
        {/* 
    <tbody className="border-collapse border">
      {preOrdersQuery?.data?.preOrders?.data.map(
        (preOrder, index) =>
          preOrder && (
            <tr key={preOrder?.id}>
              <td className="w-4">
                <span>{digitsEnToFa(index + 1)}</span>
              </td>
              <td>{preOrder?.id}</td>
              <td>{preOrder?.user?.fullName}</td>
              <td>{preOrder?.project?.name}</td>
              <td>
                {digitsEnToFa(
                  new Date(preOrder?.request_date).toLocaleDateString(
                    "fa-IR",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit"
                    }
                  )
                )}
              </td>
              <td>
                {digitsEnToFa(
                  new Date(preOrder?.expire_time).toLocaleDateString(
                    "fa-IR",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit"
                    }
                  )
                )}
              </td>
              <td>
                {" "}
                {preOrder?.files.length > 0 ? (
                  <span className="tag  tag-sm tag-success">
                    {t("common:has")}
                  </span>
                ) : (
                  <span className="tag tag-sm tag-danger">
                    {t("common:has_not")}
                  </span>
                )}
              </td>
              <td>--</td>
              <td>--</td>
              <td>
                <Link
                  target="_blank"
                  href={`/profile/orders/${preOrder?.id}`}
                >
                  <span className="tag cursor-pointer text-blue-500">
                    {" "}
                    {t("common:edit")}
                  </span>
                </Link>
                /
                <Link
                  target="_blank"
                  href={`/profile/orders/${preOrder?.id}/offers`}
                >
                  <span className="tag cursor-pointer text-error">
                    {t("common:offers")}
                  </span>
                </Link>
              </td>
            </tr>
          )
      )}
    </tbody> */}
      </table>
      {/* <Pagination
        total={preOrdersQuery.data.preOrders.lastPage ?? 0}
        page={currentPage}
        onChange={(page) => {
          setCurrentPage(page)
        }}
      /> */}
    </CardContainer>
  )
}

export default PurchasersPage
