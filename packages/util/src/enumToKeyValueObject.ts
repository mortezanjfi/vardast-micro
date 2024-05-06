export const enumToKeyValueObject = (enumObj: any): Record<string, string> => {
  const keys = Object.keys(enumObj)
  const keyValueObj: Record<string, string> = {}

  for (const key of keys) {
    if (!isNaN(Number(key))) {
      // Skip numeric keys (assigned automatically by TypeScript)
      continue
    }

    keyValueObj[key] = enumObj[key]
  }

  return keyValueObj
}
