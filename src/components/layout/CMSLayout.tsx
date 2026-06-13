import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  BookOpen,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Video,
  Zap,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '../../utils/cn'

const navItems = [
  { to: '/cms', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/cms/webinars', label: 'Webinars', icon: Video },
  { to: '/cms/courses', label: 'Courses', icon: BookOpen },
  { to: '/cms/registrations', label: 'Registrations', icon: Users },
  { to: '/cms/payments', label: 'Payments', icon: CreditCard },
]

export function CMSLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border bg-white px-3 py-5 lg:flex">
          <div className="mb-6 flex items-center gap-2 border-b border-border pb-4 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600">
              <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-semibold">LearnSpark CMS</span>
          </div>

          <nav className="flex flex-1 flex-col gap-0.5">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors',
                    isActive
                      ? 'bg-gray-100 font-medium text-text-primary'
                      : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary',
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-0.5 border-t border-border pt-3">
            <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-text-secondary hover:bg-gray-50 hover:text-text-primary">
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-text-secondary hover:bg-gray-50 hover:text-text-primary">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white/90 px-4 py-3 backdrop-blur-md lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold">CMS</span>
            </div>
            <Link
              to="/"
              className="ml-auto flex items-center gap-1.5 text-xs text-text-secondary transition-colors hover:text-text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to site
            </Link>
          </header>

          <div className="border-b border-border bg-white px-4 py-2 lg:hidden">
            <nav className="flex gap-1 overflow-x-auto pb-1">
              {navItems.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-text-secondary',
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <main className="flex-1 p-4 pb-24 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
