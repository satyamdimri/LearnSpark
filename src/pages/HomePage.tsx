import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Star, Users, Video } from 'lucide-react'
import { useData } from '../context/DataContext'
import { WebinarCard } from '../components/webinar/WebinarCard'
import { Button } from '../components/ui/Button'
import { StatCard } from '../components/ui/StatCard'
import { Badge } from '../components/ui/Badge'

export function HomePage() {
  const { webinars } = useData()

  const upcoming = [...webinars].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  return (
    <div className="space-y-10 animate-in">
      {/* Compact hero — not oversized */}
      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Badge variant="popular" className="mb-4">
              New webinars every week
            </Badge>
            <h1 className="mb-3 max-w-lg text-2xl font-semibold tracking-tight text-text-primary sm:text-[28px] sm:leading-tight">
              Learn AI, DevOps & coding from industry experts
            </h1>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-text-secondary">
              Live webinars with countdown registration. Weekend courses in 1, 3 & 6 month tracks.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="lg">Browse webinars</Button>
              <Link to="/courses">
                <Button variant="secondary" size="lg">
                  View courses
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 p-6 ring-1 ring-brand-100 lg:block">
            <div className="space-y-3">
              {['Live expert sessions', 'Hands-on projects', 'Weekend-friendly'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Learners" value="12,400+" />
        <StatCard label="Webinars hosted" value="86" icon={Video} />
        <StatCard label="Expert instructors" value="24" icon={Users} />
        <StatCard label="Avg. rating" value="4.8 ★" icon={Star} />
      </section>

      {/* Webinars grid */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Upcoming webinars</h2>
          <button className="flex items-center gap-1 text-xs font-medium text-text-secondary transition-colors hover:text-brand-600">
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {upcoming.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
            <Video className="mx-auto mb-3 h-8 w-8 text-text-tertiary" />
            <p className="text-sm text-text-secondary">No upcoming webinars yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>
        )}
      </section>

      {/* Courses teaser */}
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-brand-50 p-2.5 text-brand-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Weekend course tracks</h3>
              <p className="mt-0.5 text-sm text-text-secondary">
                1, 3 & 6 month programs in AI, coding, and DevOps.
              </p>
            </div>
          </div>
          <Link to="/courses">
            <Button variant="secondary">Explore courses</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
