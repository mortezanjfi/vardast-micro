import { NextResponse } from "next/server"
import { authOptions } from "@vardast/auth/authOptions"
import { getBrandQueryFn } from "@vardast/query/queryFns/brandQueryFns"
import { getServerSession } from "next-auth"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const session = await getServerSession(authOptions)

  if (id) {
    try {
      const data = await getBrandQueryFn({
        id: +id,
        accessToken: session?.accessToken
      })
      return NextResponse.json(data, { status: 200 })
    } catch {
      return NextResponse.json({ message: "not found" }, { status: 404 })
    }
  }

  return NextResponse.json({ message: "not found" }, { status: 404 })
}
