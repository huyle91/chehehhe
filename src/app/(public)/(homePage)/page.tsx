import { Suspense } from "react";
import categoryApiRequest from "@/apiRequest/category";
import { dishApiRequest } from "@/apiRequest/dish";
import HomeContainer from "./home-container";

/// call api form server at the first time next project run to avoid blank UI error 

async function fetchCategories() {
  try {
    const categoryData = await categoryApiRequest.getAllcategory(1, 20, {
      sort: "",
      filter: "",
    });
    return categoryData?.result || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}



async function fetchDishes() {
  
  try {
    const dishData = await dishApiRequest.getAllDish(1, 6, {
      sort: "",
      filter: "",
    });
    return dishData?.result || [];
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return [];
  }
}


export default async function Page() {
  const categories = await fetchCategories();
  const dishes = await fetchDishes();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContainer categories={categories} dishes={dishes} />
    </Suspense>
  );
}
