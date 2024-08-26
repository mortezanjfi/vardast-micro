"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import paths from "@vardast/lib/paths"
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
import { Eye, EyeOff, LucideAlertOctagon, LucideX } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

 
enum LoginOptions {
   
  PASSWORD = "PASSWORD",
   
  OTP = "OTP",
   
  VERIFY_OTP = "VERIFY_OTP"
}

const SigninFormContent = ({
  hasPassword
}: {
  isMobileView?: boolean
  hasPassword?: boolean
}) => {
  const { data: session, update: updateSession } = useSession()
  const { t } = useTranslation()
  const router = useRouter()
  const [formState, setFormState] = useState<LoginOptions>(LoginOptions.OTP)
  const [validationKey, setValidationKey] = useState<string>("")
  const [errors, setErrors] = useState<ClientError | null>()
  const [loginErrors, setLoginErrors] = useState<string | null>()
  const [message, setMessage] = useState<string>("")
  const [pageLoading, setPageLoading] = useState(false)
  const { secondsLeft, startCountdown } = useCountdown()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)

  const returnedUrl = searchParams.get("ru") || "/"
  const decodedExternalUrl = returnedUrl.startsWith("https://")
    ? decodeURIComponent(returnedUrl)
    : ""

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
            router.replace(`${paths.signin}?ru=${returnedUrl}`)
          }

          if (nextState === "VALIDATE_OTP") {
            setValidationKey(validationKey)
            startCountdown(remainingSeconds)
            setMessage(message)
            setFormState(LoginOptions.VERIFY_OTP)
            setMessage(null)
            setErrors(null)
            setLoginErrors(null)
            router.refresh()
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
            redirect: false
          })
          if (callback?.error) {
            setLoginErrors(callback?.error)
            setPageLoading(false)
          }
          if (callback?.ok && !callback?.error) {
            setErrors(null)
            setLoginErrors(null)
            setMessage(message)
            await updateSession(session)
            router.refresh()
            setTimeout(() => {
              if (decodedExternalUrl) {
                window.location.href = decodedExternalUrl
              } else {
                router.replace(returnedUrl)
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
      redirect: false
    })
    if (callback?.error) {
      setLoginErrors(callback?.error)
    }
    if (callback?.ok && !callback?.error) {
      setErrors(null)
      setLoginErrors(null)
      setMessage(message)
      await updateSession(session)
      router.refresh()
      setTimeout(() => {
        if (decodedExternalUrl) {
          window.location.href = decodedExternalUrl
        } else {
          router.replace(returnedUrl)
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
          {hasPassword ? (
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
          ) : (
            <div className="text-md flex flex-col gap-y-2 py">
              <p className="text-alpha-800">سلام!</p>
              <p className="text-alpha-800">
                لطفا شماره موبایل خود را وارد کنید.
              </p>
            </div>
          )}
        </>
      )}

      <div className="flex w-full flex-col gap-y">
        {formState === LoginOptions.PASSWORD && (
          <Form {...form}>
            <form
              className="flex flex-col gap-8"
              id="login-username"
              noValidate
              onSubmit={form.handleSubmit(onSubmitStepZero)}
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="placeholder:text-right"
                        inputMode="numeric"
                        placeholder={t("common:cellphone")}
                        type="tel"
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
                      <div className="flex w-full gap-5">
                        <button
                          className="absolute inset-y-0 left-0 flex items-center px-2 text-sm leading-5"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff hanging={20} width={20} />
                          ) : (
                            <Eye hanging={20} width={20} />
                          )}
                        </button>
                        <Input
                          placeholder={t("common:password")}
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    {hasPassword && (
                      <Link
                        className="text-left text-sm underline"
                        href="/auth/reset"
                      >
                        ایجاد / فراموشی رمز عبور
                      </Link>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}

        {formState === LoginOptions.OTP && (
          <Form {...formStepOne}>
            <form
              className="flex flex-1 flex-col gap-8"
              id="login-cellphone"
              noValidate
              onSubmit={formStepOne.handleSubmit(onSubmitStepOne)}
            >
              <FormField
                control={formStepOne.control}
                name="cellphone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        placeholder={digitsEnToFa("09*********")}
                        type="tel"
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
              className="flex flex-1 flex-col gap-8"
              id="verify-otp-form"
              noValidate
              onSubmit={formStepTwo.handleSubmit(onSubmitStepTwo)}
            >
              <FormField
                control={formStepTwo.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="placeholder:text-right"
                        inputMode="numeric"
                        placeholder={t("common:otp")}
                        type="tel"
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
                        size={"xsmall"}
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setFormState(LoginOptions.OTP)
                          setMessage(null)
                          setErrors(null)
                          setLoginErrors(null)
                          formStepTwo.reset()
                        }}
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
          {hasPassword && (
            <>
              {formState !== LoginOptions.VERIFY_OTP && (
                <div className="flex flex-col justify-center gap-y-7 py-7">
                  <div
                    className="flex cursor-pointer items-center gap-x-2"
                    onClick={() => {
                      setFormState(LoginOptions.OTP)
                      setMessage(null)
                      setErrors(null)
                      setLoginErrors(null)
                    }}
                  >
                    <Circle solid={formState === LoginOptions.OTP} />
                    <span className="text-sm text-info">
                      دریافت رمز یکبار مصرف
                    </span>
                  </div>
                  <div
                    className="flex cursor-pointer items-center gap-x-2"
                    onClick={() => {
                      setFormState(LoginOptions.PASSWORD)
                      setMessage(null)
                      setErrors(null)
                      setLoginErrors(null)
                    }}
                  >
                    <Circle solid={formState === LoginOptions.PASSWORD} />
                    <span className="text-sm text-info">ورود با رمز عبور</span>
                  </div>
                </div>
              )}
              {formState === LoginOptions.PASSWORD && (
                <Button
                  block
                  disabled={pageLoading || form.formState.isSubmitting}
                  form="login-username"
                  loading={pageLoading || form.formState.isSubmitting}
                  type="submit"
                >
                  {t("common:login")}
                </Button>
              )}
            </>
          )}
          {formState === LoginOptions.OTP && (
            <Button
              block
              disabled={
                validateCellphoneMutation.isLoading ||
                formStepOne.formState.isSubmitting
              }
              form="login-cellphone"
              loading={
                validateCellphoneMutation.isLoading ||
                formStepOne.formState.isSubmitting
              }
              type="submit"
            >
              دریافت رمز یکبار مصرف
            </Button>
          )}

          {formState === LoginOptions.VERIFY_OTP && (
            <>
              <Button
                block
                disabled={secondsLeft > 0}
                loading={validateCellphoneMutation.isLoading}
                type="button"
                variant="ghost"
                onClick={() => {
                  onSubmitStepOne({
                    cellphone: formStepOne.watch("cellphone")
                  })
                }}
              >
                ارسال مجدد رمز یکبار مصرف
              </Button>
              <Button
                block
                disabled={
                  validateOtpMutation.isLoading ||
                  validateCellphoneMutation.isLoading ||
                  formStepTwo.formState.isSubmitting
                }
                form="verify-otp-form"
                id="verify-otp-track-button"
                loading={
                  pageLoading ||
                  validateOtpMutation.isLoading ||
                  validateCellphoneMutation.isLoading ||
                  formStepTwo.formState.isSubmitting
                }
                type="submit"
              >
                ورود
              </Button>
            </>
          )}
          {formState !== LoginOptions.VERIFY_OTP && (
            <div className="text-sm">
              ورود شما به معنای پذیرش
              <Link
                className="text-primary underline"
                href={
                  hasPassword
                    ? `${process.env.NEXT_PUBLIC_VARDAST}/privacy`
                    : "#"
                }
                target="_blank"
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

const SigninForm = ({
  isMobileView,
  hasPassword
}: {
  isMobileView?: boolean
  hasPassword?: boolean
}) => {
  if (isMobileView) {
    return <SigninFormContent hasPassword={hasPassword} isMobileView={true} />
  }
  return (
    <Card className="gap-6 md:py-12">
      <SigninFormContent hasPassword={hasPassword} />
    </Card>
  )
}

export default SigninForm
