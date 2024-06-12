import LegalUsers from "./LegalUsers"

export type Props = {
  uuid?: string
  isMobileView: boolean
}

export default ({ isMobileView, uuid }: Props) => {
  return <LegalUsers isMobileView={isMobileView} uuid={uuid} />
}
