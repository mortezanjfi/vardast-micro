import { useState } from "react"
import { useRouter } from "next/navigation"
import { SellerRepresentative } from "@vardast/graphql/generated"
import { Avatar, AvatarFallback, AvatarImage } from "@vardast/ui/avatar"
import { Button } from "@vardast/ui/button"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import CreateMemberModal from "@/app/(admin)/sellers/components/CreateMemberModal"

type MembersTabProps = {
  sellerId: number
  representatives: SellerRepresentative[]
}

const MembersTab = ({ representatives, sellerId }: MembersTabProps) => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const router = useRouter()
  // const pathname = usePathname()
  const [createMemberModalOpen, setCreateMemberModalOpen] =
    useState<boolean>(false)

  return (
    <>
      <CreateMemberModal
        sellerId={sellerId}
        open={createMemberModalOpen}
        onOpenChange={setCreateMemberModalOpen}
      />
      {session?.abilities?.includes(
        "gql.products.seller_representative.store"
      ) && (
        <div className="mb-6 flex items-end justify-between">
          <Button
            className="mr-auto"
            onClick={() => setCreateMemberModalOpen(true)}
          >
            {t("common:add_entity", { entity: t("common:member") })}
          </Button>
        </div>
      )}
      {representatives && representatives.length > 0 && (
        <div className="card table-responsive rounded">
          <table className="table-hover table">
            <thead>
              <tr>
                <th></th>
                <th>{t("common:title")}</th>
                <th>{t("common:role")}</th>
                <th>{t("common:status")}</th>
              </tr>
            </thead>
            <tbody>
              {representatives.map(
                (representative) =>
                  representative && (
                    <tr
                      key={representative.id}
                      onClick={() =>
                        router.push(
                          `/admin/users/${representative?.user?.uuid}`
                        )
                      }
                    >
                      <td>
                        <Avatar size="small">
                          {representative?.user?.avatarFile && (
                            <AvatarImage
                              src={
                                representative?.user?.avatarFile.presignedUrl
                                  .url
                              }
                              alt={representative?.user?.fullName}
                            />
                          )}

                          <AvatarFallback>
                            {representative?.user?.firstName &&
                              representative?.user?.firstName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="ms-2 font-medium text-alpha-800">
                          {representative?.user?.fullName}
                        </span>
                      </td>
                      <td>{representative.title}</td>
                      <td>{representative.role}</td>
                      <td>
                        {representative.isActive ? (
                          <span className="tag tag-light tag-sm tag-success">
                            {t("common:active")}
                          </span>
                        ) : (
                          <span className="tag tag-light tag-sm tag-gray">
                            {t("common:not_active")}
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

export default MembersTab
