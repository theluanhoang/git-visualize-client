'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { tokenUtils } from '@/lib/api/axios'
import { authStorage } from '@/services/auth'

export function SessionExpiredDialog() {
  const [showDialog, setShowDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleAuthError = () => {
      setShowDialog(true)
    }

    const stored = authStorage.load()
    if (stored.tokens?.accessToken && stored.tokens?.refreshToken) {
      const isAccessTokenExpired = tokenUtils.isTokenExpired(stored.tokens.accessToken)
      const isRefreshTokenExpired = tokenUtils.isTokenExpired(stored.tokens.refreshToken)
      
      if (isAccessTokenExpired && isRefreshTokenExpired) {
        setShowDialog(true)
      }
    }

    window.addEventListener('auth:session-expired', handleAuthError)
    
    return () => {
      window.removeEventListener('auth:session-expired', handleAuthError)
    }
  }, [])

  const handleConfirm = () => {
    setShowDialog(false)
    
    localStorage.removeItem('auth:access')
    localStorage.removeItem('auth:refresh')
    localStorage.removeItem('auth:user')
    localStorage.removeItem('auth:oauth-session')
    
    router.replace('/auth/login')
  }

  return (
    <Dialog open={showDialog} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <DialogTitle>Phiên đăng nhập đã hết hạn</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            Phiên đăng nhập của bạn đã hết hạn vì lý do bảo mật. 
            Vui lòng đăng nhập lại để tiếp tục sử dụng ứng dụng.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            onClick={handleConfirm}
            className="w-full"
          >
            Đăng nhập lại
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
