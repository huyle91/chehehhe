import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import OrderControlDetail from "./OrderDetail";
import Loading from "@/components/loading";

export default function page() {
  return (
    <>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="space-y-2">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <CardTitle>Order detail</CardTitle>
                  <CardDescription>
                    Show List dishes of Order and note from customer
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div><Loading /></div>}>
                <OrderControlDetail />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
