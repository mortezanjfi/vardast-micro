"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa, digitsFaToEn } from "@persian-tools/persian-tools"
import Link from "@vardast/component/Link"
import {
  usePasswordResetMutation,
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
  FormLabel,
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
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type Props = { isMobileView?: boolean }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ResetForm = (_: Props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(false)
  const [formState, setFormState] = useState<number>(1)
  const [validationKey, setValidationKey] = useState<string>("")
  const [errors, setErrors] = useState<ClientError | null>()
  const [message, setMessage] = useState<string>("")
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
        const { nextState, message, remainingSeconds, validationKey } =
          data.validateCellphone
        setErrors(null)

        if (nextState === "LOGIN") {
          router.replace(paths.signin)
        }

        if (nextState === "VALIDATE_OTP") {
          setValidationKey(validationKey)
          startCountdown(remainingSeconds)
          setMessage(message)
          setFormState(2)
          setPageLoading(false)
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
      onSuccess: (data) => {
        const { nextState, message } = data.validateOtp
        setErrors(null)
        setMessage(message)

        if (nextState === "VALIDATE_CELLPHONE") {
          setFormState(1)
        }

        if (nextState === "PASSWORD_RESET") {
          setFormState(3)
        }

        if (nextState === "LOGIN") {
          router.replace(paths.signin)
        }
        setPageLoading(false)
      }
    }
  )
  const passwordResetMutation = usePasswordResetMutation(
    graphqlRequestClientWithoutToken,
    {
      onError: (errors: ClientError) => {
        setPageLoading(false)
        setErrors(errors)
      },
      onSuccess: (data) => {
        const { message, nextState } = data.passwordReset
        setErrors(null)

        if (nextState === "VALIDATE_CELLPHONE") {
          setFormState(1)
        }

        if (nextState === "LOGIN") {
          router.replace(paths.signin)
        }

        setMessage(message)
      }
    }
  )

  const PasswordResetFormStepOneSchema = z.object({
    cellphone: cellphoneNumberSchema
  })
  type PasswordResetFormStepOneType = TypeOf<
    typeof PasswordResetFormStepOneSchema
  >

  const formStepOne = useForm<PasswordResetFormStepOneType>({
    resolver: zodResolver(PasswordResetFormStepOneSchema)
  })

  const PasswordResetFormStepTwoSchema = z.object({
    otp: otpSchema
  })
  type PasswordResetFormStepTwoType = TypeOf<
    typeof PasswordResetFormStepTwoSchema
  >

  const formStepTwo = useForm<PasswordResetFormStepTwoType>({
    resolver: zodResolver(PasswordResetFormStepTwoSchema)
  })

  const PasswordResetFormStepThreeSchema = z.object({
    password: z.string()
  })
  type PasswordResetFormStepThreeType = TypeOf<
    typeof PasswordResetFormStepThreeSchema
  >

  const formStepThree = useForm<PasswordResetFormStepThreeType>({
    resolver: zodResolver(PasswordResetFormStepThreeSchema)
  })

  function onSubmitStepOne(data: PasswordResetFormStepOneType) {
    setPageLoading(true)
    const { cellphone } = data
    validateCellphoneMutation.mutate({
      ValidateCellphoneInput: {
        countryId: 244,
        cellphone: digitsFaToEn(cellphone),
        validationType: ValidationTypes.PasswordReset
      }
    })
  }
  function onSubmitStepTwo(data: PasswordResetFormStepTwoType) {
    setPageLoading(true)
    const { otp } = data
    validateOtpMutation.mutate({
      ValidateOtpInput: {
        token: digitsFaToEn(otp),
        validationKey,
        validationType: ValidationTypes.PasswordReset
      }
    })
  }
  function onSubmitStepThree(data: PasswordResetFormStepThreeType) {
    setPageLoading(true)
    const { password } = data
    passwordResetMutation.mutate({
      SignupInput: {
        validationKey,
        password
      }
    })
  }

  // useEffect(() => {
  //   if (session?.status === "authenticated") {
  //     redirect(searchParams.get("callbackUrl") || "/admin")
  //   }
  // })

  return (
    <>
      {errors && (
        <Alert variant="danger">
          <LucideAlertOctagon />
          <AlertTitle>خطا</AlertTitle>
          <AlertDescription>
            {(
              errors?.response?.errors?.at(0)?.extensions
                ?.displayErrors as string[]
            )?.map((error) => <p key={error}>{error}</p>)}
          </AlertDescription>
        </Alert>
      )}

      {!errors && message && (
        <Alert variant="success">
          <AlertDescription>{digitsEnToFa(message)}</AlertDescription>
        </Alert>
      )}

      {formState === 2 ? (
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
            <h3 className="font-semibold">تغییر رمز عبور</h3>
            <Link className="btn btn-ghost btn-icon-only" href={paths.signin}>
              <LucideX className="icon h-6 w-6 text-alpha-black" />
            </Link>
          </div>
          <div className="text-md flex flex-col gap-y-2 py">
            <p className="text-alpha-800">
              لطفا شماره موبایل خود را وارد کنید.
            </p>
          </div>
        </>
      )}

      <div className="flex w-full flex-col gap-y">
        {formState === 1 && (
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
                    <Link
                      className="text-left text-sm underline"
                      href={paths.signin}
                    >
                      رمز عبور دارم
                    </Link>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </form>
          </Form>
        )}
        {formState === 2 && (
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
                    <FormLabel>{t("common:otp")}</FormLabel>
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
                          setFormState(1)
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

        {formState === 3 && (
          <Form {...formStepThree}>
            <form
              className="flex flex-1 flex-col gap-8 pb-6"
              id="change-password-form"
              noValidate
              onSubmit={formStepThree.handleSubmit(onSubmitStepThree)}
            >
              <FormField
                control={formStepThree.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:new_password")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("common:new_password")}
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </form>
          </Form>
        )}
        <div className="flex w-full flex-col gap-y">
          {formState === 1 && (
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
          {formState === 2 && (
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
                loading={
                  pageLoading ||
                  validateOtpMutation.isLoading ||
                  validateCellphoneMutation.isLoading ||
                  formStepTwo.formState.isSubmitting
                }
                type="submit"
              >
                تایید تلفن همراه
              </Button>
            </>
          )}
          {formState === 3 && (
            <Button
              block
              disabled={
                passwordResetMutation.isLoading ||
                formStepThree.formState.isSubmitting
              }
              form="change-password-form"
              loading={
                passwordResetMutation.isLoading ||
                formStepThree.formState.isSubmitting
              }
              type="submit"
            >
              تغییر کلمه عبور
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export default ResetForm
