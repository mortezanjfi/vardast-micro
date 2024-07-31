"use client"

import PageTitle from "@vardast/component/page-title"
import { useRefreshUserMutation, UserType } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { ToggleGroup, ToggleGroupItem } from "@vardast/ui/toggle-group"
import { clsx } from "clsx"
import { useSession } from "next-auth/react"

import UpdateInfoItem from "@/app/(client)/profile/info/components/UpdateInfoItem"

type InfoPageProps = {
  isMobileView: boolean
  title: string
}

const InfoPage = ({ isMobileView, title }: InfoPageProps) => {
  const { data: session, update, status } = useSession()

  const refreshUserMutation = useRefreshUserMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: async (data) => {
        await update({ ...session, ...data.refresh })
      }
    }
  )

  return (
    <div className="flex h-full w-full flex-col gap md:gap-9">
      <div className="pt md:ml-auto md:pt-0">
        <ToggleGroup
          className="flex gap-6"
          type="single"
          value={session?.type}
          onValueChange={(value: UserType) => {
            value &&
              value !== session?.type &&
              refreshUserMutation.mutate({
                refreshInput: {
                  accessToken: session?.accessToken,
                  refreshToken: session?.refreshToken,
                  type: value
                }
              })
          }}
          defaultValue={UserType.Real}
        >
          <ToggleGroupItem
            disabled={status === "loading" || refreshUserMutation.isLoading}
            className={clsx(
              "py-1 text-alpha-500",
              session?.type === UserType.Real && "!bg-primary !text-alpha-white"
            )}
            value={UserType.Real}
          >
            حقیقی
          </ToggleGroupItem>
          <ToggleGroupItem
            disabled={status === "loading" || refreshUserMutation.isLoading}
            className={clsx(
              "py-1 text-alpha-500",
              session?.type === UserType.Legal &&
                "!bg-primary !text-alpha-white"
            )}
            value={UserType.Legal}
          >
            حقوقی
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {!isMobileView && <PageTitle title={title} />}
      <div className=" w-full gap-x  border-alpha-200 bg-alpha-white text-alpha-500 md:grid md:grid-cols-2">
        {session?.type === UserType.Real && (
          <>
            <UpdateInfoItem
              title="نام"
              name="firstName"
              value={session?.profile?.firstName || ""}
            />
            <UpdateInfoItem
              title="نام خانوادگی"
              name="lastName"
              value={session?.profile?.lastName || ""}
            />
          </>
        )}
        {session?.type === UserType.Legal && (
          <>
            <UpdateInfoItem
              title="شناسه ملی"
              name="national_id"
              value={session?.profile?.legal?.national_id || ""}
            />
            <UpdateInfoItem
              title="نام شرکت"
              name="name_company"
              value={session?.profile?.legal?.name_company || ""}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default InfoPage
