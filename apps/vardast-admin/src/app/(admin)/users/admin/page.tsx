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
      title={(await generateMetadata()).title?.toString() as string}
      roleIds={[2]}
    />
  )
}

export default UsersIndex
