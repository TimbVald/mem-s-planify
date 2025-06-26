/* eslint-disable @typescript-eslint/no-floating-promises */
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
      className='cursor-pointer group relative overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 shadow-md'
    >
      <div className='absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out' />
      <div className='relative flex items-center justify-center gap-2'>
        {archiveProject.isPending ? (
          <>
            <Loader2 className='w-4 h-4 animate-spin transition-all duration-300' />
            <span className='font-medium'>Archivage...</span>
          </>
        ) : (
          <>
            <span className='font-medium'>Archiver</span>
            <Archive className='w-4 h-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110' />
          </>
        )}
      </div>
    </Button>
  )
}

export default ArchiveButton
