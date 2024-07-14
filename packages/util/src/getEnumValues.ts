export function getEnumValues<T>(enumObj: T): string[] {
  return Object.values(enumObj).filter(
    (value) => typeof value === "string"
  ) as string[]
}
