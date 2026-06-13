import { useMemo, useState } from 'react'
import { Brain, Code, Server } from 'lucide-react'
import { useData } from '../context/DataContext'
import { CourseCard } from '../components/course/CourseCard'
import { FilterPill } from '../components/ui/FilterPill'
import type { Category, Duration } from '../types'

type CategoryFilter = Category | 'all'
type DurationFilter = Duration | 'all'

export function CoursesPage() {
  const { courses } = useData()
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [duration, setDuration] = useState<DurationFilter>('all')
  const [weekendOnly, setWeekendOnly] = useState(false)

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const catMatch = category === 'all' || c.category === category
      const durMatch = duration === 'all' || c.duration === duration
      const schedMatch = !weekendOnly || c.schedule === 'weekend'
      return catMatch && durMatch && schedMatch
    })
  }, [courses, category, duration, weekendOnly])

  return (
    <div className="animate-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Structured weekend programs with live instruction and projects.
        </p>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
            Category
          </span>
          <FilterPill active={category === 'all'} onClick={() => setCategory('all')}>
            All
          </FilterPill>
          <FilterPill active={category === 'ai'} onClick={() => setCategory('ai')}>
            <Brain className="mr-1 inline h-3 w-3" />
            AI & ML
          </FilterPill>
          <FilterPill active={category === 'coding'} onClick={() => setCategory('coding')}>
            <Code className="mr-1 inline h-3 w-3" />
            Coding
          </FilterPill>
          <FilterPill active={category === 'devops'} onClick={() => setCategory('devops')}>
            <Server className="mr-1 inline h-3 w-3" />
            DevOps
          </FilterPill>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
            Duration
          </span>
          {(['all', '1m', '3m', '6m'] as const).map((d) => (
            <FilterPill
              key={d}
              active={duration === d}
              onClick={() => setDuration(d)}
            >
              {d === 'all' ? 'All' : d === '1m' ? '1 month' : d === '3m' ? '3 months' : '6 months'}
            </FilterPill>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
            Schedule
          </span>
          <FilterPill active={weekendOnly} onClick={() => setWeekendOnly((v) => !v)}>
            Weekend only
          </FilterPill>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
          <p className="text-sm text-text-secondary">No courses match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
