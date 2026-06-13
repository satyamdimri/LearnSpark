import { Outlet } from 'react-router-dom'
import { PublicHeader } from './PublicHeader'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <PublicHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 pb-24 sm:px-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  )
}
