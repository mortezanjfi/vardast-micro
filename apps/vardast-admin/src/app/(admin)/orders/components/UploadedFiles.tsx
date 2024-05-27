import { digitsEnToFa } from "@persian-tools/persian-tools"
import CardContainer from "@vardast/component/desktop/CardContainer"
import useTranslation from "next-translate/useTranslation"

type UploadedFilesProps = {}

function UploadedFiles({}: UploadedFilesProps) {
  const fakeOrderInfo = [
    { id: 1, file: "test" },
    { id: 2, file: "test2" }
  ]

  const { t } = useTranslation()
  return (
    <CardContainer title="فایل های آپلود شده">
      <table className="table border-collapse border">
        <thead>
          <tr>
            <th>{t("common:row")}</th>
            <th>{t("common:entity_name", { entity: t("common:file") })}</th>
            <th>{t("common:operation")}</th>
          </tr>
        </thead>
        <tbody>
          {fakeOrderInfo.map(
            (order, index) =>
              order && (
                <tr key={order.id}>
                  <td>
                    {" "}
                    <span>{digitsEnToFa(index + 1)}</span>
                  </td>
                  <td>{order.file}</td>
                  <td className=" border-r-0.5">
                    <span className="text- cursor-pointer text-blue-500">
                      نمایش
                    </span>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </CardContainer>
  )
}

export default UploadedFiles
