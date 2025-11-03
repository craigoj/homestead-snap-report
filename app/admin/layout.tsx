'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Layout } from '@/components/Layout'
import { Shield, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        })

        if (error) throw error

        setIsAdmin(data)

        if (!data) {
          toast.error('Access Denied', {
            description: "You don't have permission to access the admin area."
          })
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
        toast.error('Error', {
          description: 'Failed to verify admin permissions.'
        })
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      checkAdminStatus()
    }
  }, [user, authLoading])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !loading && !user) {
      router.push('/auth')
    }
  }, [authLoading, loading, user, router])

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !loading && user && isAdmin === false) {
      router.push('/dashboard')
    }
  }, [authLoading, loading, user, isAdmin, router])

  // Loading state
  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="space-y-4 w-full max-w-md p-6">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
        </div>
      </Layout>
    )
  }

  // Not authenticated
  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <h2 className="text-2xl font-bold">Authentication Required</h2>
                <p className="text-muted-foreground">
                  Redirecting to login...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  // Not admin
  if (isAdmin === false) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <h2 className="text-2xl font-bold">Access Denied</h2>
                <p className="text-muted-foreground">
                  You don't have permission to access the admin area.
                </p>
                <p className="text-sm text-muted-foreground">
                  Redirecting to dashboard...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  // Authorized - render admin pages with layout
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <Shield className="h-4 w-4" />
            <span>Admin Area</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>
        {children}
      </div>
    </Layout>
  )
}
