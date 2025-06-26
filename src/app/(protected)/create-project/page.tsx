/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'
import { FolderGit2, Info, Loader2, Sparkles, Zap } from 'lucide-react'
import { Github } from 'lucide-react'
import { Shield } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'

type FormInput = {
    repoUrl: string
    projectName: string
    githubToken?: string
}

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>()
    const createProject = api.project.createProject.useMutation()
    const refetch = useRefetch()

    function onSubmit(data: FormInput) {
        // window.alert(JSON.stringify(data, null, 2))
        createProject.mutate({
            name: data.projectName,
            githubUrl: data.repoUrl,
            githubToken: data.githubToken
        }, {
            onSuccess: () => {
                toast.success('Projet créé avec succès')
                refetch()
                reset()
            },
            onError: () => {
                toast.error('Erreur lors de la création du projet')
            }
        })
        return true
    }

    return (
        <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
            <Card className='w-full max-w-md group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-white/80 backdrop-blur-sm border-2 border-blue-100 hover:border-blue-200'>
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/10 to-indigo-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Floating elements */}
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                    <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
                </div>
                
                <div className="absolute bottom-4 left-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                    <Zap className="h-4 w-4 text-indigo-400 animate-bounce" />
                </div>

                <CardHeader className='relative text-center pb-6'>
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full shadow-lg">
                                <Github className='h-6 w-6 text-white' />
                            </div>
                        </div>
                    </div>
                    
                    <CardTitle className='text-2xl font-bold text-gray-900 group-hover:text-blue-800 transition-colors duration-300'>
                        Lien vers votre dépôt GitHub
                    </CardTitle>
                    <p className='text-sm text-gray-600 mt-2 leading-relaxed'>
                        Entrez l&apos;URL de votre dépôt pour le lier à{' '}
                        <span className='font-semibold text-blue-600'>Mem&apos;s Planify</span>
                    </p>
                </CardHeader>
                
                <CardContent className='relative space-y-4'>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        <div className='space-y-3'>
                            <div className='relative'>
                                <Input
                                    {...register('projectName', { required: true })}
                                    placeholder='Nom du projet'
                                    required
                                    className='border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 placeholder:text-gray-400'
                                />
                            </div>
                            
                            <div className='relative'>
                                <Input
                                    {...register('repoUrl', { required: true })}
                                    placeholder='URL Github'
                                    type='url'
                                    required
                                    className='border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 placeholder:text-gray-400'
                                />
                            </div>
                            
                            <div className='relative'>
                                <Input
                                    {...register('githubToken')}
                                    placeholder='Github Token (Optionnel)'
                                    className='border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 placeholder:text-gray-400'
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <Shield className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                       
                        <Button 
                            type='submit' 
                            disabled={createProject.isPending}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                             {createProject.isPending ? (
                            <>
                                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                                Création en cours...
                            </>
                        ) : (
                            <>
                                Créer le projet
                                <FolderGit2 className='w-4 h-4 ml-2' />
                            </>
                        )}

                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreatePage
