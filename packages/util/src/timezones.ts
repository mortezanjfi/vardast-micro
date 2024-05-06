import { supportedValuesOf } from "@formatjs/intl-enumerator"

export interface Timezone {
  id: number
  title: string
}

export const timezones: Timezone[] = []

const allSupportedTimezones = supportedValuesOf("timeZone")

allSupportedTimezones.forEach((item, idx) => {
  timezones.push({
    id: idx,
    title: item
  })
})
