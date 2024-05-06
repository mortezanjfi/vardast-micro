import useTranslation from "next-translate/useTranslation"
import { defaultErrorMap, z, ZodIssueCode, ZodParsedType } from "zod"

const jsonStringifyReplacer = (_: string, value: any): any => {
  if (typeof value === "bigint") {
    return value.toString()
  }
  return value
}

function joinValues<T extends any[]>(array: T, separator = " | "): string {
  return array
    .map((val) => (typeof val === "string" ? `'${val}'` : val))
    .join(separator)
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null) return false

  for (const key in value) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) return false
  }

  return true
}

const getKeyAndValues = (
  param: unknown,
  defaultKey: string
): {
  values: Record<string, unknown>
  key: string
} => {
  if (typeof param === "string") return { key: param, values: {} }

  if (isRecord(param)) {
    const key =
      "key" in param && typeof param.key === "string" ? param.key : defaultKey
    const values =
      "values" in param && isRecord(param.values) ? param.values : {}
    return { key, values }
  }

  return { key: defaultKey, values: {} }
}

const zodI18nMap: z.ZodErrorMap = (issue, ctx) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation("zod")

  let message: string
  message = defaultErrorMap(issue, ctx).message

  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = t("errors.invalid_type_received_undefined", {
          defaultValue: message
        })
      } else {
        message = t("errors.invalid_type", {
          expected: t(`types.${issue.expected}`, {
            defaultValue: issue.expected
          }),
          received: t(`types.${issue.received}`, {
            defaultValue: issue.received
          }),

          defaultValue: message
        })
      }
      break
    case ZodIssueCode.invalid_literal:
      message = t("errors.invalid_literal", {
        expected: JSON.stringify(issue.expected, jsonStringifyReplacer),

        defaultValue: message
      })
      break
    case ZodIssueCode.unrecognized_keys:
      message = t("errors.unrecognized_keys", {
        keys: joinValues(issue.keys, ", "),
        count: issue.keys.length,

        defaultValue: message
      })
      break
    case ZodIssueCode.invalid_union:
      message = t("errors.invalid_union", {
        defaultValue: message
      })
      break
    case ZodIssueCode.invalid_union_discriminator:
      message = t("errors.invalid_union_discriminator", {
        options: joinValues(issue.options),

        defaultValue: message
      })
      break
    case ZodIssueCode.invalid_enum_value:
      message = t("errors.invalid_enum_value", {
        options: joinValues(issue.options),
        received: issue.received,

        defaultValue: message
      })
      break
    case ZodIssueCode.invalid_arguments:
      message = t("errors.invalid_arguments", {
        defaultValue: message
      })
      break
    case ZodIssueCode.invalid_return_type:
      message = t("errors.invalid_return_type", {
        defaultValue: message
      })
      break
    case ZodIssueCode.invalid_date:
      message = t("errors.invalid_date", {
        defaultValue: message
      })
      break
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("startsWith" in issue.validation) {
          message = t(`errors.invalid_string.startsWith`, {
            startsWith: issue.validation.startsWith,

            defaultValue: message
          })
        } else if ("endsWith" in issue.validation) {
          message = t(`errors.invalid_string.endsWith`, {
            endsWith: issue.validation.endsWith,

            defaultValue: message
          })
        }
      } else {
        message = t(`errors.invalid_string.${issue.validation}`, {
          validation: t(`validations.${issue.validation}`, {
            defaultValue: issue.validation
          }),

          defaultValue: message
        })
      }
      break
    case ZodIssueCode.too_small:
      const minimum =
        issue.type === "date"
          ? new Date(issue.minimum as number)
          : issue.minimum
      message = t(
        `errors.too_small.${issue.type}.${
          issue.exact
            ? "exact"
            : issue.inclusive
              ? "inclusive"
              : "not_inclusive"
        }`,
        {
          minimum,
          count: typeof minimum === "number" ? minimum : undefined,

          defaultValue: message
        }
      )
      break
    case ZodIssueCode.too_big:
      const maximum =
        issue.type === "date"
          ? new Date(issue.maximum as number)
          : issue.maximum
      message = t(
        `errors.too_big.${issue.type}.${
          issue.exact
            ? "exact"
            : issue.inclusive
              ? "inclusive"
              : "not_inclusive"
        }`,
        {
          maximum,
          count: typeof maximum === "number" ? maximum : undefined,

          defaultValue: message
        }
      )
      break
    case ZodIssueCode.custom:
      const { key, values } = getKeyAndValues(
        issue.params?.i18n,
        "errors.custom"
      )

      message = t(key, {
        ...values,

        defaultValue: message
      })
      break
    case ZodIssueCode.invalid_intersection_types:
      message = t("errors.invalid_intersection_types", {
        defaultValue: message
      })
      break
    case ZodIssueCode.not_multiple_of:
      message = t("errors.not_multiple_of", {
        multipleOf: issue.multipleOf,

        defaultValue: message
      })
      break
    case ZodIssueCode.not_finite:
      message = t("errors.not_finite", {
        defaultValue: message
      })
      break
    default:
  }

  return { message }
}

export default zodI18nMap
