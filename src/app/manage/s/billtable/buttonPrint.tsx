'use client'
import { Button } from "@/components/ui/button";

export default function ButtonPrint() {
  return (
    <>
      <Button size="sm" className="h-7 gap-1" onClick={() => alert("print r an hoai")}>
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Print Bill
        </span>
      </Button>
    </>
  );
}
