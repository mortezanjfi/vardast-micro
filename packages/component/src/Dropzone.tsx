"use client"

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react"
import Image from "next/image"
import { UseMutationResult, useQueryClient } from "@tanstack/react-query"
import blankProductImageSrc from "@vardast/asset/product-blank.svg"
import {
  Exact,
  ImageCategory,
  Image as ImageType,
  Maybe,
  RemoveImageMutation,
  useRemoveImageMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import clsx from "clsx"
import { ClientError } from "graphql-request"
import { LucideLoader2, PlusIcon, Trash } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { FileWithPath, useDropzone } from "react-dropzone"

interface DropzoneProps {
  uuidForCsv?: string
  isCsv?: boolean
  isPreOrder?: boolean
  maxFiles?: number
  existingImages?: Maybe<ImageType | ImageCategory>[]
  uploadPath?: string
  onAddition: (_: FilesWithPreview) => void
  onDelete?: (_: FilesWithPreview) => void
  withHeight?: boolean
  withText?: boolean
  manualFileState?: [
    FilesWithPreview[],
    Dispatch<SetStateAction<FilesWithPreview[]>>
  ]
}
export interface FilesWithPreview extends FileWithPath {
  preview: string
  status: "uploading" | "uploaded" | "failed" | "existed"
  uuid?: string
  expiresAt?: string
}

export interface CsvWithPreview extends FileWithPath {
  preview: string
  status: "uploading" | "uploaded" | "failed" | "existed"
  uuid?: string
  expiresAt?: string
}
const Dropzone = ({
  uuidForCsv,
  isCsv,
  maxFiles,
  existingImages,
  uploadPath,
  onAddition,
  withHeight = true,
  manualFileState,
  onDelete
}: DropzoneProps) => {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const [_, setErrors] = useState<ClientError>()
  const queryClient = useQueryClient()

  const internalFileState = useState<FilesWithPreview[]>([])
  const [files, setFiles] = manualFileState
    ? manualFileState
    : internalFileState

  const token = session?.accessToken || null

  const uploadFile = useCallback(
    (fileToUpload: FilesWithPreview) => {
      const formData = new FormData()
      if (!isCsv) {
        formData.append("directoryPath", uploadPath)
      }
      formData.append("file", fileToUpload)
      const url = isCsv
        ? `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/order/file/line/${uuidForCsv}`
        : `${process.env.NEXT_PUBLIC_API_ENDPOINT}/base/storage/file`

      fetch(url, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`
        },
        body: formData
      }).then(async (response) => {
        if (!response.ok) {
          setFiles((files) =>
            files.map((file) => {
              if (file.name === fileToUpload.name) {
                file.status = "failed"
              }

              return file
            })
          )
        }

        const uploadResult = await response.json()

        Object.assign(fileToUpload, {
          status: "uploaded",
          uuid: uploadResult.uuid,
          expiresAt: uploadResult.expiresAt
        })

        setFiles((files) =>
          files.map((file) => {
            if (file.name === fileToUpload.name) {
              file = fileToUpload
            }

            return file
          })
        )
        onAddition(fileToUpload)
      })
    },
    [onAddition, token, uploadPath]
  )

  const deleteFile = useCallback(
    (fileToDelete: FilesWithPreview) => {
      fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/base/storage/file/${fileToDelete.uuid}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      ).then((response) => {
        if (!response.ok) {
        }

        setFiles((files) =>
          files.filter((file) => file.name !== fileToDelete.name)
        )

        onDelete(fileToDelete)
      })
    },
    [onDelete, token]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length) {
        setFiles((previousFiles: FilesWithPreview[]): FilesWithPreview[] => {
          return [
            ...previousFiles,
            ...acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
                status: "uploading"
              })
            )
          ] as FilesWithPreview[]
        })

        acceptedFiles.map((fileToUpload) =>
          uploadFile(fileToUpload as FilesWithPreview)
        )
      }
    },
    [uploadFile]
  )

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview))
  }, [files])

  const removeFile = useCallback(
    (name: string) => {
      const fileToDelete = files.find((file) => file.name === name)
      fileToDelete ? deleteFile(fileToDelete) : null
    },
    [deleteFile, files]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      "text/csv": [".csv"],
      "application/x-gzip": [".tgz"],
      "application/x-compressed-tar": [".tgz"],
      "application/x-tar": [".tar"],
      "application/vnd.rar": [".rar"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx"
      ],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.oasis.opendocument.text": [".odt"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/tiff": [".tiff"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/bmp": [".bmp"],
      "image/svg+xml": [".svg"],
      "text/plain": [".txt"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/rtf": [".rtf"],
      "application/pdf": [".pdf"]
    },
    noClick: !!files.length,
    onDrop,
    maxFiles: maxFiles || 0
  })

  const removeImageMutation: UseMutationResult<
    RemoveImageMutation,
    ClientError,
    Exact<{ id: number }>,
    unknown
  > = useRemoveImageMutation(graphqlRequestClientWithToken, {
    onError: (errors: ClientError) => {
      setErrors(errors)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["GetProduct"]
      })

      toast({
        description: t("common:entity_removed_successfully", {
          entity: `${t(`common:image`)}`
        }),
        duration: 2000,
        variant: "success"
      })
    }
  })
  const onImageDelete = (imageToDeleteId: number) => {
    removeImageMutation.mutate({ id: imageToDeleteId })
  }

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div
          className={clsx([
            "card relative rounded border-dashed p-4 transition",
            isDragActive && "bg-alpha-50 py-10"
          ])}
        >
          {files?.length || existingImages?.length ? (
            <>
              <ul className="relative z-0 flex flex-wrap gap-8">
                {existingImages &&
                  existingImages.map(
                    (image) =>
                      image && (
                        <li
                          key={image?.file.uuid}
                          className="relative h-32 overflow-hidden rounded border border-alpha-200"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <Image
                            src={
                              image.file.presignedUrl.url ||
                              blankProductImageSrc
                            }
                            alt={image.file.uuid}
                            width={100}
                            height={100}
                            className="relative z-0 h-full w-full object-contain"
                          />
                          {!isCsv && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onImageDelete(image.id)
                              }}
                              className="absolute bottom-0 left-0 z-10 m-2 flex h-6 w-6 items-center justify-center rounded bg-red-500 text-white ring-2 ring-transparent transition hover:bg-red-600 hover:ring-red-500/50"
                            >
                              <Trash className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          )}
                        </li>
                      )
                  )}
                {files.map((file) => (
                  <li
                    key={file.name}
                    className={clsx(
                      "relative h-32 overflow-hidden rounded border border-alpha-200"
                    )}
                  >
                    {file.status === "uploading" && (
                      <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-alpha-800 bg-opacity-10 text-primary-600 backdrop-blur-sm">
                        <span className="animate-spin">
                          <LucideLoader2 className="h-5 w-5" />
                        </span>
                      </div>
                    )}
                    <Image
                      src={
                        file.name.includes(".png") ||
                        file.name.includes(".jpeg") ||
                        file.name.includes(".jpg") ||
                        file.name.includes(".svg")
                          ? file.preview
                          : blankProductImageSrc
                      }
                      alt={file.name}
                      width={100}
                      height={100}
                      onLoad={() => {
                        URL.revokeObjectURL(file.preview)
                      }}
                      className="relative z-0 h-full w-full object-contain"
                    />
                    {(file.status === "uploaded" || file.status === "failed") &&
                      !isCsv && (
                        <button
                          type="button"
                          className="absolute bottom-0 left-0 z-10 m-2 flex h-6 w-6 items-center justify-center rounded bg-red-500 text-white ring-2 ring-transparent transition hover:bg-red-600 hover:ring-red-500/50"
                          onClick={() => removeFile(file.name)}
                        >
                          <Trash className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      )}
                  </li>
                ))}
                {!isCsv && (
                  <button
                    onClick={open}
                    type="button"
                    className={
                      "btn flex h-32 w-32 flex-col gap-1 overflow-hidden rounded border border-alpha-200"
                    }
                  >
                    <PlusIcon className="h-12 w-12 text-alpha-400" />
                  </button>
                )}
              </ul>
            </>
          ) : (
            <div
              className={clsx(
                "flex w-full cursor-pointer flex-col items-center justify-center gap-1",
                withHeight && "h-60"
              )}
            >
              <PlusIcon className="h-12 w-12 text-alpha-400" />
              <span className="font-medium text-alpha-800">
                {isCsv
                  ? t("common:add_csv_dropzone_title")
                  : t("common:add_images_dropzone_title")}
              </span>
              <span className="text-sm text-alpha-500">
                {t("common:add_images_dropzone_description")}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Dropzone
