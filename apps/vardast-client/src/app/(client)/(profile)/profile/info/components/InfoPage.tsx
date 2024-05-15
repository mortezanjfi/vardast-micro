"use client"

import PageTitle from "@/app/(client)/(profile)/components/PageTitle"
import FamilyNameSection from "@/app/(client)/(profile)/profile/info/components/FamilyNameSection"
import MobileNumberSection from "@/app/(client)/(profile)/profile/info/components/MobileNumberSection"
import NameSection from "@/app/(client)/(profile)/profile/info/components/NameSection"

type InfoPageProps = { title: string }

const InfoPage = ({ title }: InfoPageProps) => {
  return (
    <div className="flex h-full w-full flex-col gap-9">
      {/* dialog for changing name */}
      <PageTitle title={title} />
      <div className="w-full divide-alpha-200 border-b border-alpha-200 bg-alpha-white text-alpha-500 md:grid md:grid-cols-2 md:grid-rows-2">
        <NameSection />
        <FamilyNameSection />
        <MobileNumberSection />
        <div className="flex h-28 items-center justify-between"></div>
      </div>
    </div>
  )
}

export default InfoPage
