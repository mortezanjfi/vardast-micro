"use client"

import Link from "@vardast/component/Link"
// import { useSession } from "next-auth/react"

// import useTranslation from "next-translate/useTranslation"

import { Vocabulary } from "@vardast/graphql/generated"
import { LucideFolderClosed } from "lucide-react"

type VocabularyCardProps = {
  vocabulary: Vocabulary
  onDeleteTriggered: (_: Vocabulary) => void
}

const VocabularyCard = ({
  vocabulary // onDeleteTriggered
}: VocabularyCardProps) => {
  // const { t } = useTranslation()
  // const { data: _ } = useSession()
  const { slug, title } = vocabulary

  // const toggleRemoveItem = () => {
  //   onDeleteTriggered(vocabulary)
  // }

  return (
    <div className="card flex items-center gap-3 rounded px-4 py-4 pe-2">
      <div className="flex items-center gap-2">
        <Link
          href={`/vocabularies/${slug}`}
          className="flex items-center gap-1 font-bold text-alpha-800 underline-offset-2 hover:text-alpha-900 hover:underline dark:text-alpha-400 dark:hover:text-alpha-300"
        >
          <LucideFolderClosed className="h-6 w-6 text-alpha-500 dark:text-alpha-700" />
          {title}
        </Link>
      </div>
      {/* <div className="mr-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" iconOnly>
              <LucideMoreVertical className="icon" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {session?.abilities?.includes(
              "gql.base.taxonomy.vocabulary.update"
            ) && (
              <DropdownMenuItem>
                <LucideEdit className="dropdown-menu-item-icon" />
                <span>{t("common:edit")}</span>
              </DropdownMenuItem>
            )}
            {session?.abilities?.includes(
              "gql.base.taxonomy.vocabulary.destroy"
            ) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={toggleRemoveItem}
                  className="danger"
                >
                  <LucideTrash className="dropdown-menu-item-icon" />
                  <span>{t("common:delete")}</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
    </div>
  )
}

export default VocabularyCard
