import { NextResponse } from "next/server"
import { getSellerQueryFn } from "@vardast/query/queryFns/sellerQueryFns"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params
  if (id) {
    try {
      const data = await getSellerQueryFn({ id: +id })
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
