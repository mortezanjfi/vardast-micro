import { NextResponse } from "next/server"
import { getCategoryBasicsQueryFn } from "@vardast/query/queryFns/categoryBasicsQueryFns"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  if (id) {
    try {
      const data = await getCategoryBasicsQueryFn({ id: +id })

      if (data.category.id && data.category.title) {
        return NextResponse.json(data, { status: 200 })
      }
      return NextResponse.json({ message: "not found" }, { status: 404 })
    } catch {
      return NextResponse.json({ message: "not found" }, { status: 404 })
    }
  }

  return NextResponse.json({ message: "not found" }, { status: 404 })
}
