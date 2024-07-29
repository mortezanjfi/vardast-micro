"use client"

import { usePathname } from "next/navigation"
import FiltersSidebarContainer from "@vardast/component/filters-sidebar-container"
import Link from "@vardast/component/Link"
import { File } from "@vardast/graphql/generated"
import paths from "@vardast/lib/paths"
import { setSidebar } from "@vardast/provider/LayoutProvider/use-layout"

type PdfTabItemProps = {
  file?: File
  access_token?: string
  title: string
}

const PdfTabItem = ({ file, access_token, title }: PdfTabItemProps) => {
  const pathname = usePathname()

  const DesktopSidebar = (
    <FiltersSidebarContainer>
      <div className="flex flex-col gap-9">
        <div className=" flex items-center border-b-2 border-b-alpha-200 py-4">
          <strong>فیلترها</strong>
          {/* {filterAttributes.length > 0 && (
            <Button
              size="small"
              noStyle
              className="ms-auto text-sm text-red-500"
              onClick={() => setFilterAttributes([])}
            >
              حذف همه فیلترها
            </Button>
          )} */}
        </div>
      </div>
    </FiltersSidebarContainer>
  )
  setSidebar(DesktopSidebar)
  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-y-7 px py-9 sm:pt-0">
      {file && file?.uuid ? (
        access_token ? (
          <>
            <h4 className="px-6 text-center">
              فایل PDF {title} را می توانید از گزینه زیر مشاهده نمایید.
            </h4>
            <div className="flex w-full items-center justify-center gap-3 sm:justify-between lg:flex-col">
              <div className="flex flex-col gap-2">
                {/* <div className=" hidden gap-1 sm:flex">
                  <div className="h-[64px] w-[64px]">
                    <Image
                      className="rounded-lg"
                      width={64}
                      height={64}
                      src={file.presignedUrl.url || "/public/images/blank.png"}
                      alt={file.name}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span>{file.originalName}</span>
                    <span>{digitsEnToFa(formatFileSize(file.size))}</span>
                  </div>
                </div> */}
                {/* <div className="hidden gap-1 sm:flex lg:items-center">
                  <span>تاریخ آپلود</span>
                  <span>
                    {file.createdAt
                      ? digitsEnToFa(
                          new Date(file.createdAt).toLocaleDateString("fa-IR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                          })
                        )
                      : ""}
                  </span>
                </div> */}
              </div>
              <div className="flex justify-end">
                <Link
                  download
                  target="_blank"
                  href={file.presignedUrl.url}
                  // loading={pdfViewLoading}
                  className="btn btn-primary btn-md flex items-center justify-center sm:px-4 sm:py-2"
                  // onClick={() => {
                  //   showPdfInNewTab({ uuid: file.uuid })
                  // }}
                >
                  <span>مشاهده {title}</span>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <h4 className="px-6 text-center">
              برای مشاهده {title}، لطفا ابتدا وارد حساب کاربری خود شوید.
            </h4>
            <Link
              href={`${paths.signin}?ru=${pathname}`}
              className="btn btn-md btn-primary block px"
            >
              ورود به حساب کاربری
            </Link>
          </>
        )
      ) : (
        <h4 className="px-6 text-center">
          در حال حاضر، {title}ی آپلود نشده است.
        </h4>
      )}
    </div>
  )
}

export default PdfTabItem
