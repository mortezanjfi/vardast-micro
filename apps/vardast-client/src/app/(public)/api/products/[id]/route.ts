import { NextResponse } from "next/server"
import { authOptions } from "@vardast/auth/authOptions"
import { getProductBasicsQueryFn } from "@vardast/query/queryFns/productBasicsQueryFns"
import { getServerSession } from "next-auth"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  const { id } = params
  if (id) {
    try {
      const data = await getProductBasicsQueryFn({
        id: +id,
        accessToken: session?.accessToken
      })

      if (data.product.id && data.product.name) {
        return NextResponse.json(data, { status: 200 })
      }
      return NextResponse.json({ message: "not found" }, { status: 404 })
    } catch {
      return NextResponse.json({ message: "not found" }, { status: 404 })
    }
  }

  return NextResponse.json({ message: "not found" }, { status: 404 })
}
