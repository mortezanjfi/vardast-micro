"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa, digitsFaToEn } from "@persian-tools/persian-tools"
import {
  usePasswordResetMutation,
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
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type Props = {}

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
          router.replace("/auth/signin/auth/signin/auth/signin")
        }

        if (nextState === "VALIDATE_OTP") {
          setValidationKey(validationKey as string)
          startCountdown(remainingSeconds as number)
          setMessage(message as string)
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
        setMessage(message as string)

        if (nextState === "VALIDATE_CELLPHONE") {
          setFormState(1)
        }

        if (nextState === "PASSWORD_RESET") {
          setFormState(3)
        }

        if (nextState === "LOGIN") {
          router.replace("/auth/signin")
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
          router.replace("/auth/signin")
        }

        setMessage(message as string)
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

      <div className="flex h-full flex-col justify-start gap-y-6 px-3 pt-[22vw] md:items-center md:pt">
        <h3 className="font-semibold">تغییر رمز عبور</h3>
        <div className="flex min-h-[calc(100vw/4)] flex-col justify-center md:mx-auto md:w-1/4">
          {formState === 1 && (
            <>
              <Form {...formStepOne}>
                <form
                  id="login-cellphone"
                  onSubmit={formStepOne.handleSubmit(onSubmitStepOne)}
                  noValidate
                  className="flex flex-1 flex-col gap-8 pb-6"
                >
                  <FormField
                    control={formStepOne.control}
                    name="cellphone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common:cellphone")}</FormLabel>
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
              <Button
                form="login-cellphone"
                type="submit"
                block
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
            </>
          )}

          {formState === 2 && (
            <>
              <Form {...formStepTwo}>
                <form
                  id="verify-otp-form"
                  onSubmit={formStepTwo.handleSubmit(onSubmitStepTwo)}
                  noValidate
                  className="flex flex-1 flex-col gap-8 pb-6"
                >
                  <FormField
                    control={formStepTwo.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common:otp")}</FormLabel>
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
                              setFormState(1)
                              formStepTwo.reset()
                            }}
                            size={"xsmall"}
                            type="button"
                            variant="ghost"
                          >
                            ویرایش شماره همراه
                          </Button>
                          <p
                            className={clsx(
                              "text-left",
                              "text-sm",
                              "text-succuss"
                            )}
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
                تایید تلفن همراه
              </Button>
            </>
          )}

          {formState === 3 && (
            <>
              <Form {...formStepThree}>
                <form
                  id="change-password-form"
                  onSubmit={formStepThree.handleSubmit(onSubmitStepThree)}
                  noValidate
                  className="flex flex-1 flex-col gap-8 pb-6"
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
              <Button
                form="change-password-form"
                type="submit"
                block
                disabled={
                  passwordResetMutation.isLoading ||
                  formStepThree.formState.isSubmitting
                }
                loading={
                  passwordResetMutation.isLoading ||
                  formStepThree.formState.isSubmitting
                }
              >
                تغییر کلمه عبور
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ResetForm
