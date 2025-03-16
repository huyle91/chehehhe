import envConfig from "@/config";

export const GetTableLink = ({
  token,
  tableNumber,
  tableId,
}: {
  token: string
  tableNumber: number
  tableId: string
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL +
    `/table/` +
    tableNumber +
    '?token=' +
    token + `&tableId=` + tableId
  )
}


