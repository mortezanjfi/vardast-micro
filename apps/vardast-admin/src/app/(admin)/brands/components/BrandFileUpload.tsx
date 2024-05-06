import { Button } from "@vardast/ui/button"

export const BrandFileUpload = () => {
  return (
    <div className="flex justify-between">
      <div>
        <h3>افزودن برند با استفاده از فایل اکسل</h3>
        <ul className="">
          <li>
            * دقت نمایید که می توانید تمامی اطلاعات لازم را در یک فایل اکسل
            ذخیره کرده و بارگذاری نمایید و یا مراحل را به صورت دستی پیش بروید.
          </li>
          <li>
            * شما می توانید با دانلود فایل اکسل نمونه، اطلاعات مورد نیاز را
            دریافت نمایید.
          </li>
        </ul>
      </div>
      <div className="flex w-[194px] flex-col gap-[10px]">
        <Button type="submit">بارگذاری فایل اکسل</Button>{" "}
        <Button variant="secondary" type="button">
          دانلود اکسل نمونه
        </Button>
      </div>
    </div>
  )
}
