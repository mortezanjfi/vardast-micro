import { LucidePackageX } from "lucide-react"

const NoProductFound = () => {
  return (
    <div className="mx-auto flex max-w-xs flex-col py-8">
      <LucidePackageX className="mb-4 h-10 w-10 text-alpha-400" />
      <p className="mb-2 text-lg font-bold text-alpha-800">
        کالایی با این مشخصات پیدا نشد
      </p>
      <p className="text-sm text-alpha-600">
        برای پیدا کردن کالای مورد نظر می‌توانید فیلترها را تغییر دهید
      </p>
    </div>
  )
}

export default NoProductFound
