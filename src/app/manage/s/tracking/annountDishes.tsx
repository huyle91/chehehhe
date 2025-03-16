"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AnnountDishes() {
  const [open, setOpen] = useState(false);
  const route = useRouter()
  const ClickToPrintBill = () => {
    route.push("/manage/s/billtable")
  }
  return (
    <>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <div
            style={{
              position: "relative",
              height: "50px",
              width: "30px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Bell />
            <div
              style={{
                borderRadius: "50%",
                backgroundColor: "#F33D3E",
                fontSize: "100",
                position: "absolute",
                right: "0",
                top: "0",
                color: "white",
                height: "20px",
                width: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              9+
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>List note of table</DialogTitle>
            <DialogDescription>Note of table from customer</DialogDescription>
          </DialogHeader>
          <Card x-chunk="dashboard-06-chunk-0" style={{ cursor: "pointer" }} onClick={ClickToPrintBill}>
            <CardHeader className="p-3">
              <div style={{ display: "flex", justifyContent: 'space-between' }}>
                <CardTitle style={{ display: 'flex', alignItems: 'center' }}>table 1</CardTitle>
                <div style={{ padding: "5px", borderRadius: "5px", background: "#FAE9EA" }}>
                  dynamic Status
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card x-chunk="dashboard-06-chunk-0" style={{ cursor: "pointer" }}>
            <CardHeader className="p-3">
              <div style={{ display: "flex", justifyContent: 'space-between' }}>
                <CardTitle style={{ display: 'flex', alignItems: 'center' }}>table 2</CardTitle>
                <div style={{ padding: "5px", borderRadius: "5px", background: "#FAE9EA" }}>
                  dynamic Status
                </div>
              </div>
            </CardHeader>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}
