import { Metadata } from "next"

import ProjectForm from "@/app/(client)/profile/projects/components/project/ProjectForm"

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

const ProjectEdit = async ({ params }: ProductIndexProps) => {
  const isNew = params.uuid === "new"
  return (
    <ProjectForm
      isNew={isNew}
      uuid={params.uuid}
      title={(await generateMetadata({ params })).title?.toString() as string}
    />
  )
}

export default ProjectEdit
