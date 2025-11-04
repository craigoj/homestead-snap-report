'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { Fragment } from 'react'

interface BreadcrumbItem {
  label: string
  href: string
}

export function Breadcrumb() {
  const pathname = usePathname()

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    // Split pathname and filter empty strings
    const paths = pathname.split('/').filter((path) => path)

    // If we're on the home page, don't show breadcrumbs
    if (paths.length === 0) {
      return []
    }

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/dashboard' }
    ]

    // Build breadcrumb chain
    let currentPath = ''
    paths.forEach((path, index) => {
      // Skip 'dashboard' since it's already the root
      if (path === 'dashboard') return

      currentPath += `/${path}`

      // Format the label (capitalize and replace hyphens with spaces)
      let label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      // Handle specific route labels
      if (path === 'add') label = 'Add Asset'
      if (path === 'bulk-operations') label = 'Bulk Operations'

      breadcrumbs.push({
        label,
        href: currentPath
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't render if only one breadcrumb (just Dashboard)
  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <Fragment key={crumb.href}>
              <li className="flex items-center">
                {isLast ? (
                  <span className="font-medium text-foreground">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
              {!isLast && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
