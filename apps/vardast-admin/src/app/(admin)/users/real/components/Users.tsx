"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { UseQueryResult } from "@tanstack/react-query"
import Card from "@vardast/component/Card"
import Link from "@vardast/component/Link"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import PageHeader from "@vardast/component/PageHeader"
import Pagination from "@vardast/component/table/Pagination"
import {
  useGetAllUsersQuery,
  UserStatusesEnum
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { ApiCallStatusEnum } from "@vardast/type/Enums"
import { Avatar, AvatarFallback, AvatarImage } from "@vardast/ui/avatar"
import { Button } from "@vardast/ui/button"
import convertToPersianDate from "@vardast/util/convertToPersianDate"
import clsx from "clsx"
import parsePhoneNumber from "libphonenumber-js"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { UsersFilter } from "@/app/(admin)/users/real/components/UsersFilter"

const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NoResult entity="brand" />,
  [ApiCallStatusEnum.DEFAULT]: null
}

const getContentByApiStatus = (
  apiQuery: UseQueryResult<any, unknown>,
  queryLength: boolean
) => {
  if (apiQuery.isLoading) {
    return ApiCallStatusEnum.LOADING
  }
  if (apiQuery.isError) {
    return ApiCallStatusEnum.ERROR
  }
  if (!queryLength || !apiQuery.data) {
    return ApiCallStatusEnum.EMPTY
  }
  return ApiCallStatusEnum.DEFAULT
}

const filterSchema = z.object({ name: z.string() })

export type UsersFilterFields = TypeOf<typeof filterSchema>
type Props = {
  roleIds?: number[]
}

const Users = ({ roleIds }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: session } = useSession()
  const [currentPage, setCurrentPage] = useState<number>(1)

  const form = useForm<UsersFilterFields>({
    resolver: zodResolver(filterSchema)
  })

  const users = useGetAllUsersQuery(graphqlRequestClientWithToken, {
    indexUserInput: {
      page: currentPage,
      roleIds: roleIds ?? []
    }
  })
  const usersLength = useMemo(
    () => users.data?.users.data.length,
    [users.data?.users.data.length]
  )

  return (
    <>
      <UsersFilter form={form} />
      <Card className=" table-responsive mt-8 rounded">
        <PageHeader title={t("common:users_index_title")}>
          {session?.abilities.includes("gql.users.user.index") && (
            <Link href="/users/real/new">
              <Button size="medium">
                {t("common:add_entity", { entity: t("common:user") })}
              </Button>
            </Link>
          )}
        </PageHeader>
        {renderedListStatus[getContentByApiStatus(users, !!usersLength)] || (
          <>
            <table className="table-hover table">
              <thead>
                <tr>
                  <th></th>
                  <th>{t("common:email")}</th>
                  <th>{t("common:cellphone")}</th>
                  <th>{t("common:status")}</th>
                  <th>{t("common:wallet")} (تومان)</th>
                  <th>{t("common:last_login")}</th>
                </tr>
              </thead>
              <tbody>
                {users.data?.users.data.map(
                  (user) =>
                    user && (
                      <tr
                        key={user.uuid}
                        onClick={() => router.push(`/users/real/${user.uuid}`)}
                      >
                        <td>
                          <Avatar size="small">
                            {user.avatarFile && (
                              <AvatarImage
                                src={user.avatarFile.presignedUrl.url}
                                alt={user.fullName}
                              />
                            )}

                            <AvatarFallback>
                              {user.firstName && user.firstName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="ms-2 font-medium text-alpha-800">
                            {user.fullName}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            {user.email ? (
                              <>
                                <span
                                  className={clsx(
                                    "block h-2 w-2 rounded-full ring-2",
                                    user.isEmailVerified
                                      ? "bg-emerald-400 ring-emerald-50"
                                      : "bg-red-400 ring-red-50"
                                  )}
                                ></span>
                                <span className="font-mono" dir="ltr">
                                  {user.email}
                                </span>
                              </>
                            ) : (
                              "--"
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            {user.cellphone ? (
                              <>
                                <span
                                  className={clsx(
                                    "block h-2 w-2 rounded-full ring-2",
                                    user.isCellphoneVerified
                                      ? "bg-emerald-400 ring-emerald-50"
                                      : "bg-red-400 ring-red-50"
                                  )}
                                ></span>
                                <span className="font-mono" dir="ltr">
                                  {parsePhoneNumber(
                                    `+${user.country.phonePrefix}${user.cellphone}`
                                  )?.formatInternational()}
                                </span>
                              </>
                            ) : (
                              "--"
                            )}
                          </div>
                        </td>
                        <td>
                          {user.status === UserStatusesEnum.Active && (
                            <span className="tag tag-light tag-sm tag-success">
                              {t("common:active")}
                            </span>
                          )}
                          {user.status === UserStatusesEnum.Banned && (
                            <span className="tag tag-light tag-sm tag-danger">
                              {t("common:banned")}
                            </span>
                          )}
                          {user.status === UserStatusesEnum.NotActivated && (
                            <span className="tag tag-light tag-sm tag-gray">
                              {t("common:not_active")}
                            </span>
                          )}
                        </td>
                        <td>{digitsEnToFa(addCommas(user?.wallet))}</td>
                        <td>
                          {user.lastLoginAt ? (
                            <span className="ms-2 font-medium text-alpha-800">
                              {digitsEnToFa(
                                convertToPersianDate({
                                  dateString: user.lastLoginAt,
                                  withHour: true,
                                  withMinutes: true
                                })
                              )}
                            </span>
                          ) : (
                            "--"
                          )}
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>

            <Pagination
              total={users.data?.users.lastPage ?? 0}
              page={currentPage}
              onChange={(page) => {
                setCurrentPage(page)
              }}
            />
          </>
        )}
      </Card>
    </>
  )
}

export default Users
