"use client"

import { useContext } from "react"
import Image from "next/image"
import {
  BuildingStorefrontIcon,
  CubeIcon,
  GlobeAsiaAustraliaIcon,
  HomeModernIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon
} from "@heroicons/react/24/solid"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import Link from "@vardast/component/Link"
import { _about_items } from "@vardast/lib/constants"
import { PublicContext } from "@vardast/provider/PublicProvider"
import { useAtom } from "jotai"

import logo from "@/assets/logo-horizontal-v1-persian-light-bg.svg"

const AboutPageIndex = ({ isMobileView }: { isMobileView: boolean }) => {
  const { appVersion } = useContext(PublicContext)
  const [showAppVersion] = useAtom(appVersion)

  return (
    <>
      {isMobileView && (
        <>
          <div className="mx-auto w-[calc(48%)] pt-6 md:pt lg:w-1/2">
            <Image
              src={logo}
              alt="وردست"
              className="w-full shrink-0 object-contain"
            />
          </div>
        </>
      )}
      <div className="flex flex-1 flex-col items-center justify-start gap-y-11 divide-y-0.5 divide-alpha-white px pt md:px-0 md:pt-0">
        <div className="flex h-full w-full flex-col gap-y md:h-auto md:flex-none md:gap-y-0">
          {!isMobileView && (
            <div className="my-7 flex items-center gap-x-4 py">
              <InformationCircleIcon className="h-10 w-10 text-primary" />
              <h2 className="font-bold">درباره ما</h2>
            </div>
          )}
          <p className="text-justify leading-loose">
            وردست به عنوان یک دستیار، در واقع یک پلتفرم مارکت پلیس (بازار
            آنلاین) برای فعالیت همه ذینفعان صنعت ساختمان است، که در فاز نخست
            تمرکز آن رفع مشکلات و ارتقای بهره‌وری در زنجیره تأمین مصالح و
            تجهیزات ساختمانی به‌وسیله‌ی ایجاد ابزار خرید و فروش آنلاین برای
            برندها و تأمین کنندگان از یک سو و از سوی دیگر پیمانکاران و سازندگان
            بخش ساختمان می‌باشد، که نهایتاً تجربه‌ی متفاوتی از خرید و فروش مصالح
            و تجهیزات ساختمانی را برای کاربران هر دو سوی این پلتفرم رقم خواهد
            زد.
          </p>
          <p className="text-justify leading-loose">
            در اين فاز مالكيت هيچ كالايي در وردست، متعلق به وردست نيست و صرفا
            خريداران ميتوانند اطلاعات تماس فروشندگان را مشاهده و راسا جهت خريد
            كالا با فروشندگان تماس بگيرند.
          </p>
          {/* {isMobileView && (
            <div className="mx-auto flex w-full flex-1 flex-col items-center justify-center">
              <div className="flex w-full items-center justify-center gap-x-11 gap-y-8">
                {_about_items.map(({ Icon, href }, index) => (
                  <Link
                    href={href}
                    key={index}
                    className="flex flex-col items-center justify-start gap-x gap-y-7 rounded-xl bg-alpha-white"
                  >
                    <div className="flex items-center justify-center rounded bg-alpha-50 p">
                      <Icon className="h-6 w-6 text-primary" />
                      <IconProvider key={index} {...props} />
                    </div>
                    <h3 className="font-semibold">{title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )} */}
        </div>
        {!isMobileView && (
          <>
            <div className=" w-full">
              <div className="my-7 flex items-center gap-x-4 py">
                <QuestionMarkCircleIcon className="h-10 w-10 text-primary" />
                <h2 className="font-bold">چرا وردست؟</h2>
              </div>
              <div className="grid grid-cols-4 gap-7">
                <div className="flex flex-col items-start gap-y rounded-xl bg-alpha-white p-7">
                  <div className="flex items-center justify-center rounded bg-alpha-50 p">
                    <CubeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">کالاها</h3>
                  <p>
                    بیش از {digitsEnToFa(70000)} کالا در دسته‌بندی‌های متفاوت
                    برای رفع نیاز شما.
                  </p>
                </div>
                <div className="flex flex-col items-start gap-y rounded-xl bg-alpha-white p-7">
                  <div className="flex items-center justify-center rounded bg-alpha-50 p">
                    <Squares2X2Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">دسته بندی ها</h3>
                  <p>
                    با {digitsEnToFa(1000)}+ دسته‌بندی، کالای خود را مرتب کنید
                  </p>
                </div>
                <div className="flex flex-col items-start gap-y rounded-xl bg-alpha-white p-7">
                  <div className="flex items-center justify-center rounded bg-alpha-50 p">
                    <BuildingStorefrontIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">فروشندگان</h3>
                  <p>
                    {digitsEnToFa(9000)}+ فروشنده معتبر و احراز شده در سراسر
                    کشور
                  </p>
                </div>
                <div className="flex flex-col items-start gap-y rounded-xl bg-alpha-white p-7">
                  <div className="flex items-center justify-center rounded bg-alpha-50 p">
                    <HomeModernIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">برندها</h3>
                  <p>
                    بیش از {digitsEnToFa(3000)} برند معتبر همراه شما هستند تا
                    کالای با کیفیت و با قیمت مناسب خریداری نمایید.
                  </p>
                </div>
              </div>
            </div>
            <div className=" w-full">
              <div className="my-7 flex items-center gap-x-4 py">
                <GlobeAsiaAustraliaIcon className="h-10 w-10 text-primary" />
                <h2 className="font-bold">راه‌های ارتباط با وردست</h2>
              </div>
              <div className="grid grid-cols-4 gap-7">
                {_about_items.map(({ Icon, href, title }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-start gap-x rounded-xl bg-alpha-white p-7"
                  >
                    <div className="flex items-center justify-center rounded bg-alpha-50 p">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{title}</h3>
                  </Link>
                ))}
                {/* <div className="flex items-center justify-start gap-x rounded-xl bg-alpha-white p-7">
                  <div className="flex items-center justify-center rounded bg-alpha-50 p">
                    <EnvelopeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">ایمیل</h3>
                </div>
                <div className="flex items-center justify-start gap-x rounded-xl bg-alpha-white p-7">
                  <div className="flex items-center justify-center rounded bg-alpha-50 p">
                    <PhoneArrowDownLeftIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">تماس با وردست</h3>
                </div>
                <div className="flex items-center justify-start gap-x rounded-xl bg-alpha-white p-7">
                  <div className="flex items-center justify-center rounded bg-alpha-50 p">
                    <MapIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">نقشه</h3>
                </div> */}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col items-center gap-y-2 py md:py-11">
        <p className="text-md font-semibold md:text-lg">
          محصولی از شرکت خلق ارزش مهستان
        </p>
        <div className="text-md mx-auto">
          <span className="text-alpha-500">نسخه</span>
          <span className="px-2 text-primary">
            {showAppVersion?.version && digitsEnToFa(showAppVersion.version)}
          </span>
        </div>
      </div>
    </>
  )
}

export default AboutPageIndex
