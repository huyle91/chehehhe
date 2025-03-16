
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'
import PermissionTable from './permission-table'

export default function Permission() {
  return (
    <>
      <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
        <div className='space-y-2'>
          <Card x-chunk='dashboard-06-chunk-0'>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>Manage roles that use the feature system</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <PermissionTable />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
