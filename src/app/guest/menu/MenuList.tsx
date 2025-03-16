"use client";
import { useState } from "react";
import Image from "next/image";
import { HelpCircle, ShoppingCart } from "lucide-react";
import { CartPopover } from "@/components/cart-popover";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetCategory } from "@/queries/useCategory";
import { useAppContext } from "@/components/app-provider";
import { useGetMenuByRestaurant } from "@/queries/useMenuByRestaurant";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/components/cart-provider";

export default function Menu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { guest } = useAppContext();
  const { addToCart } = useCart();


  // Add state for quantities
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (
    itemId: string,
    delta: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta),
    }));
  };
  // Hàm xử lý thêm món ăn vào giỏ hàng
  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    // Ngăn sự kiện click lan truyền lên các phần tử cha
    e.stopPropagation();


    // Kiểm tra nếu số lượng món ăn > 0 thì mới thêm vào giỏ
    if (quantities[item._id] > 0) {
      // Gọi hàm addToCart từ useCart hook để thêm món vào giỏ
      // với tham số là id món ăn và số lượng
      addToCart(item._id, quantities[item._id]);


      // Reset số lượng về 0 sau khi thêm vào giỏ
      setQuantities((prev) => ({
        ...prev,
        [item._id]: 0,
      }));
    }
  };

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All Items"
  );

  const { data: categoryRestaurant } = useGetCategory(1, 10, {
    sort: "createdAt",
    filter: "",
  });

  const { data: menuItems } = useGetMenuByRestaurant(
    1,
    10,
    guest?.restaurant?._id || "",

    {
      sort: "createdAt",
      filter: "",
      category: selectedCategory === "All Items" ? undefined : selectedCategory,
    }
  );

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", categoryId);
    router.push(`?${params.toString()}`);
  };

  const listMenu =
    menuItems?.payload?.data?.result.filter(

      (item) => item.restaurantDishId !== null && item.isActived === true

    ) || [];

  return (
    <div className="min-h-screen bg-gray-800 bg-opacity-50 bg-blend-overlay bg-[url('https://www.shibanovel.com/wp-content/uploads/2020/03/%C3%89%C3%A3%C3%8D%C2%BC%C3%8D%C3%B8_501406207-1-scaled-2048x1366.jpg')] bg-cover bg-center bg-fixed">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
        {/* Left Section - Menu */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-orange-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="8" r="6" />
                <path d="M4 19a8 8 0 0 1 16 0" />
                <path d="M8 12c0 2 2 4 4 4s4-2 4-4" />
              </svg>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {guest?.restaurant?.name}
                </h1>
                <p className="text-gray-300 text-sm">
                  Location at District 1, HCM
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CartPopover />
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            <button
              key="all"
              onClick={() => handleCategoryClick("All Items")}
              className={`px-6 py-2 rounded-full whitespace-nowrap
                ${"All Items" === selectedCategory
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600"
                }`}
            >
              All Items
            </button>
            {categoryRestaurant?.result.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
                className={`px-6 py-2 rounded-full whitespace-nowrap
                  ${category._id === selectedCategory
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto md:max-h-none md:overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listMenu?.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center bg-white p-4 rounded-lg cursor-pointer transition-colors relative"
                  onClick={() => router.push(`/guest/menu/${item._id}`)}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {item.description}
                      </p>
                      <p className="text-orange-500 font-semibold mt-2">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <div
                      className="flex items-center bg-gray-100 rounded-lg p-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="p-1 hover:bg-gray-200 rounded-md"
                        onClick={(e) => handleQuantityChange(item._id, -1, e)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <span className="w-8 text-center text-gray-700">
                        {quantities[item._id] || 0}
                      </span>
                      <button
                        className="p-1 hover:bg-gray-200 rounded-md"
                        onClick={(e) => handleQuantityChange(item._id, 1, e)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    <button
                      className="p-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={(e) => handleAddToCart(e, item)}
                      disabled={!quantities[item._id]}
                    >
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
