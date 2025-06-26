/* eslint-disable @typescript-eslint/no-floating-promises */
'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import useProject from '@/hooks/use-project'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Copy, Users, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const InviteButton = () => {
  const { projectId } = useProject()
  const [open, setOpen] = React.useState(false)
  const [inviteUrl, setInviteUrl] = React.useState('')
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined' && projectId) {
      setInviteUrl(`${window.location.origin}/join/${projectId}`)
    }
  }, [projectId])

  const handleCopy = async () => {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      toast.success('Lien d\'invitation copié dans le presse-papiers !')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Erreur lors de la copie dans le presse-papiers')
    }
  }
    // http://localhost:3000/join/cmc7tgfmw0000rysotpqf1p7l

  const handleOpenDialog = () => {
    setOpen(true)
    setCopied(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">Inviter des membres</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Partagez ce lien avec votre équipe pour collaborer
                </p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Lien d&apos;invitation</label>
              <div className="flex gap-2">
                <Input
                  className="flex-1 font-mono text-sm"
                  readOnly
                  value={inviteUrl}
                  placeholder="Génération du lien d'invitation..."
                />
                <Button
                  size="sm"
                  variant={copied ? "default" : "outline"}
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copier
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 rounded">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">Comment ça marche</p>
                  <p className="text-sm text-blue-700">
                    Lorsqu&apos;un utilisateur clique sur ce lien, il pourra rejoindre votre projet et commencer à collaborer immédiatement.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                Tout le monde avec le lien peut rejoindre
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Button 
        size="sm" 
        onClick={handleOpenDialog}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Users className="h-4 w-4 mr-2" />
        Inviter des membres
      </Button>
    </>
  )
}

export default InviteButton
