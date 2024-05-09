"use client"

import { LoadError, Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"

const renderError = (error: LoadError) => {
  let message = ""
  switch (error.name) {
    case "InvalidPDFException":
      message = "فایل قابل نمایش نیست"
      break
    case "MissingPDFException":
      message = "خطا در نمایش"
      break
    case "UnexpectedResponseException":
      message = "خطای غیر منتظره ای رخ داده است"
      break
    default:
      message = "خطا در نمایش فایل"
      break
  }

  return (
    <div className="flex h-full items-center justify-center">
      <p className="p text-error">{message}</p>
    </div>
  )
}

const PdfViewer = ({ url = "/pdf-open-parameters.pdf" }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
      <div>
        <Viewer
          fileUrl={url}
          plugins={[defaultLayoutPluginInstance]}
          renderError={renderError}
        />
      </div>
    </Worker>
  )
}

export default PdfViewer
