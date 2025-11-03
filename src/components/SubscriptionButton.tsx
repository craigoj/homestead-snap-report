'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'sonner'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface SubscriptionButtonProps {
  priceId: string
  label?: string
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function SubscriptionButton({
  priceId,
  label = 'Subscribe',
  variant = 'default',
  size = 'default',
  className,
}: SubscriptionButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
        return
      }

      const stripe = await stripePromise
      if (!stripe) {
        toast.error('Stripe failed to load')
        return
      }

      await stripe.redirectToCheckout({ sessionId: data.sessionId })
    } catch (error) {
      toast.error('Failed to start checkout')
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      {loading ? 'Loading...' : label}
    </Button>
  )
}
