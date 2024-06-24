import { useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { UseQueryResult } from "@tanstack/react-query"
import {
  ContactInfo,
  ContactInfoRelatedTypes,
  ThreeStateSupervisionStatuses
} from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import { LucideCheck, LucideX } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import { ApiCallStatusEnum } from "../../../type/src/Enums"
import { getContentByApiStatus } from "../../../util/src/GetContentByApiStatus"
import CardContainer from "../desktop/CardContainer"
import Loading from "../Loading"
import LoadingFailed from "../LoadingFailed"
import NoResult from "../NoResult"

// import { useToast } from "@vardast/hook/use-toast"

type ContactInfosTabProps = {
  data: UseQueryResult<any, unknown>

  relatedType: keyof typeof ContactInfoRelatedTypes
  relatedId: number
  contactInfos: ContactInfo[]
}

const ContactInfosTab = ({
  data,
  relatedType,
  relatedId,
  contactInfos
}: ContactInfosTabProps) => {
  const { t } = useTranslation()
  // const { toast } = useToast()
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const renderedListStatus = {
    [ApiCallStatusEnum.LOADING]: <Loading />,
    [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
    [ApiCallStatusEnum.EMPTY]: <NoResult entity="contactInfo" />,
    [ApiCallStatusEnum.DEFAULT]: null
  }

  const contactsLength = useMemo(
    () => contactInfos?.length,
    [contactInfos?.length]
  )

  return (
    <>
      {session?.abilities?.includes("gql.users.contact_info.index") && (
        <div className="mb-6 flex items-end justify-between">
          <Button
            className="mr-auto"
            onClick={() =>
              router.push(
                `/contact-infos/new?type=${relatedType}&id=${relatedId}&fallback=${pathname}`
              )
            }
          >
            {t("common:add_entity", { entity: t("common:contactInfo") })}
          </Button>
        </div>
      )}
      <CardContainer>
        {renderedListStatus[getContentByApiStatus(data, !!contactsLength)] || (
          <div className="card table-responsive rounded">
            <table className="table-hover table">
              <thead>
                <tr>
                  <th>{t("common:title")}</th>
                  <th>{t("common:type")}</th>
                  <th>{t("common:number")}</th>
                  <th>{t("common:status")}</th>
                  <th>{t("common:visibility")}</th>
                </tr>
              </thead>
              <tbody>
                {contactInfos.map(
                  (contactInfo) =>
                    contactInfo && (
                      <tr
                        key={contactInfo.id}
                        onClick={() =>
                          router.push(
                            `/contact-infos/${contactInfo.id}?fallback=${pathname}`
                          )
                        }
                      >
                        <td>
                          <span className="font-bold">{contactInfo.title}</span>
                        </td>
                        <td>{contactInfo.type}</td>
                        <td>
                          {contactInfo?.country?.phonePrefix &&
                            contactInfo?.code &&
                            contactInfo?.number &&
                            // contactInfo?.ext &&
                            digitsEnToFa(
                              `${contactInfo?.code}-${contactInfo?.number}`
                            )}
                        </td>
                        <td>
                          {contactInfo.status ===
                            ThreeStateSupervisionStatuses.Confirmed && (
                            <span className="tag tag-light tag-sm tag-success">
                              {t("common:confirmed")}
                            </span>
                          )}
                          {contactInfo.status ===
                            ThreeStateSupervisionStatuses.Pending && (
                            <span className="tag tag-light tag-sm tag-warning">
                              {t("common:pending")}
                            </span>
                          )}
                          {contactInfo.status ===
                            ThreeStateSupervisionStatuses.Rejected && (
                            <span className="tag tag-light tag-sm tag-danger">
                              {t("common:rejected")}
                            </span>
                          )}
                        </td>
                        <td>
                          {contactInfo.isPublic ? (
                            <span className="tag tag-light tag-icon tag-success tag-sm h-8 w-8 rounded-full">
                              <LucideCheck className="icon" />
                            </span>
                          ) : (
                            <span className="tag tag-light tag-icon tag-gray tag-sm h-8 w-8 rounded-full">
                              <LucideX className="icon" />
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContainer>
    </>
  )
}

export default ContactInfosTab
