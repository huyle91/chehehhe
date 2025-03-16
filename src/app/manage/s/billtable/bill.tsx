import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import TableDetailBill from "./billtable";

export default function Bill() {
  return (
    <>
      <Card x-chunk="dashboard-06-chunk-0" style={{ marginBottom: "10px" }}>
        <CardHeader>
          <CardTitle>Payment-method</CardTitle>
          <CardDescription>Choose one payment-method</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            style={{
              display: "grid",
              alignItems: "center",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
              justifyContent: "center",
            }}
          >
            <div>
              <Card x-chunk="dashboard-06-chunk-0" style={{ marginTop: "5px" }}>
                <CardContent
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr", // Cột đầu chiếm 2 phần, cột sau chiếm 10 phần
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: "15px",
                    gap: "10px", // (Tuỳ chọn) Khoảng cách giữa các cột
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Switch id="airplane-mode" />
                  </div>
                  <div>
                    <p style={{ margin: "0" }}>By Cash</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card x-chunk="dashboard-06-chunk-0" style={{ marginTop: "5px" }}>
                <CardContent
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr", // Cột đầu chiếm 2 phần, cột sau chiếm 10 phần
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: "15px",
                    gap: "10px", // (Tuỳ chọn) Khoảng cách giữa các cột
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Switch id="airplane-mode" />
                  </div>
                  <div>
                    <p style={{ margin: "0" }}>QR code</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-06-chunk-0" style={{ marginBottom: "10px" }}>
        <CardHeader>
          <CardTitle>Order-infor</CardTitle>
          <CardDescription>Customer infor and list dishes in order</CardDescription>
        </CardHeader>
        <CardContent>
          <TableDetailBill />
        </CardContent>
      </Card>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button size="sm" className="h-7 gap-1 w-20 ">
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Paid
          </span>
        </Button>
      </div>
    </>
  );
}
