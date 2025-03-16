'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ChevronLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

interface OrderItem {
  id: number
  name: string
  quantity: number
  status: 'pending' | 'completed' | 'cancelled'
  price: number
}

export default function TableDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tableId = params.tableId
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  // Mock data - thay thế bằng API call thực tế
  const tableData = {
    number: tableId,
    customer: {
      name: "Nguyễn Văn A",
      phone: "0123456789"
    },
    staff: {
      name: "Nhân viên B",
      id: "NV001"
    },
    orders: [
      { id: 1, name: "Phở bò", quantity: 2, status: "pending", price: 50000 },
      { id: 2, name: "Cơm rang", quantity: 1, status: "completed", price: 40000 },
      { id: 1, name: "Phở bò", quantity: 2, status: "pending", price: 50000 },
      { id: 2, name: "Cơm rang", quantity: 1, status: "completed", price: 40000 },
      { id: 1, name: "Phở bò", quantity: 2, status: "pending", price: 50000 },
      { id: 2, name: "Cơm rang", quantity: 1, status: "completed", price: 40000 },
    ] as OrderItem[]
  }

  const totalAmount = tableData.orders.reduce((sum, order) => sum + order.price * order.quantity, 0)

  const handleChangeQR = () => {
    // Xử lý logic đổi mã QR ở đây
    setShowQRDialog(false)
  }

  const handleChangeStatus = () => {
    // Xử lý logic đổi trạng thái ở đây
    setShowStatusDialog(false)
  }

  return (
    <div className="p-6">
      <AlertDialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đổi mã QR</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đổi mã QR cho bàn {tableData.number}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleChangeQR}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Đổi trạng thái bàn</AlertDialogTitle>
            <AlertDialogDescription>
              Chọn trạng thái mới cho bàn {tableData.number}:
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  variant={selectedStatus === 'available' ? 'default' : 'outline'}
                  className={`bg-green-100 hover:bg-green-200 text-green-800 transition-transform ${selectedStatus === 'available' ? 'font-bold scale-105' : ''
                    }`}
                  onClick={() => setSelectedStatus('available')}
                >
                  Available
                </Button>
                <Button
                  variant={selectedStatus === 'pending' ? 'default' : 'outline'}
                  className={`bg-yellow-100 hover:bg-yellow-200 text-yellow-800 transition-transform ${selectedStatus === 'pending' ? 'font-bold scale-105' : ''
                    }`}
                  onClick={() => setSelectedStatus('pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={selectedStatus === 'cleaning' ? 'default' : 'outline'}
                  className={`bg-yellow-100 hover:bg-yellow-200 text-yellow-800 transition-transform ${selectedStatus === 'cleaning' ? 'font-bold scale-105' : ''
                    }`}
                  onClick={() => setSelectedStatus('cleaning')}
                >
                  Cleaning
                </Button>
                <Button
                  variant={selectedStatus === 'not-use' ? 'default' : 'outline'}
                  className={`bg-red-100 hover:bg-red-200 text-red-800 transition-transform ${selectedStatus === 'not-use' ? 'font-bold scale-105' : ''
                    }`}
                  onClick={() => setSelectedStatus('not-use')}
                >
                  Not Use
                </Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedStatus('')}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleChangeStatus}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bàn {tableData.number}</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setShowQRDialog(true)}>
            Đổi mã QR
          </Button>
          <Button onClick={() => setShowStatusDialog(true)}>
            Đổi trạng thái
          </Button>
        </div>
      </div>

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
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.price.toLocaleString()}đ</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'}`}>
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="font-bold">Tổng tiền</TableCell>
                  <TableCell colSpan={2} className="font-bold">{totalAmount.toLocaleString()}đ</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
      <Button
        variant="ghost"
        className="mt-[30px] mb-4 bg-gray-200"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
    </div>
  )
}