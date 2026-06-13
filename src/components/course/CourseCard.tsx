import { Calendar, Clock, Star } from 'lucide-react'
import type { Course } from '../../types'
import { Badge, categoryBadgeVariant, courseBadgeVariant } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import {
  formatBadge,
  formatBatchDate,
  formatCategory,
  formatCurrency,
  formatDuration,
} from '../../utils/format'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const badgeVariant = courseBadgeVariant(course.badge)

  return (
    <Card hover className="flex flex-col animate-in">
      <div className="mb-3 flex items-start justify-between gap-2">
        <Badge variant={categoryBadgeVariant(course.category)}>
          {formatCategory(course.category)}
        </Badge>
        {badgeVariant && (
          <Badge variant={badgeVariant}>{formatBadge(course.badge!)}</Badge>
        )}
      </div>

      <h3 className="mb-1 text-[15px] font-semibold leading-snug text-text-primary">
        {course.title}
      </h3>
      <p className="mb-3 text-xs text-text-secondary">{course.tools}</p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-text-secondary">
          <Clock className="h-3 w-3" />
          {formatDuration(course.duration)}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-text-secondary">
          <Calendar className="h-3 w-3" />
          {course.schedule === 'weekend' ? 'Weekends' : 'Weekdays'}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-text-secondary">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {course.rating}
        </span>
      </div>

      <p className="mb-4 text-xs text-text-secondary">
        Next batch:{' '}
        <strong className="font-medium text-text-primary">
          {formatBatchDate(course.batchStartDate)}
        </strong>{' '}
        · {course.schedule === 'weekend' ? 'Sat & Sun' : 'Mon–Fri'},{' '}
        {course.classTimings}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3">
        <div>
          <span className="text-base font-semibold text-success">
            {formatCurrency(course.price)}
          </span>
          {course.originalPrice > course.price && (
            <span className="ml-2 text-xs text-text-tertiary line-through">
              {formatCurrency(course.originalPrice)}
            </span>
          )}
        </div>
        <Button size="sm">Enroll now</Button>
      </div>
    </Card>
  )
}
