"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa, digitsFaToEn } from "@persian-tools/persian-tools"
import Card from "@vardast/component/Card"
import Link from "@vardast/component/Link"
import {
  useValidateCellphoneMutation,
  useValidateOtpMutation,
  ValidationTypes
} from "@vardast/graphql/generated"
import useCountdown from "@vardast/hook/use-countdown"
import graphqlRequestClientWithoutToken from "@vardast/query/queryClients/graphqlRequestClientWithoutToken"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Button } from "@vardast/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import zodI18nMap from "@vardast/util/zodErrorMap"
import {
  cellphoneNumberSchema,
  otpSchema
} from "@vardast/util/zodValidationSchemas"
import clsx from "clsx"
import { ClientError } from "graphql-request"
import { LucideAlertOctagon, LucideX } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

// eslint-disable-next-line no-unused-vars
enum LoginOptions {
  // eslint-disable-next-line no-unused-vars
  PASSWORD = "PASSWORD",
  // eslint-disable-next-line no-unused-vars
  OTP = "OTP",
  // eslint-disable-next-line no-unused-vars
  VERIFY_OTP = "VERIFY_OTP"
}

const SigninFormContent = (_: { isMobileView?: boolean }) => {
  const pathname = usePathname()
  const { data: session, update: updateSession } = useSession()
  const returnedUrl = pathname
    .replace("/auth/signin", "")
    .split("/")
    .filter(Boolean)
    .join("/")
  const foreign = returnedUrl.startsWith("foreign/")

  const decodedUrl = decodeURIComponent(returnedUrl.split("foreign/")[1])

  const { t } = useTranslation()
  const router = useRouter()
  // const searchParams = useSearchParams()
  const [formState, setFormState] = useState<LoginOptions>(LoginOptions.OTP)
  const [validationKey, setValidationKey] = useState<string>("")
  const [errors, setErrors] = useState<ClientError | null>()
  const [loginErrors, setLoginErrors] = useState<string | null>()
  const [message, setMessage] = useState<string>("")
  const [pageLoading, setPageLoading] = useState(false)
  const { secondsLeft, startCountdown } = useCountdown()
  z.setErrorMap(zodI18nMap)

  const validateCellphoneMutation = useValidateCellphoneMutation(
    graphqlRequestClientWithoutToken,
    {
      onError: (errors: ClientError) => {
        setPageLoading(false)
        setErrors(errors)
      },
      onSuccess: (data) => {
        try {
          const { nextState, message, remainingSeconds, validationKey } =
            data.validateCellphone
          setErrors(null)
          setLoginErrors(null)

          if (nextState === "LOGIN") {
            router.replace(
              `/auth/signin${returnedUrl ? "/" + returnedUrl : ""}`
            )
          }

          if (nextState === "VALIDATE_OTP") {
            setValidationKey(validationKey as string)
            startCountdown(remainingSeconds as number)
            setMessage(message as string)
            setFormState(LoginOptions.VERIFY_OTP)
            setMessage(null)
            setErrors(null)
            setLoginErrors(null)
          }
        } catch (error) {
          console.log("ValidateCellphoneMutation error: ", error)
        }
      }
    }
  )

  const validateOtpMutation = useValidateOtpMutation(
    graphqlRequestClientWithoutToken,
    {
      onError: (errors: ClientError) => {
        setPageLoading(false)
        setErrors(errors)
      },
      onSuccess: async (data) => {
        try {
          const { message } = data.validateOtp
          formStepOne.getValues()
          const callback = await signIn("credentials", {
            cellphone: digitsFaToEn(formStepOne.getValues().cellphone),
            signInType: "otp",
            validationKey,
            // callbackUrl: `/${returnedUrl ?? ""}`,
            // redirect: !foreign
            redirect: false
          })
          if (callback?.error) {
            setLoginErrors(callback?.error)
            setPageLoading(false)
          }
          if (callback?.ok && !callback?.error) {
            setErrors(null)
            setLoginErrors(null)
            setMessage(message as string)
            await updateSession(session)
            router.refresh()
            setTimeout(() => {
              if (foreign) {
                window.location.href = `https://${decodedUrl}`
              } else {
                router.replace(`/${returnedUrl ?? ""}`)
              }
            }, 200)
          }
        } catch (error) {
          console.log("ValidateOtpMutation error: ", error)
        }
      }
    }
  )

  const SignupFormStepOneSchema = z.object({
    cellphone: cellphoneNumberSchema
  })
  type SignupFormStepOneType = TypeOf<typeof SignupFormStepOneSchema>

  const formStepOne = useForm<SignupFormStepOneType>({
    resolver: zodResolver(SignupFormStepOneSchema)
  })

  const SignupFormStepTwoSchema = z.object({
    otp: otpSchema
  })
  type SignupFormStepTwoType = TypeOf<typeof SignupFormStepTwoSchema>

  const formStepTwo = useForm<SignupFormStepTwoType>({
    resolver: zodResolver(SignupFormStepTwoSchema)
  })

  function onSubmitStepOne(data: SignupFormStepOneType) {
    const { cellphone } = data
    validateCellphoneMutation.mutate({
      ValidateCellphoneInput: {
        countryId: 244,
        cellphone: digitsFaToEn(cellphone),
        validationType: ValidationTypes.Login
      }
    })
  }
  function onSubmitStepTwo(data: SignupFormStepTwoType) {
    setPageLoading(true)
    const { otp } = data
    validateOtpMutation.mutate({
      ValidateOtpInput: {
        token: digitsFaToEn(otp),
        validationKey,
        validationType: ValidationTypes.Login
      }
    })
  }

  const SigninFormStepZeroSchema = z
    .object({
      username: z
        .string()
        .min(1, { message: t("zod:errors.invalid_type_received_undefined") }),
      password: z
        .string()
        .min(1, { message: t("zod:errors.invalid_type_received_undefined") })
    })
    .required()

  type SignInFormStepZeroType = TypeOf<typeof SigninFormStepZeroSchema>

  const form = useForm<SignInFormStepZeroType>({
    resolver: zodResolver(SigninFormStepZeroSchema)
  })

  async function onSubmitStepZero(data: SignInFormStepZeroType) {
    const { username, password } = data
    const callback = await signIn("credentials", {
      username: digitsFaToEn(username),
      password,
      signInType: "username",
      // callbackUrl: `/${returnedUrl ?? ""}`,
      // redirect: !foreign
      redirect: false
    })
    if (callback?.error) {
      setLoginErrors(callback?.error)
    }
    if (callback?.ok && !callback?.error) {
      setErrors(null)
      setLoginErrors(null)
      setMessage(message as string)
      await updateSession(session)
      router.refresh()
      setTimeout(() => {
        if (foreign) {
          window.location.href = `https://${decodedUrl}`
        } else {
          router.replace(`/${returnedUrl ?? ""}`)
        }
      }, 200)
    }
  }

  return (
    <>
      {errors && (
        <Alert variant="danger">
          <LucideAlertOctagon />
          <AlertTitle>خطا</AlertTitle>
          <AlertDescription>
            {(
              errors.response?.errors?.at(0)?.extensions
                .displayErrors as string[]
            )?.map((error) => <p key={error}>{error}</p>)}
          </AlertDescription>
        </Alert>
      )}

      {loginErrors && (
        <Alert variant="danger">
          <LucideAlertOctagon />
          <AlertTitle>خطا</AlertTitle>
          <AlertDescription>{loginErrors}</AlertDescription>
        </Alert>
      )}

      {!errors && message && (
        <Alert variant="success">
          <AlertDescription>{digitsEnToFa(message)}</AlertDescription>
        </Alert>
      )}

      {formState === LoginOptions.VERIFY_OTP ? (
        <>
          <h3 className="font-semibold">لطفا کد تایید را وارد کنید.</h3>
          <p className="py text-alpha-800">
            کد تایید برای شماره {digitsEnToFa(formStepOne.watch("cellphone"))}
            پیامک شد.
          </p>
        </>
      ) : (
        <>
          <div className="flex w-full items-center justify-between">
            <h3 className="text-right font-semibold">ورود | ثبت‌نام</h3>
            <Link className="btn btn-ghost btn-icon-only" href="/">
              <LucideX className="icon h-6 w-6 text-alpha-black" />
            </Link>
          </div>
          <div className="text-md flex flex-col gap-y-2 py">
            <p className="text-alpha-800">سلام!</p>
            <p className="text-alpha-800">
              لطفا شماره موبایل خود را وارد کنید.
            </p>
          </div>
        </>
      )}

      <div className="flex w-full flex-col gap-y">
        {formState === LoginOptions.PASSWORD && (
          <Form {...form}>
            <form
              id="login-username"
              onSubmit={form.handleSubmit(onSubmitStepZero)}
              noValidate
              className="flex flex-col gap-8"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        className="placeholder:text-right"
                        placeholder={t("common:cellphone")}
                        {...field}
                        onChange={(e) =>
                          e.target.value.length <= 11 &&
                          field.onChange(digitsEnToFa(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t("common:password")}
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <Link
                      href="/auth/reset"
                      className="text-left text-sm underline"
                    >
                      ایجاد / فراموشی رمز عبور
                    </Link>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </form>
          </Form>
        )}

        {formState === LoginOptions.OTP && (
          <Form {...formStepOne}>
            <form
              id="login-cellphone"
              onSubmit={formStepOne.handleSubmit(onSubmitStepOne)}
              noValidate
              className="flex flex-1 flex-col gap-8"
            >
              <FormField
                control={formStepOne.control}
                name="cellphone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder={digitsEnToFa("09*********")}
                        {...field}
                        onChange={(e) =>
                          e.target.value.length <= 11 &&
                          field.onChange(digitsEnToFa(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </form>
          </Form>
        )}

        {formState === LoginOptions.VERIFY_OTP && (
          <Form {...formStepTwo}>
            <form
              id="verify-otp-form"
              onSubmit={formStepTwo.handleSubmit(onSubmitStepTwo)}
              noValidate
              className="flex flex-1 flex-col gap-8"
            >
              <FormField
                control={formStepTwo.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        className="placeholder:text-right"
                        placeholder={t("common:otp")}
                        {...field}
                        onChange={(e) =>
                          e.target.value.length <= 5 &&
                          field.onChange(digitsEnToFa(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={() => {
                          setFormState(LoginOptions.OTP)
                          setMessage(null)
                          setErrors(null)
                          setLoginErrors(null)
                          formStepTwo.reset()
                        }}
                        size={"xsmall"}
                        type="button"
                        variant="ghost"
                      >
                        ویرایش شماره همراه
                      </Button>
                      <p
                        className={clsx("text-left", "text-sm", "text-succuss")}
                      >
                        {secondsLeft && secondsLeft > 0
                          ? digitsEnToFa(secondsLeft)
                          : digitsEnToFa(0)}{" "}
                        ثانیه
                      </p>
                    </div>
                  </FormItem>
                )}
              ></FormField>
            </form>
          </Form>
        )}

        <div className="flex w-full flex-col gap-y">
          {formState !== LoginOptions.VERIFY_OTP && (
            <div className="flex flex-col justify-center gap-y-7 py-7">
              <div
                onClick={() => {
                  setFormState(LoginOptions.OTP)
                  setMessage(null)
                  setErrors(null)
                  setLoginErrors(null)
                }}
                className="flex cursor-pointer items-center gap-x-2"
              >
                <Circle solid={formState === LoginOptions.OTP} />
                <span className="text-sm text-info">دریافت رمز یکبار مصرف</span>
              </div>
              <div
                onClick={() => {
                  setFormState(LoginOptions.PASSWORD)
                  setMessage(null)
                  setErrors(null)
                  setLoginErrors(null)
                }}
                className="flex cursor-pointer items-center gap-x-2"
              >
                <Circle solid={formState === LoginOptions.PASSWORD} />
                <span className="text-sm text-info">ورود با رمز عبور</span>
              </div>
            </div>
          )}
          {formState === LoginOptions.PASSWORD && (
            <Button
              type="submit"
              block
              form="login-username"
              disabled={pageLoading || form.formState.isSubmitting}
              loading={pageLoading || form.formState.isSubmitting}
            >
              {t("common:login")}
            </Button>
          )}
          {formState === LoginOptions.OTP && (
            <Button
              type="submit"
              block
              form="login-cellphone"
              disabled={
                validateCellphoneMutation.isLoading ||
                formStepOne.formState.isSubmitting
              }
              loading={
                validateCellphoneMutation.isLoading ||
                formStepOne.formState.isSubmitting
              }
            >
              دریافت رمز یکبار مصرف
            </Button>
          )}

          {formState === LoginOptions.VERIFY_OTP && (
            <>
              <Button
                onClick={() => {
                  onSubmitStepOne({
                    cellphone: formStepOne.watch("cellphone")
                  })
                }}
                loading={validateCellphoneMutation.isLoading}
                disabled={secondsLeft > 0}
                variant="ghost"
                type="button"
                block
              >
                ارسال مجدد رمز یکبار مصرف
              </Button>
              <Button
                type="submit"
                id="verify-otp-track-button"
                form="verify-otp-form"
                block
                disabled={
                  validateOtpMutation.isLoading ||
                  validateCellphoneMutation.isLoading ||
                  formStepTwo.formState.isSubmitting
                }
                loading={
                  pageLoading ||
                  validateOtpMutation.isLoading ||
                  validateCellphoneMutation.isLoading ||
                  formStepTwo.formState.isSubmitting
                }
              >
                ورود
              </Button>
            </>
          )}
          {formState !== LoginOptions.VERIFY_OTP && (
            <div className="text-sm">
              ورود شما به معنای پذیرش
              <Link
                target="_blank"
                href={`${process.env.NEXT_PUBLIC_VARDAST}/privacy`}
                className="text-primary underline"
              >
                {" "}
                شرایط و قوانین وردست{" "}
              </Link>
              می‌باشد.
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const Circle = ({ solid }: { solid?: boolean }) => {
  return (
    <span
      className={clsx(
        "relative flex h-5 w-5 flex-col items-center justify-center rounded-full border bg-alpha-50"
      )}
    >
      <span
        className={clsx(
          "absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
          solid && "bg-info"
        )}
      ></span>
    </span>
  )
}

const SigninForm = ({ isMobileView }) => {
  if (isMobileView) {
    return <SigninFormContent isMobileView={true} />
  }
  return (
    <Card className="gap-6 md:py-12">
      <SigninFormContent />
    </Card>
  )
}

export default SigninForm
