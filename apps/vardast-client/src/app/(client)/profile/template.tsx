import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

export default async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    redirect("/auth/signin")
  }

  return <>{children}</>
}
