/* eslint-disable no-unused-vars */
import { ChangeEvent, useRef, useState } from "react"
import Dropzone from "@vardast/component/Dropzone"
import { Image } from "@vardast/graphql/generated"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import { Button } from "@vardast/ui/button"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

type UploadTabContentProps = {}

function UploadTabContent({}: UploadTabContentProps) {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const token = session?.accessToken || null
  const FileFieldRef = useRef<HTMLInputElement>(null)
  const [File, setFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [images, setImages] = useState<
    { uuid: string; expiresAt: string; image?: Image }[]
  >([])
  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileToUpload = event.target.files[0]
      const formData = new FormData()
      formData.append("directoryPath", uploadPaths.brandLogo)
      formData.append("file", fileToUpload)
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/base/storage/file`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`
        },
        body: formData
      }).then(async (response) => {
        if (!response.ok) {
        }

        const uploadResult = await response.json()

        setFile(fileToUpload)
        setLogoPreview(URL.createObjectURL(fileToUpload))
      })
    }
  }
  return (
    <div className="flex w-full flex-col gap-5 py-5">
      {" "}
      <Dropzone
        isPreOrder={true}
        // existingImages
        uploadPath={uploadPaths.productImages}
        onAddition={(file) => {
          setImages((prevImages) => [
            ...prevImages,
            {
              uuid: file.uuid as string,
              expiresAt: file.expiresAt as string
            }
          ])
        }}
        onDelete={(file) => {
          setImages((images) =>
            images.filter((image) => image.uuid !== file.uuid)
          )
        }}
      />
      <div className="flex w-full justify-end">
        <Button variant="outline-primary" onClick={(e) => {}} className="py-3">
          افزودن به سفارش
        </Button>
      </div>
    </div>
  )
}

export default UploadTabContent
