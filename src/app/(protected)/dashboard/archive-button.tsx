'use client'

import { api } from '@/trpc/react'
import React from 'react'
import useProject from '@/hooks/use-project'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import useRefetch from '@/hooks/use-refetch'
import { Archive, Loader2 } from 'lucide-react'

const ArchiveButton = () => {
  const archiveProject = api.project.archiveProject.useMutation()
  const { projectId } = useProject()
  const refetch = useRefetch()

  const handleArchive = () => {
    const confirmed = confirm('Êtes-vous sûr de vouloir archiver ce projet ? Cette action est irréversible.')
    if (confirmed) {
      archiveProject.mutate(
        { projectId },
        {
          onSuccess: () => {
            toast.success('Projet archivé')
            refetch()
          },
          onError: () => {
            toast.error("Erreur lors de l'archivage du projet")
          }
        }
      )
    }
  }

  return (
    <Button
      disabled={archiveProject.isPending}
      size='sm'
      variant='destructive'
      onClick={handleArchive}
      className='cursor-pointer'
    >
      {archiveProject.isPending ? (
        <>
          <Loader2 className='w-4 h-4 animate-spin mr-2' />
          Archivage...
        </>
      ) : (
        <>
          Archiver
          <Archive className='w-4 h-4 ml-2' />
        </>
      )}
    </Button>
  )
}

export default ArchiveButton
