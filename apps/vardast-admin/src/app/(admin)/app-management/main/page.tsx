import { Metadata } from "next"

type Props = {}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "مدیریت اپلیکیشن"
  }
}

export default (props: Props) => {
  return <div>page</div>
}
