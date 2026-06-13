import { Link, NavLink } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'

const navLinks = [
  { to: '/', label: 'Webinars', end: true },
  { to: '/courses', label: 'Courses' },
  { to: '#', label: 'About' },
  { to: '#', label: 'Blog' },
]

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-sm shadow-brand-600/30">
            <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">LearnSpark</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) =>
            link.to.startsWith('#') ? (
              <span
                key={link.label}
                className="cursor-default text-sm text-text-secondary"
              >
                {link.label}
              </span>
            ) : (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'text-sm transition-colors',
                    isActive
                      ? 'font-medium text-text-primary'
                      : 'text-text-secondary hover:text-text-primary',
                  )
                }
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Login
          </Button>
          <Button size="sm">Sign up free</Button>
        </div>
      </div>
    </header>
  )
}
