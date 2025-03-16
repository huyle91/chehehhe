
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'
import PriceOfDishTable from './priceDishTable'
import Loading from '@/components/loading'

export default function page() {
  return (
    <>
      <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
        <div className='space-y-2'>
          <Card x-chunk='dashboard-06-chunk-0'>
            <CardHeader>
              <CardTitle>Mangement price of dish</CardTitle>
              <CardDescription>Choose dish to sell and create price</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Loading />}>
                <PriceOfDishTable />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
