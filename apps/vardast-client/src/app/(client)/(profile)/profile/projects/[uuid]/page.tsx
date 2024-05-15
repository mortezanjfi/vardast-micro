import { Metadata } from "next"

import ProjectForm from "@/app/(client)/(profile)/profile/projects/components/ProjectForm"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ویرایش پروژه"
  }
}
const ProjectEdit = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  // const session = await getServerSession(authOptions)

  // if (!session?.abilities?.includes("gql.products.brand.update")) {
  //   redirect("/admin")
  // }

  return (
    uuid && (
      <ProjectForm
        uuid={uuid}
        title={(await generateMetadata()).title?.toString() as string}
      />
    )
  )
}

export default ProjectEdit
