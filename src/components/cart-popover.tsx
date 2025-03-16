'use client'
// Import các thư viện và components cần thiết
import { ShoppingCart, MessageCircle } from 'lucide-react' // Import icons
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover" // Import components cho popup giỏ hàng
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog" // Import components cho dialog ghi chú
import { Button } from './ui/button'
import { useGetMenuByRestaurant } from "@/queries/useMenuByRestaurant" // Hook lấy dữ liệu menu
import { useAppContext } from "./app-provider"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from '@/components/cart-provider'
import { formatCurrency } from '@/lib/utils'


// Interface định nghĩa kiểu dữ liệu cho một item trong giỏ hàng




export function CartPopover() {
  // Lấy các functions và state từ cart provider
  const { cart, updateCartItem, removeFromCart, clearCart } = useCart()
  const { guest } = useAppContext()

  // State quản lý dialog ghi chú
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string>("")
  const [noteText, setNoteText] = useState("")

  // Lấy dữ liệu menu từ API
  const { data: menuData } = useGetMenuByRestaurant(
    1,
    100, // Giới hạn 100 items
    guest?.restaurant?._id || "",
    {
      sort: "createdAt",
      filter: "",
    }
  )

  const menuItems = menuData?.payload?.data?.result.filter(
    (item) => item.restaurantDishId !== null && item.isActived === true
  ) || [];

  // Tạo map để lưu trữ và truy xuất menu items dễ dàng hơn
  const menuItemsMap = new Map(
    menuItems.map(item => [item._id, item]) || []
  )
  


  // Chuyển đổi dữ liệu từ cart thành dạng dễ hiển thị hơn
  const cartItems = cart?.dish_list.map(item => {
    const menuItem = menuItemsMap.get(item.dish)
    return {
      id: item.dish,
      name: menuItem?.name || "Unknown Item",
      price: menuItem?.price || 0,
      quantity: item.dish_amount,
      image: menuItem?.image || "",
      noting: item.noting || ""
    }
  }) || []


  // Tính toán các giá trị tổng
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = 0 // Có thể thêm logic giảm giá sau
  const tax = subtotal * 0.1 // Thuế 10%
  const total = subtotal - discount + tax

  // Xử lý cập nhật số lượng sản phẩm
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    const item = cartItems.find(item => item.id === itemId)
    if (item) {
      const newQuantity = item.quantity + delta
      if (newQuantity <= 0) {
        removeFromCart(itemId)
      } else {
        updateCartItem(itemId, newQuantity, item.noting)
      }
    }
  }

  // Xử lý mở dialog ghi chú
  const handleOpenNoteDialog = (itemId: string) => {
    const item = cartItems.find(item => item.id === itemId)
    setSelectedItemId(itemId)
    setNoteText(item?.noting || "")
    setIsNoteDialogOpen(true)
  }

  // Xử lý lưu ghi chú
  const handleSaveNote = () => {
    const item = cartItems.find(item => item.id === selectedItemId)
    if (item) {
      updateCartItem(selectedItemId, item.quantity, noteText)
    }
    setIsNoteDialogOpen(false)
  }

  return (
    <>
      {/* Popover hiển thị giỏ hàng */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {/* Badge hiển thị số lượng items */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cartItems.length}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            {/* Header */}
            <h3 className="font-semibold flex justify-between">
              Current Order
              <button
                className="text-sm text-red-500"
                onClick={clearCart}
              >
                Clear All
              </button>
            </h3>

            {/* Danh sách sản phẩm trong giỏ */}
            <div className="space-y-3 max-h-60 overflow-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    {/* Nút điều chỉnh số lượng và ghi chú */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => handleUpdateQuantity(item.id.toString(), -1)}
                      >
                        -
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => handleUpdateQuantity(item.id.toString(), 1)}
                      >
                        +
                      </button>
                      <button
                        className="ml-2 text-gray-400 hover:text-gray-600"
                        onClick={() => handleOpenNoteDialog(item.id.toString())}
                      >
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>Note</span>
                        </div>
                      </button>
                    </div>
                    {/* Hiển thị ghi chú nếu có */}
                    {item.noting && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        Note: {item.noting}
                      </p>
                    )}
                  </div>
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Phần tổng kết */}
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discounts</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sales Tax (10%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>


            {/* Nút đặt hàng */}
            <div className="space-y-3">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Order Now
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>


      {/* Dialog ghi chú */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note to Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Add your special requests here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNote}>
                Save Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}