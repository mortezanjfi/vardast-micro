import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import WithLayout from "@vardast/component/hoc/withLayout"
import layout_options from "@vardast/lib/layout_options"
import paths from "@vardast/lib/paths"
import { getServerSession } from "next-auth"

export default WithLayout(
  async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions)

    if (
      !session?.accessToken ||
      (session?.accessToken &&
        !session?.profile?.roles.some((role) => role?.name === "admin"))
    ) {
      redirect(paths.signin)
    }

    return <>{children}</>
  },
  layout_options._admin
)
