'use client'
import React from 'react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import MeetingCard from '../dashboard/meeting-card'
import { CheckCircle, Clock, Eye, Loader2, Trash, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import useRefetch from '@/hooks/use-refetch'

const MettingPage = () => {
    const refetch = useRefetch()
    const { projectId } = useProject()
    const { data: meetings, isLoading } = api.project.getMeetings.useQuery({ projectId }, {
        refetchInterval: 4000
    })

    const deleteMeeting = api.project.deleteMeeting.useMutation({
        onSuccess: () => {
            toast.success("Réunion supprimée avec succès")
            refetch()
        },
        onError: (error) => {
            toast.error(`Erreur lors de la suppression de la réunion : ${error.message}`)
        }
    })
    return (
        <>
            <MeetingCard />
            <div className="h-6"></div>
            <h1 className='text-2xl font-bold'>Vos Réunions</h1>
            {meetings && meetings.length === 0 && <div className='text-center text-gray-500'>Aucune réunion trouvée</div>}
            {isLoading && <div className='text-center text-gray-500'><Loader2 className='w-4 h-4 animate-spin mr-2' />Chargement des réunions...</div>}
            <ul>
                {meetings?.map((meeting) => (
                    <li key={meeting.id} className='flex items-center justify-between py-5 gap-x-6'>
                        <div>
                            <div className="min-w-0">
                                <div className='flex items-center gap-2'>
                                    <Link href={`/meetings/${meeting.id}`} className='text-sm font-semibold'>{meeting.name}
                                    </Link>
                                    {meeting.status === 'PROCESSING' && (
                                        <Badge className='bg-yellow-500 text-white'>
                                            <Loader2 className='w-4 h-4 animate-spin mr-2' />
                                            En cours de traitement...
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className='flex items-center text-xs text-gray-500 gap-x-2'>
                                <p className='whitespace-nowrap'>{meeting.createdAt.toLocaleDateString()}</p>
                                <p className='truncate'>Issues</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-x-4'>
                            <Link href={`/meetings/${meeting.id}`}
                            >
                                <Button size='sm' variant='outline'>
                                    <Eye className='w-4 h-4' />
                                    Voir la réunion
                                </Button>
                            </Link>
                            <Button disabled={deleteMeeting.isPending} size='sm' variant='destructive' onClick={() => {
                                if (confirm("Êtes-vous sûr de vouloir supprimer cette réunion ?")) {
                                    deleteMeeting.mutate({ meetingId: meeting.id })
                                }
                            }}>
                                {deleteMeeting.isPending ? (
                                    <>
                                        <Loader2 className='w-4 h-4 animate-spin' />
                                    </>
                                ) : (
                                    <>
                                        <Trash className='w-4 h-4' />
                                    </>
                                )}

                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default MettingPage