import { Input } from "@vardast/ui/input"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import CardContainer from "../desktop/CardContainer"
import { inputSectionClass } from "./submition/SubmitPage"

type Props = { uuid: string }

export default ({ uuid }: Props) => {
  const { t } = useTranslation()

  return (
    <CardContainer title="اطلاعات پایه شرکت">
      <div className="grid w-full grid-cols-3 gap-7 ">
        <div className={clsx(inputSectionClass)}>
          <span>
            {t("common:entity_name", {
              entity: t("common:company")
            })}
          </span>
          <Input className="col-span-1 w-full" disabled />
        </div>

        <div className={clsx(inputSectionClass)}>
          <span>
            {t("common:entity_uuid", {
              entity: t("common:national")
            })}
          </span>
          <Input className="col-span-1 w-full" disabled />
        </div>
      </div>
    </CardContainer>
  )
}
