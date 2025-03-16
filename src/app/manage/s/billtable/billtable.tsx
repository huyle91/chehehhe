"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useParams, useRouter } from "next/navigation";


interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  status: "pending" | "completed" | "cancelled";
  price: number;
}

export default function TableDetailBill() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId;

  // Mock data - thay thế bằng API call thực tế
  const tableData = {
    number: tableId,
    customer: {
      name: "Nguyễn Văn A",
      phone: "0123456789",
    },
    staff: {
      name: "Nhân viên B",
      id: "NV001",
    },
    orders: [
      { id: 1, name: "Phở bò", quantity: 2, status: "pending", price: 50000 },
      {
        id: 2,
        name: "Cơm rang",
        quantity: 1,
        status: "completed",
        price: 40000,
      },
      { id: 3, name: "Phở bò", quantity: 2, status: "pending", price: 50000 },
      {
        id: 4,
        name: "Cơm rang",
        quantity: 1,
        status: "completed",
        price: 40000,
      },
      { id: 5, name: "Phở bò", quantity: 2, status: "pending", price: 50000 },
      {
        id: 6,
        name: "Cơm rang",
        quantity: 1,
        status: "completed",
        price: 40000,
      },
    ] as OrderItem[],
  };

  const totalAmount = tableData.orders.reduce(
    (sum, order) => sum + order.price * order.quantity,
    0
  );

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-6">
        {/* Customer & Staff Info */}
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold mb-2">Thông tin khách hàng:</h2>
                <p>Tên: {tableData.customer.name}</p>
                <p>SĐT: {tableData.customer.phone}</p>
                <p>Thời gian vào: {new Date().toLocaleTimeString()}</p>
              </div>
              <div>
                <h2 className="font-semibold mb-2">Nhân viên phục vụ:</h2>
                <p>Tên: {tableData.staff.name}</p>
                <p>Mã NV: {tableData.staff.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Danh sách món đã gọi:</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên món</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đơn giá</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.price.toLocaleString()}đ</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="font-bold">
                    Tổng tiền
                  </TableCell>
                  <TableCell colSpan={2} className="font-bold">
                    {totalAmount.toLocaleString()}đ
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
