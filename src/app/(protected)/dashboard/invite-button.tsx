'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import useProject from '@/hooks/use-project'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const InviteButton = () => {
  const { projectId } = useProject()
  const [open, setOpen] = React.useState(false)
  const [inviteUrl, setInviteUrl] = React.useState('')

  React.useEffect(() => {
    if (typeof window !== 'undefined' && projectId) {
      setInviteUrl(`${window.location.origin}/join/${projectId}`)
    }
  }, [projectId])

  const handleCopy = () => {
    if (!inviteUrl) return
    navigator.clipboard.writeText(inviteUrl)
    toast.success('Copied to clipboard')
    setOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a team member</DialogTitle>
          </DialogHeader>
          <p className='text-sm text-gray-500'>
            Invite a team member to your project. Share this link with them to join.
          </p>
          <Input
            className='mt-4'
            readOnly
            value={inviteUrl}
            onClick={handleCopy}
          />
        </DialogContent>
      </Dialog>
      <Button size='sm' onClick={() => setOpen(true)}>
        Invite Members
      </Button>
    </>
  )
}

export default InviteButton
