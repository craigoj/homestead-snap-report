'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Settings } from 'lucide-react'

interface ManageSubscriptionButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showIcon?: boolean
}

export function ManageSubscriptionButton({
  variant = 'outline',
  size = 'default',
  className,
  showIcon = true,
}: ManageSubscriptionButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleManage = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      toast.error('Failed to open billing portal')
      console.error('Portal error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleManage}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      {showIcon && <Settings className="mr-2 h-4 w-4" />}
      {loading ? 'Loading...' : 'Manage Subscription'}
    </Button>
  )
}
