import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import TableManage from "./table-manage";
import Loading from "@/components/loading";
export default function page() {

  return (
    <>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <div>
                <CardTitle>Table</CardTitle>
                <CardDescription>Management Table</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Loading />}>
              <TableManage />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
