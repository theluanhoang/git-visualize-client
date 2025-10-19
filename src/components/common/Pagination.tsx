'use client';

import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
  totalItems?: number
  showInfo?: boolean
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems,
  showInfo = true
}: PaginationProps) {
  const t = useTranslations('common');
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : currentPage * itemsPerPage

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {showInfo && totalItems && (
        <div className="text-sm text-muted-foreground">
          {t('showingResults', { start: startItem, end: endItem, total: totalItems })}
        </div>
      )}
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <div className="flex h-8 w-8 items-center justify-center">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className="h-8 w-8 p-0"
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
