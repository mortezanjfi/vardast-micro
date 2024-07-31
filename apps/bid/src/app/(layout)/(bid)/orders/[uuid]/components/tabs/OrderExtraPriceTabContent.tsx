import { Dispatch, SetStateAction } from "react"
import { OrderProductTabContentProps } from "@vardast/type/OrderProductTabs"
import { Checkbox } from "@vardast/ui/checkbox"

const additionalExpenses = ["انبارداری", "بارگیری", "باسکول", "حمل", "تخلیه"]

export const OrderExtraPriceTabContent = ({
  loading,
  expenses,
  setExpenses
}: OrderProductTabContentProps & {
  loading?: boolean
  expenses: string[]
  setExpenses: Dispatch<SetStateAction<string[]>>
}) => {
  return (
    <>
      {additionalExpenses.map((item) => (
        <div key={item} className="form-item checkbox-field gap-4">
          <div className="form-control">
            <Checkbox
              checked={expenses.includes(item)}
              disabled={loading}
              value={item}
              onCheckedChange={(checked) => {
                if (checked) {
                  setExpenses((prev) => [...prev, item])
                } else {
                  setExpenses((prev) => prev.filter((value) => value !== item))
                }
              }}
            />
          </div>
          <div className="form-label">{item}</div>
        </div>
      ))}
    </>
  )
}
