"use client"

import { useMemo } from "react"
import LegalInfo from "@vardast/component/admin/legal/LegalInfo"
import UserInfo from "@vardast/component/admin/user/UserInfo"
import { LegalModalEnum, RealModalEnum } from "@vardast/component/type"
import {
  Legal,
  useGetOneLegalQuery,
  UserType
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { useModals } from "@vardast/ui/modal"
import { useSession } from "next-auth/react"

type InfoPageProps = {
  isMobileView: boolean
  title: string
}

const InfoPage = (_: InfoPageProps) => {
  const [modalsReal, onChangeModalsReal, onCloseModalsReal] =
    useModals<RealModalEnum>()
  const [modalsLegal, onChangeModalsLegal, onCloseModalsLegal] =
    useModals<LegalModalEnum>()

  const { data: session, status, update } = useSession()

  const getOneLegalQuery = useGetOneLegalQuery(
    graphqlRequestClientWithToken,
    {
      id: +session?.profile?.legal?.id
    },
    { enabled: !!session }
  )

  const isLegal = useMemo(() => session?.type, [session, getOneLegalQuery])

  return (
    <>
      {isLegal === UserType.Legal ? (
        <LegalInfo
          modal={[
            modalsLegal,
            onChangeModalsLegal,
            () => {
              onCloseModalsLegal()
              update()
            }
          ]}
          legal={getOneLegalQuery.data?.findOneLegal as Legal}
          loading={
            status === "loading" ||
            status === "unauthenticated" ||
            getOneLegalQuery.isLoading
          }
        />
      ) : (
        <UserInfo
          modal={[
            modalsReal,
            onChangeModalsReal,
            () => {
              onCloseModalsReal()
              update()
            }
          ]}
          user={session?.profile}
          loading={status === "loading" || status === "unauthenticated"}
        />
      )}
    </>
  )
}

export default InfoPage
