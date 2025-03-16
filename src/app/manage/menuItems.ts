import { Role } from "@/constants/type";
import {
  ChefHat,
  Fish,
  History,
  Home,
  Lock,
  Salad,
  Sandwich,
  Sheet,
  Shield,
  SquareStack,
  Table,
  Users2,
  UsersRound,
  Utensils,
} from "lucide-react";

const menuItems = [
  //Admin
  {
    title: "Dashboard",
    Icon: Home,
    href: "/manage/a/dashboard",
    roles: [Role.Admin],
  },
  {
    title: "Restaurant",
    Icon: ChefHat,
    href: "/manage/a/restaurants",
    roles: [Role.Admin],
  },
  {
    title: "Accounts",
    Icon: Users2,
    href: "/manage/a/accounts",
    roles: [Role.Admin],
  },
  {
    title: "Categories",
    Icon: SquareStack,
    href: "/manage/a/categories",
    roles: [Role.Admin],
  },
  {
    title: "Dishes",
    Icon: Salad,
    href: "/manage/a/dishes",
    roles: [Role.Admin],
  },
  {
    title: "Permissions",
    Icon: Lock,
    href: "/manage/a/permissions",
    roles: [Role.Admin],
  },
  {
    title: "Role",
    Icon: Shield,
    href: "/manage/a/role",
    roles: [Role.Admin],
  },
  //Manager
  {
    title: "Table checking",
    Icon: Table,
    href: "/manage/m",
    roles: [Role.Manager],
  },
  {
    title: "order history a day",
    Icon: History,
    href: "/manage/m/orders-history",
    roles: [Role.Manager],
  },
  {
    title: "management-staff",
    Icon: UsersRound ,
    href: "/manage/m/management-staff",
    roles: [Role.Manager],
  },
  //Staff
  {
    title: "Tracking dishes",
    Icon: Sheet,
    href: "/manage/s/tracking",
    roles: [Role.Staff],
  },

  //Chef
  {
    title: "List Order",
    Icon: Sandwich,
    href: "/manage/c/order-control",
    roles: [Role.Chef],
  },
  {
    title: "Mangement Raw Material",
    Icon: Fish,
    href: "/manage/c/manage-raw-material",
    roles: [Role.Chef],
  },
  {
    title: "Mangement Price Of Dish",
    Icon: Utensils,
    href: "/manage/m/price-of-dish",
    roles: [Role.Manager],
  },
];

export default menuItems;
