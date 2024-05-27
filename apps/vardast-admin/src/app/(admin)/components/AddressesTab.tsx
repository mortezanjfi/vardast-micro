import { usePathname, useRouter } from "next/navigation"
import {
  Address,
  AddressRelatedTypes,
  ThreeStateSupervisionStatuses
} from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import { LucideCheck, LucideX } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

// import { useToast } from "@vardast/hook/use-toast"

type AddressesTabProps = {
  relatedType: keyof typeof AddressRelatedTypes
  relatedId: number
  addresses: Address[]
}

const AddressesTab = ({
  relatedType,
  relatedId,
  addresses
}: AddressesTabProps) => {
  const { t } = useTranslation()
  // const { toast } = useToast()
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <>
      {session?.abilities?.includes("gql.users.address.index") && (
        <div className="mb-6 flex items-end justify-between">
          <Button
            className="mr-auto"
            onClick={() =>
              router.push(
                `/addresses/new?type=${relatedType}&id=${relatedId}&fallback=${pathname}`
              )
            }
          >
            {t("common:add_entity", { entity: t("common:address") })}
          </Button>
        </div>
      )}

      {addresses && addresses.length > 0 && (
        <div className="card table-responsive rounded">
          <table className="table-hover table">
            <thead>
              <tr>
                <th>{t("common:title")}</th>
                <th>{t("common:city")}</th>
                <th>{t("common:address")}</th>
                <th>{t("common:postalCode")}</th>
                <th>{t("common:status")}</th>
                <th>{t("common:visibility")}</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map(
                (address) =>
                  address && (
                    <tr
                      key={address.id}
                      onClick={() =>
                        router.push(
                          `/addresses/${address.id}?fallback=${pathname}`
                        )
                      }
                    >
                      <td>
                        <span className="font-bold">{address.title}</span>
                      </td>
                      <td>
                        {address.province.name}, {address.city.name}
                      </td>
                      <td>{address.address}</td>
                      <td className="text-center">
                        <span className="font-mono tracking-widest">
                          {address.postalCode || "--"}
                        </span>
                      </td>
                      <td>
                        {address.status ===
                          ThreeStateSupervisionStatuses.Confirmed && (
                          <span className="tag tag-light tag-sm tag-success">
                            {t("common:confirmed")}
                          </span>
                        )}
                        {address.status ===
                          ThreeStateSupervisionStatuses.Pending && (
                          <span className="tag tag-light tag-sm tag-warning">
                            {t("common:pending")}
                          </span>
                        )}
                        {address.status ===
                          ThreeStateSupervisionStatuses.Rejected && (
                          <span className="tag tag-light tag-sm tag-danger">
                            {t("common:rejected")}
                          </span>
                        )}
                      </td>
                      <td>
                        {address.isPublic ? (
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
    </>
  )
}

export default AddressesTab
