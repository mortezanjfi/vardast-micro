"use client"

import PageTitle from "@vardast/component/project/PageTitle"
import { UserType } from "@vardast/graphql/generated"
import { useSession } from "next-auth/react"

import UpdateInfoItem from "@/app/(client)/profile/info/components/UpdateInfoItem"

type InfoPageProps = {
  isMobileView: boolean
  title: string
}

const InfoPage = ({ isMobileView, title }: InfoPageProps) => {
  const { data: session } = useSession()

  return (
    <div className="flex h-full w-full flex-col gap md:gap-9">
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
