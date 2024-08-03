export enum AvailabilityStatus {
  Available = "true",
  NotAvailable = "false",
  All = ""
}

export interface StatusOption {
  status: string
  value: AvailabilityStatus
}

export const statusesOfAvailability: StatusOption[] = [
  {
    status: "دارد",
    value: AvailabilityStatus.Available
  },
  {
    status: "ندارد",
    value: AvailabilityStatus.NotAvailable
  },
  {
    status: "همه",
    value: AvailabilityStatus.All
  }
]
