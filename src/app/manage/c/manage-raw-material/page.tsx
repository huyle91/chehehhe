import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import RawMaterialTable from "./RawMaterialTable";
import Loading from "@/components/loading";
export default function ManagementRaw() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Món ăn</CardTitle>
            <CardDescription>Quản lý món ăn</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div><Loading /></div>}>
              <RawMaterialTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
