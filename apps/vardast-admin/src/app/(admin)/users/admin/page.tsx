import { Metadata } from "next"

import UsersPage from "@/app/(admin)/users/real/components/UsersPage"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "کاربران ادمین"
  }
}

const UsersIndex = async () => {
  return (
    <UsersPage
      roleIds={[2]}
      title={(await generateMetadata()).title?.toString()}
    />
  )
}

export default UsersIndex
