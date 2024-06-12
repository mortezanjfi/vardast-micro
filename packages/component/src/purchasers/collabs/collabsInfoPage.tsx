import ProjectUsersTab from "../../project/user/ProjectUsersTab"

export type ProjectUsersTabProps = {
  uuid?: string
}

export default ({ uuid }: ProjectUsersTabProps) => {
  return <ProjectUsersTab isAdmin={true} uuid={uuid} />
}
