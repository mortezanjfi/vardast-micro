import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { UserStatusesEnum } from "@vardast/graphql/generated"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { LucideInfo } from "lucide-react"
import { getServerSession } from "next-auth"

import AdminInsight from "@/app/(admin)/components/AdminInsight"

export const metadata: Metadata = {
  title: "وردست من"
}

const AdminIndex = async () => {
  const session = await getServerSession(authOptions)

  if (
    !session?.accessToken ||
    (session?.accessToken &&
      !session?.profile?.roles.some((role) => role?.name === "admin"))
  ) {
    redirect("/auth/signin")
  }

  return (
    <div>
      <AdminInsight />
      {session?.profile?.status === UserStatusesEnum.NotActivated && (
        <Alert variant="danger">
          <LucideInfo />
          <AlertTitle>اطلاعیه</AlertTitle>
          <AlertDescription>
            <div className="flex flex-col items-start gap-2">
              <p>حساب کاربری شما فعال نیست.</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default AdminIndex
