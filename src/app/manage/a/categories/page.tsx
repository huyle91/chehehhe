
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'
import CategoriesTable from './categories-table'

export default function page() {
  return (
    <>
      <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
        <div className='space-y-2'>
          <Card x-chunk='dashboard-06-chunk-0'>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Categorization management makes food management easier</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <CategoriesTable />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
