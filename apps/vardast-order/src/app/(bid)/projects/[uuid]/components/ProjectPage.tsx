"use client"

import { useState } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import Table from "@vardast/component/table/Table"
import { ITableProps } from "@vardast/component/table/type"
import useTable from "@vardast/component/table/useTable"
import {
  Project,
  ProjectAddress,
  useFindOneProjectQuery,
  User
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import useTranslation from "next-translate/useTranslation"

import AddressDeleteModal from "@/app/(bid)/projects/components/address/AddressDeleteModal"
import { AddressModal } from "@/app/(bid)/projects/components/address/AddressModal"
import UserDeleteModal from "@/app/(bid)/projects/components/user/UserDeleteModal"
import { UserModal } from "@/app/(bid)/projects/components/user/UserModal"

import ProjectInfo from "./ProjectInfo"

enum SelectedItemEnum {
  DELETE_ADDRESS,
  ADDRESS,
  DELETE_USER,
  USER
}

type SelectedItem<T = undefined> = {
  type: SelectedItemEnum
  data?: T extends ProjectAddress ? ProjectAddress : User
}
export type ProjectAddressCartProps<T> = {
  isMobileView?: boolean
  row: SelectedItem<T>
  onCloseModal: (_?: any) => void
  uuid: string
}

export enum PROJECT_TAB {
  INFO = "info",
  ADDRESSES = "addresses",
  PROJECT_USERS = "project-colleagues"
}

interface IProjectPageProps {
  uuid?: string
}

export interface IProjectPageSectionProps<T = undefined>
  extends IProjectPageProps {
  onCloseModal: () => void
  row: SelectedItem<T>
}

export interface IProjectPageSectionModalProps<T>
  extends IProjectPageSectionProps<T> {
  open: boolean
}

const ProjectPage = ({ uuid }: IProjectPageProps) => {
  const { t } = useTranslation()
  const [row, setRow] = useState<SelectedItem>()

  const onCloseModal = () => {
    setRow(undefined)
  }

  const onOpenModal = <T,>(row: SelectedItem<T>) => {
    setRow(row)
  }

  const findOneProjectQuery = useFindOneProjectQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  const addressTableProps: ITableProps<
    ProjectAddress,
    undefined,
    undefined,
    Project
  > = useTable({
    model: {
      name: "project-address",
      container: {
        button: {
          onClick: () => {
            onOpenModal({
              type: SelectedItemEnum.ADDRESS,
              data: undefined
            })
          },
          text: t("common:add_new_entity", {
            entity: t("common:address")
          })
        },
        title: t(`common:addresses`)
      },
      onRow: {
        onClick: (row) =>
          onOpenModal<ProjectAddress>({
            type: SelectedItemEnum.ADDRESS,
            data: row.original
          })
      },
      fetch: {
        directData: {
          data: findOneProjectQuery.data?.findOneProject?.address.map(
            (item) => ({ ...item.address }) as ProjectAddress
          ),
          directLoading:
            findOneProjectQuery.isLoading || findOneProjectQuery.isFetching
        }
      },
      columns: [
        {
          id: "title",
          header: t("common:title"),
          accessorKey: "title"
        },
        {
          id: "address",
          header: t("common:address"),
          cell: ({ row }) => {
            return (
              <div className="whitespace-pre-wrap">
                {row?.original?.address}
              </div>
            )
          }
        },
        {
          header: t("common:transferee"),
          accessorKey: "delivery_name"
        },
        {
          header: t("common:transferee-number"),
          accessorKey: "delivery_contact"
        },
        {
          id: "action",
          header: t("common:operation"),
          cell: ({ row }) => {
            return (
              <Button
                variant="danger"
                size="small"
                onClick={() => {
                  onOpenModal<ProjectAddress>({
                    type: SelectedItemEnum.DELETE_ADDRESS,
                    data: row.original
                  })
                }}
              >
                {t("common:delete")}
              </Button>
            )
          }
        }
      ]
    }
  })

  const usersTableProps: ITableProps<User, undefined, undefined, Project> =
    useTable({
      model: {
        name: "project-users",
        container: {
          button: {
            onClick: () => {
              onOpenModal<User>({
                type: SelectedItemEnum.USER,
                data: undefined
              })
            },
            text: t("common:add_new_entity", {
              entity: t("common:colleague")
            })
          },
          title: t(`common:colleagues`)
        },
        fetch: {
          directData: {
            data: findOneProjectQuery.data?.findOneProject?.user.map(
              (item) => ({ ...item.user })
            ),
            directLoading:
              findOneProjectQuery.isLoading || findOneProjectQuery.isFetching
          }
        },
        columns: [
          {
            id: "fullName",
            header: t("common:name"),
            accessorFn: ({ fullName }) => digitsEnToFa(fullName || "-")
          },
          {
            id: "delivery_name",
            header: t("common:cellphone"),
            accessorFn: ({ cellphone }) => digitsEnToFa(cellphone || "-")
          },
          {
            id: "action",
            header: t("common:operation"),
            cell: ({ row }) => {
              return (
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => {
                    onOpenModal<User>({
                      type: SelectedItemEnum.DELETE_USER,
                      data: row.original
                    })
                  }}
                >
                  {t("common:delete")}
                </Button>
              )
            }
          }
        ]
      }
    })

  const sectionProps: IProjectPageSectionProps = { uuid, onCloseModal, row }

  return (
    <>
      <AddressDeleteModal
        open={row?.type === SelectedItemEnum.DELETE_ADDRESS}
        {...sectionProps}
      />
      <AddressModal
        open={row?.type === SelectedItemEnum.ADDRESS}
        {...sectionProps}
      />
      <UserDeleteModal
        open={row?.type === SelectedItemEnum.DELETE_USER}
        {...sectionProps}
      />
      <UserModal open={row?.type === SelectedItemEnum.USER} {...sectionProps} />
      <ProjectInfo
        name={findOneProjectQuery.data?.findOneProject?.name}
        {...sectionProps}
      />
      <Table {...addressTableProps} />
      <Table {...usersTableProps} />
    </>
  )
}

export default ProjectPage
