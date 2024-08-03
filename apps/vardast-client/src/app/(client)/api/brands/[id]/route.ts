import { NextResponse } from "next/server"
import { getBrandQueryFn } from "@vardast/query/queryFns/brandQueryFns"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params
  if (id) {
    try {
      const data = await getBrandQueryFn({ id: +id })
      return NextResponse.json(data, { status: 200 })
    } catch {
      return NextResponse.json({ message: "not found" }, { status: 404 })
    }
  }

  return NextResponse.json({ message: "not found" }, { status: 404 })
}
