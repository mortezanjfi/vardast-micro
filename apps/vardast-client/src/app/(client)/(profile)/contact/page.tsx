import { Metadata } from "next"
import { MapIcon, PhoneIcon } from "@heroicons/react/24/outline"
import { PhoneIcon as PhoneIconSolid } from "@heroicons/react/24/solid"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import clsx from "clsx"

import ContactForm from "./components/ContactForm"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "تماس با ما"
  }
}

const ContactPage = async () => {
  const isMobileView = await CheckIsMobileView()

  return (
    <>
      {isMobileView ? (
        // <div className="text-justify">
        //   لطفا پیش از ارسال ایمیل یا تماس تلفنی، ابتدا
        //   <span className="text-primary">پرسش های متداول</span> را مشاهده کنید.
        // </div>
        <></>
      ) : (
        <div className="my-7 flex items-center gap-x-4 py">
          <PhoneIconSolid className="h-10 w-10 text-primary" />
          <h2 className="font-bold">تماس با ما</h2>
        </div>
      )}
      {isMobileView ? (
        <ContactForm isMobileView={isMobileView} />
      ) : (
        <>
          <div
            className={clsx(
              "grid gap-x-11 border-b border-alpha-white pb-11 md:grid-cols-2"
            )}
          >
            <ContactForm isMobileView={isMobileView} />
            <div className="flex flex-col gap-y-11 rounded-3xl bg-alpha-white p-11">
              <div className="h-[30vw] w-full overflow-hidden rounded-xl">
                <iframe
                  src="https://maps.google.com/maps?q=35.7808002,51.448611&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "inline-block" }}
                  allowFullScreen
                  aria-hidden="false"
                  tabIndex={0}
                ></iframe>
              </div>
              <div className="flex flex-col gap-y-11">
                <div className="flex items-center gap-x-7">
                  <div className="flex items-center justify-center rounded-md bg-alpha-50 p">
                    <MapIcon className="h-6 w-6 text-primary" />
                  </div>{" "}
                  <h2 className="font-semibold">آدرس:</h2>
                  <p className="text-alpha-500">
                    استان: تهران، شهرستان : تهران، بخش : مرکزی، شهر: تهران،
                    محله: درب دوم، کوچه لاله، بلوار شهید محمود کاوه، پلاک:
                    -12.1، طبقه: 2، واحد: 4،
                  </p>
                </div>
                <div className="flex items-center gap-x-7">
                  <div className="flex items-center justify-center rounded-md bg-alpha-50 p">
                    <PhoneIcon className="h-6 w-6 text-primary" />
                  </div>{" "}
                  <h2 className="font-semibold">تلفن تماس:</h2>
                  <p className="text-alpha-500">
                    {`${digitsEnToFa("5")} - ${digitsEnToFa("02187132500")}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default withMobileHeader(ContactPage, {
  title: "تماس با ما"
})
