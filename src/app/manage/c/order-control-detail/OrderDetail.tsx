import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderDetailTable from "./OrderDetailTable";

export default function OrderControlDetail() {
  return (
    <>
      <Card x-chunk="dashboard-06-chunk-0" style={{ marginBottom: "10px" }}>
        <CardHeader>
          <CardTitle>List dishes of Order</CardTitle>
        </CardHeader>
        <CardContent>
              <OrderDetailTable/>
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-06-chunk-0" style={{ marginBottom: "10px" }}>
        <CardHeader>
          <CardTitle>Note from customer</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Card x-chunk="dashboard-06-chunk-0" style={{ marginTop: "5px" }}>
              <CardContent className="p-3 pt-3">
                <p style={{ margin: "0" }}>
                  - Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Itaque nesciunt possimus quod officia illo eos quisquam atque
                  dolor minus dolorum sequi delectus alias, incidunt numquam
                  consequuntur, animi sint reprehenderit voluptates. Lorem,
                  ipsum dolor sit amet consectetur adipisicing elit. Unde
                  quisquam dolorem qui ratione dolor perspiciatis quaerat
                  facilis rerum consequuntur blanditiis ipsam, expedita nobis,
                  sit debitis, et exercitationem obcaecati atque placeat.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
