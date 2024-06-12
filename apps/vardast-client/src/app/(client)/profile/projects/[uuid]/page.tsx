import { Metadata } from "next"
import ProjectForm from "@vardast/component/project/ProjectForm"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

interface ProductIndexProps {
  params: { uuid: string }
}

export async function generateMetadata(
  { params }: ProductIndexProps
  // parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: params.uuid === "new" ? "افزودن پروژه" : "ویرایش پروژه"
  }
}

export default async ({ params }: ProductIndexProps) => {
  const isMobileView = await CheckIsMobileView()

  const isNew = params.uuid === "new"
  return (
    <ProjectForm
      isMobileView={isMobileView}
      isNew={isNew}
      uuid={params.uuid}
      title={(await generateMetadata({ params })).title?.toString() as string}
    />
  )
}
