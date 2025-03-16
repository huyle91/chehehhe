import Loading from '@/components/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'
import ManagementAccountTable from './managetment-staff-table'

export default function page() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
    <div className='space-y-2'>
      <Card x-chunk='dashboard-06-chunk-0'>
        <CardHeader>
          <CardTitle>Management</CardTitle>
          <CardDescription>Management staff of retaurant</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div><Loading /></div>}>
            <ManagementAccountTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  </main>
  )
}
