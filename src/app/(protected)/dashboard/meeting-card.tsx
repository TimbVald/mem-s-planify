/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useDropzone } from 'react-dropzone'
import { uploadAudioToSupabase } from '@/lib/supabase'
import { Loader2, Presentation, Upload, Mic, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/trpc/react'
import { useParams, useRouter } from 'next/navigation'
import useProject from '@/hooks/use-project'
import { toast } from 'sonner'

const MeetingCard = () => {
    const { project } = useProject()
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const router = useRouter()
    const uploadMeeting = api.project.uploadMeeting.useMutation()

    const simulateProgress = (setProgress: (n: number) => void) => {
        let progress = 0
        const interval = setInterval(() => {
            progress += Math.random() * 10
            if (progress >= 90) {
                clearInterval(interval)
            }
            setProgress(Math.min(progress, 90))
        }, 200)
        return interval
    }

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'audio/*': ['.mp3', '.wav', '.m4a'],
        },
        multiple: false,
        maxSize: 50_000_000,
        onDrop: async acceptedFiles => {
            if (!project) return
            setIsUploading(true)
            setProgress(0)
            const interval = simulateProgress(setProgress)
            try {
                console.log(acceptedFiles)
                const file = acceptedFiles[0]
                if (!file) {
                    window.alert("Aucun fichier sélectionné.")
                    return
                }

                const downloadUrl = await uploadAudioToSupabase(file as File, setProgress) as string
                uploadMeeting.mutate({
                    projectId: project.id,
                    meetingUrl: downloadUrl,
                    name: file.name
                }, {
                    onSuccess: () => {
                        toast.success("Réunion téléversée avec succès")
                        router.push(`/meetings`)
                    },
                    onError: () => {
                        toast.error("Erreur lors de la téléversement de la réunion")
                    }
                })
                console.log("Fichier uploadé :", downloadUrl)
                // window.alert(downloadUrl)
            } catch (err: any) {
                console.error("Erreur de téléversement :", err.message ?? err)
                alert("Erreur lors de la téléversement : " + (err.message ?? err))
            } finally {
                setIsUploading(false)
                clearInterval(interval)
                setProgress(100)
            }
        }

    })
    return (
        <Card className='col-span-2 group relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-2 border-dashed border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100' {...getRootProps()}>
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {!isUploading && (
                <div className='relative z-10 flex flex-col items-center justify-center p-8 text-center'>
                    {/* Icon container with gradient background */}
                    <div className='relative mb-6'>
                        <div className='absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300' />
                        <div className='relative bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300'>
                            <Presentation className='h-8 w-8 text-white' />
                        </div>
                    </div>

                    <h3 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300'>
                        Créer une nouvelle réunion
                    </h3>

                    <div className='flex items-center gap-2 mb-4'>
                        <Sparkles className='h-4 w-4 text-amber-500' />
                        <p className='text-sm text-gray-600 max-w-sm leading-relaxed'>
                            Analysez votre réunion avec Mem&apos;s AI.
                            <br />
                            <span className='font-medium text-blue-600'>Propulsé par l&apos;IA avancée.</span>
                        </p>
                    </div>

                    <div className='mt-6'>
                        <Button
                            size="lg"
                            className='bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                            disabled={isUploading}
                        >
                            <Upload className='mr-2 h-5 w-5' aria-hidden='true' />
                            Téléverser la réunion
                            <input {...getInputProps()} className='hidden' />
                        </Button>
                    </div>

                    {/* File type hints */}
                    <div className='mt-4 flex items-center gap-2 text-xs text-gray-500'>
                        <Mic className='h-3 w-3' />
                        <span>MP3, WAV, M4A (max 50MB)</span>
                    </div>
                </div>
            )}

            {isUploading && (
                <div className='relative z-10 flex flex-col items-center justify-center p-8'>
                    <div className='relative size-24'>
                        <CircularProgressbar
                            value={progress}
                            text={`${Math.round(progress)}%`}
                            className='size-24'
                            styles={buildStyles({
                                pathColor: '#3b82f6',
                                textColor: '#1e40af',
                                trailColor: '#e0e7ff',
                                backgroundColor: '#3b82f6',
                                textSize: '18px',
                            })}
                        />
                        {/* Pulsing ring effect */}
                        <div className='absolute inset-0 rounded-full border-4 border-blue-200 animate-ping opacity-20' />
                    </div>

                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                        Téléversement en cours...
                    </h3>

                    <p className='text-sm text-gray-600 text-center max-w-xs'>
                        Votre réunion est en cours d&apos;analyse par notre IA
                    </p>

                    {/* Progress bar */}
                    <div className='w-full max-w-xs mt-4 bg-gray-200 rounded-full h-2 overflow-hidden'>
                        <div
                            className='h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out'
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}
        </Card>
    )
}

export default MeetingCard
