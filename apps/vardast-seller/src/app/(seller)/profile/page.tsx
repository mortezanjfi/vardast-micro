import { Metadata } from "next"
import { redirect } from "next/navigation"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "حساب کاربری"
  }
}

type Props = {}

function Page({}: Props) {
  redirect("/")
}

export default Page
