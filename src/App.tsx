import { NavLink, Route, Routes } from 'react-router-dom'
import { BookOpen, Home, LayoutDashboard } from 'lucide-react'
import { PublicLayout } from './components/layout/PublicLayout'
import { CMSLayout } from './components/layout/CMSLayout'
import { HomePage } from './pages/HomePage'
import { CoursesPage } from './pages/CoursesPage'
import { DashboardPage } from './pages/cms/DashboardPage'
import { CMSWebinarsPage } from './pages/cms/CMSWebinarsPage'
import { CMSCoursesPage } from './pages/cms/CMSCoursesPage'
import { RegistrationsPage } from './pages/cms/RegistrationsPage'
import { PaymentsPage } from './pages/cms/PaymentsPage'
import { cn } from './utils/cn'

const devNav = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/cms', label: 'CMS Portal', icon: LayoutDashboard },
]

function DevNav() {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <nav className="flex items-center gap-1 rounded-full border border-border bg-white/95 p-1.5 shadow-lg shadow-gray-900/10 backdrop-blur-md">
        {devNav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150',
                isActive
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary',
              )
            }
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
        </Route>
        <Route path="cms" element={<CMSLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="webinars" element={<CMSWebinarsPage />} />
          <Route path="courses" element={<CMSCoursesPage />} />
          <Route path="registrations" element={<RegistrationsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
        </Route>
      </Routes>
      <DevNav />
    </>
  )
}
