import { Metadata } from "next"

import ProjectPage from "@/app/(bid)/projects/[uuid]/components/ProjectPage"

interface ProductIndexProps {
  params: { uuid: string }
}

export const metadata: Metadata = {
  title: "جزئیات پروژه"
}

export default async ({ params }: ProductIndexProps) => {
  return <ProjectPage uuid={params.uuid} />
}
