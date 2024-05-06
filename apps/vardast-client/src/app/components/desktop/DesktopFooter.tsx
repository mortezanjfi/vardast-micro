import Image from "next/image"
import logoHorizontal from "@vardast/asset/logo-horizontal-v1-persian-dark-bg.svg"
import Link from "@vardast/component/Link"

type Props = {}

export default function DesktopFooter({}: Props) {
  return (
    <footer className="bg-secondary text-alpha-white">
      <div className="container mx-auto flex flex-col gap-y-11 px-6">
        <div className="flex flex-col border-b-0.5 border-alpha-500 py-11">
          <div className="grid grid-cols-7 gap-x-11">
            <div className="col-span-3 flex flex-col items-center gap-y-9">
              <div className="w-[35%]">
                <Image
                  src={logoHorizontal}
                  alt={`${process.env.NEXT_PUBLIC_TITLE} - ${process.env.NEXT_PUBLIC_SLOGAN}`}
                  className="w-full object-contain"
                  priority
                />
              </div>
              <p className="text-justify">
                وردست به عنوان یک دستیار، در واقع یک پلتفرم مارکت پلیس (بازار
                آنلاین) برای فعالیت همه ذینفعان صنعت ساختمان است، که در فاز نخست
                تمرکز آن رفع مشکلات و ارتقای بهره‌وری در زنجیره تأمین مصالح و
                تجهیزات ساختمانی به‌وسیله‌ی ایجاد ابزار خرید و فروش آنلاین برای
                برندها و تأمین کنندگان از یک سو و از سوی دیگر پیمانکاران و
                سازندگان بخش ساختمان می‌باشد، که نهایتاً تجربه‌ی متفاوتی از خرید
                و فروش مصالح و تجهیزات ساختمانی را برای کاربران هر دو سوی این
                پلتفرم رقم خواهد زد. در اين فاز مالكيت هيچ كالايي در وردست،
                متعلق به وردست نيست و صرفا خريداران ميتوانند اطلاعات تماس
                فروشندگان را مشاهده و راسا جهت خريد كالا با فروشندگان تماس
                بگيرند.
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-y-2.5">
              <div className="pb">
                با
                <h2 className="inline-block px-1 font-semibold text-primary">
                  وردست
                </h2>
                آشنا شوید
              </div>
              <Link href="/contact">تماس با ما</Link>
              <Link href="/about">درباره ما</Link>
              <Link href="/privacy">قوانین و مقررات</Link>
              <Link href="/faq">سوالات متداول</Link>
            </div>
            {/* <div className="flex flex-col gap-y-2.5">
              <h3 className="pb">جدیدترین مطالب</h3>
              <Link href="">نام مطلب اول</Link>
              <Link href="">نام مطلب دوم</Link>
              <Link href="">نام مطلب سوم</Link>
            </div> */}
            <div className="flex flex-col gap-y-2.5">
              <h3 className="pb">ویژگی های وردست</h3>
              <Link href="https://blog.vardast.com" target="_blank">
                بلاگ وردست
              </Link>
              {/* <Link href="">فروشنده شوید!</Link> */}
              {/* <Link href="">تبلیغات</Link> */}
            </div>
            <div className="flex flex-col gap-y-2.5">
              <h3 className="pb">با ما همراه شوید</h3>
              <Link
                href="https://www.instagram.com/vardast.ir?igsh=aHViMmE3bWkxY3hk"
                target="_blank"
              >
                Instagram
              </Link>
              <Link href="https://wa.me/+9890227272823" target="_blank">
                Whatsapp
              </Link>
              <Link href="https://t.me/+9890227272823" target="_blank">
                Telegram
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between gap-x-7">
            <div className="flex flex-col items-start justify-center gap-x-9 gap-y">
              <div>
                تمام حقوق اين وب‌سايت نیز برای شرکت خلق ارزش مهستان (وردست)
                محفوظ است.
              </div>
              <div>Vardast.com | 2022 - 2023</div>
            </div>
            <div className="h-24 w-24">
              {/* <a
                referrerPolicy="origin"
                target="_blank"
                href="https://trustseal.enamad.ir/?id=362461&Code=IRjvGFVdLILMiptdZ7EN"
              > */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* <img
                  referrerPolicy="origin"
                  src="https://trustseal.enamad.ir/logo.aspx?id=362461&Code=IRjvGFVdLILMiptdZ7EN"
                  alt=""
                  className="h-full w-full cursor-pointer rounded bg-alpha-white object-contain"
                /> */}
              {/* </a> */}
              {/* <Image
                src={enamad}
                alt={`${process.env.NEXT_PUBLIC_TITLE} - ${process.env.NEXT_PUBLIC_SLOGAN}`}
                className="h-full w-full rounded bg-alpha-white object-contain"
                priority
              /> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
