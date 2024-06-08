// Import the file system module from Node.js
import fs from "fs"
import { Metadata } from "next"
import { ScaleIcon } from "@heroicons/react/24/solid"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "قوانین و مقررات"
  }
}

const PrivacyPage = async () => {
  const isMobileView = await CheckIsMobileView()

  const htmlFilePath = "public/privacy.html"
  const htmlContent = fs.readFileSync(htmlFilePath, "utf-8")

  return (
    <div className="flex flex-col gap-y text-justify leading-loose">
      {!isMobileView && (
        <div className="my-7 flex items-center gap-x-4 py">
          <ScaleIcon className="h-10 w-10 text-primary" />
          <h2 className="font-bold">قوانین و مقررات</h2>
        </div>
      )}
      <div className="flex-1">
        <div
          className="px leading-10 md:px-0"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        ></div>
      </div>
    </div>
  )
}

export default PrivacyPage
