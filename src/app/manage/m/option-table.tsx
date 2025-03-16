import { QRCodeTable } from "@/components/QRCodeTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useDeleteTableMutation } from "@/queries/useTable";
import { DeleteType } from "@/schemaValidations/permission.schema";
import { TableItemType } from "@/schemaValidations/table.schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TableUpdate from "./update-table";

export default function OptionTable({
  table,
  setTable,
}: {
  table: TableItemType | undefined;
  setTable: (values: TableItemType | undefined) => void;
}) {
  const route = useRouter();

  const [deleteTable, setDeleteTable] = useState<DeleteType | undefined>();
  const [tableObjectEdit, setTableObjectEdit] = useState<TableItemType>();
  const [idTable, setIsTable] = useState<string>();
  const handleViewDetail = () => {
    route.push(`m/table/${table?.table_number}`);
  };

  const handleDeleteTable = () => {
    if (table?._id) {
      setDeleteTable({
        id: table?._id as string,
        name: String(table?.table_number),
      });
    }
  };

  const handleUpdateTable = () => {
    setTableObjectEdit(table);
    setIsTable(table?._id);
  };

  return (
    <>
      <AlertDialogDeleteTable
        TabletDelete={deleteTable}
        setTableDelete={setDeleteTable}
      />
      <TableUpdate
        id={idTable}
        setID={setIsTable}
        objectToEdit={tableObjectEdit as TableItemType}
      />
      <Dialog
        open={Boolean(table)}
        onOpenChange={(value) => {
          if (!value) {
            setTable(undefined);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Update Restaurant</DialogTitle>
            <DialogDescription>
              Fields name, address, Phone is required
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center alight-center gap-3 flex-wrap flex-col h-100% w-100%">
            <div className="flex justify-center alight-center gap-3 flex-wrap  h-100% w-100%">
              <QRCodeTable
                tableNumber={table?.table_number as number}
                token={table?.token as string}
                tableId={table?._id as string}
              />
            </div>
            <div className="flex justify-center alight-center gap-3 flex-wrap h-100% w-100%">
              <Button variant={"outline"} onClick={() => handleViewDetail()}>
                Detail table
              </Button>
              <Button variant={"update"} onClick={() => handleUpdateTable()}>
                Update
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => handleDeleteTable()}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AlertDialogDeleteTable({
  TabletDelete,
  setTableDelete,
}: {
  TabletDelete: DeleteType | undefined;
  setTableDelete: (value: DeleteType | undefined) => void;
}) {
  const deleteTable = useDeleteTableMutation();

  const handleDeleteCategory = async () => {
    try {
      const idTable = TabletDelete?.id as string;
      const resDelete = await deleteTable.mutateAsync(idTable);
      // console.log("dataDelte", permissionDelete);
      if (resDelete && resDelete.payload) {
        setTableDelete(undefined);
        toast({
          description: "Table is deleted",
          duration: 1200,

        });
      } else {
        toast({
          description: "delete is not successfull",
          duration: 1200,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("error", error);
      toast({
        description: "error at delete is failed",
        duration: 1200,
        variant: "destructive",
      });
    }
  };
  return (
    <AlertDialog
      open={Boolean(TabletDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setTableDelete(undefined);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Table</AlertDialogTitle>
          <AlertDialogDescription>
            Table{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {TabletDelete?.name}
            </span>{" "}
            Is Table will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteCategory}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
