import { Metadata } from "next"

import SlidersPage from "./components/SlidersPage"

type Props = {}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "مدیریت اپلیکیشن"
  }
}

export default (props: Props) => {
  return <SlidersPage />
}
