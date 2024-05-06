import type { Metadata } from "next"
import { authOptions } from "@vardast/auth/authOptions"
import {
  ThreeStateSupervisionStatuses,
  UserStatusesEnum
} from "@vardast/graphql/generated"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { LucideInfo } from "lucide-react"
import { getServerSession } from "next-auth"

import AdminInsight from "@/app/(admin)/components/AdminInsight"
import PastDurationEventsChart from "@/app/(admin)/components/PastDurationEventsChart"

export const metadata: Metadata = {
  title: "وردست من"
}

const AdminIndex = async () => {
  const session = await getServerSession(authOptions)

  return (
    <div>
      {session?.profile?.roles.some((role) => role?.name === "admin") && (
        <AdminInsight />
      )}

      {/* {!session?.profile?.seller &&
        session?.profile?.status === UserStatusesEnum.Active &&
        !session?.profile?.roles.some(
          (role) => role?.name === "admin" || role?.name === "seller"
        ) && <BecomeSellerAlert />} */}

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

      {session?.profile?.seller &&
        session?.profile?.seller.status ===
          ThreeStateSupervisionStatuses.Pending && (
          <Alert variant="warning">
            <LucideInfo />
            <AlertTitle>اطلاعیه</AlertTitle>
            <AlertDescription>
              <div className="flex flex-col items-start gap-2">
                <p>درخواست تبدیل حساب کاربری شما به فروشنده در حال بررسی است</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

      {session?.profile?.seller &&
        session?.profile?.seller.status ===
          ThreeStateSupervisionStatuses.Rejected && (
          <Alert variant="danger">
            <LucideInfo />
            <AlertTitle>اطلاعیه</AlertTitle>
            <AlertDescription>
              <div className="flex flex-col items-start gap-2">
                <p>درخواست شما برای تبدیل حساب کاربریان به فروشنده رد شد</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

      {session?.profile?.seller &&
        session?.profile?.seller.status ===
          ThreeStateSupervisionStatuses.Confirmed && (
          <PastDurationEventsChart />
        )}
    </div>
  )
}

export default AdminIndex
