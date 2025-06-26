/* eslint-disable @typescript-eslint/no-floating-promises */
'use client'
import React from 'react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import MeetingCard from '../dashboard/meeting-card'
import { CheckCircle, Clock, Eye, Loader2, Trash, XCircle, Calendar, Users, FileText } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
            void refetch()
        },
        onError: (error) => {
            toast.error(`Erreur lors de la suppression de la réunion : ${error.message}`)
        }
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PROCESSING':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        En cours
                    </Badge>
                )
            case 'COMPLETED':
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Terminé
                    </Badge>
                )
            case 'FAILED':
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                        <XCircle className="w-3 h-3 mr-1" />
                        Échoué
                    </Badge>
                )
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        <Clock className="w-3 h-3 mr-1" />
                        En attente
                    </Badge>
                )
        }
    }

    return (
        <div className="space-y-6">
            <MeetingCard />
            
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Vos Réunions</h1>
                    <p className="text-gray-600 mt-1">Gérez et consultez toutes vos réunions</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{meetings?.length ?? 0} réunion{meetings?.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Chargement des réunions...</span>
                    </div>
                </div>
            )}

            {meetings && meetings.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réunion trouvée</h3>
                        <p className="text-gray-500 text-center max-w-sm">
                            Vous n&apos;avez pas encore créé de réunions. Commencez par créer votre première réunion.
                        </p>
                    </CardContent>
                </Card>
            )}

            {meetings && meetings.length > 0 && (
                <div className="grid gap-4">
                    {meetings.map((meeting) => (
                        <Card key={meeting.id} className="hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Link 
                                                href={`/meetings/${meeting.id}`} 
                                                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                            >
                                                {meeting.name}
                                            </Link>
                                            {getStatusBadge(meeting.status)}
                                        </div>
                                        
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{meeting.createdAt.toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{meeting.createdAt.toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 ml-4">
                                        <Link href={`/meetings/${meeting.id}`}>
                                            <Button size="sm" variant="outline" className="gap-2">
                                                <Eye className="w-4 h-4" />
                                                Voir
                                            </Button>
                                        </Link>
                                        <Button 
                                            disabled={deleteMeeting.isPending} 
                                            size="sm" 
                                            variant="destructive" 
                                            className="gap-2"
                                            onClick={() => {
                                                if (confirm("Êtes-vous sûr de vouloir supprimer cette réunion ?")) {
                                                    deleteMeeting.mutate({ meetingId: meeting.id })
                                                }
                                            }}
                                        >
                                            {deleteMeeting.isPending ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MettingPage