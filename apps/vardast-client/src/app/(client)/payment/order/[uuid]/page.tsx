import { Metadata } from "next"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import Card from "@vardast/component/Card"
import Link from "@vardast/component/Link"
import { LucideCheckSquare } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "پرداخت"
  }
}

// Make sure the function name is "default" (if you intend to have a default export)
const AddProductPage = async ({
  params: { uuid }
}: {
  params: { type: string; uuid: string }
}) => {
  return (
    <Card className="flex flex-col items-center justify-center gap-6 md:py-12">
      <span>
        <LucideCheckSquare className="h-32 w-32 text-success" />
      </span>
      <p className="text-success">پرداخت شما با موفقیت انجام شد.</p>
      <div className="flex justify-center gap-1">
        <p className="font-medium">شماره سفارش:</p>
        <p>{digitsEnToFa(uuid)}</p>
      </div>
      <Link className="btn btn-primary btn-md w-full" href="/profile/orders">
        بازگشت به سفارشات
      </Link>
    </Card>
  )
}

export default AddProductPage
