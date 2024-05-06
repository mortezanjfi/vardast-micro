import { NextResponse } from "next/server"
import { authOptions } from "@vardast/auth/authOptions"
import { getSellerQueryFn } from "@vardast/query/queryFns/sellerQueryFns"
import { getServerSession } from "next-auth"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  const { id } = params
  if (id) {
    try {
      const data = await getSellerQueryFn({
        id: +id,
        accessToken: session?.accessToken
      })
      if (data.seller.name && data.seller.id) {
        return NextResponse.json(data, { status: 200 })
      }
      return NextResponse.json({ message: "not found" }, { status: 404 })
    } catch {
      return NextResponse.json({ message: "not found" }, { status: 404 })
    }
  }

  return NextResponse.json({ message: "not found" }, { status: 404 })
}
