/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { askQuestion } from './action'
import { readStreamableValue } from 'ai/rsc'
import CodeReferences from './code-references'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import useRefetch from '@/hooks/use-refetch'
import { Save, X, Send, Sparkles, MessageCircle, Loader2 } from 'lucide-react'

// Dynamically load the heavy markdown editor on the client only
const MDEditor: any = dynamic(() => import('@uiw/react-md-editor').then(mod => mod.default), { ssr: false })

const AskQuestionCard = () => {
    const { project } = useProject()
    const [open, setOpen] = useState(false)
    const [question, setQuestion] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [filesReferences, setFilesReferences] = useState<{filename: string; sourceCode: string; summary: string}[]>([])
    const [answer, setAnswer] = useState('')
    const savedAnswer = api.project.saveAnswer.useMutation()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('')
        setFilesReferences([])
        e.preventDefault()
        if (!project?.id) return
        setIsLoading(true)

        const {output, filesReferences} = await askQuestion(question, project.id)
        setOpen(true)
        setFilesReferences(filesReferences)

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswer(ans => ans + delta)
            }
        }
        setIsLoading(false)
    }

    const refetch = useRefetch()

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='sm:max-w-[85vw] max-h-[90vh] overflow-hidden'>
                    <DialogHeader className='pb-4 border-b'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <div className='relative'>
                                    <Image src="/logo.png" alt="Mem's Planify" width={40} height={40} className='rounded-lg' />
                                    <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                                </div>
                                <div>
                                    <DialogTitle className='text-xl font-semibold'>Mem&apos;s AI Assistant</DialogTitle>
                                    <p className='text-sm text-muted-foreground'>Réponse générée pour votre question</p>
                                </div>
                            </div>
                            <Button 
                                disabled={savedAnswer.isPending} 
                                variant='outline' 
                                onClick={() => {
                                    savedAnswer.mutate({
                                        projectId: project!.id,
                                        question: question,
                                        answer: answer,
                                        filesReferences
                                    }, {
                                        onSuccess: () => {
                                            toast.success('Cette réponse a été enregistrée avec succès')
                                            void refetch()
                                        },
                                        onError: () => {
                                            toast.error('Erreur lors de l\'enregistrement de la réponse, veuillez réessayer')
                                        }
                                    })
                                }}
                                className='gap-2 hover:bg-green-50 hover:border-green-200 transition-colors'
                            >
                                {savedAnswer.isPending ? (
                                    <Loader2 className='w-4 h-4 animate-spin' />
                                ) : (
                                    <Save className='w-4 h-4' />
                                )}
                                Enregistrer
                            </Button>
                        </div>
                    </DialogHeader>
                    
                    <div className='flex-1 overflow-y-auto py-4'>
                        <div className='space-y-4'>
                            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                                <div className='flex items-start gap-3'>
                                    <MessageCircle className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0' />
                                    <div className='flex-1'>
                                        <p className='font-medium text-blue-900 mb-1'>Votre question :</p>
                                        <p className='text-blue-800'>{question}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className='bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4'>
                                <div className='flex items-start gap-3'>
                                    <Sparkles className='w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0' />
                                    <div className='flex-1'>
                                        <p className='font-medium text-purple-900 mb-2'>Réponse de Mem&apos;s AI :</p>
                                        <MDEditor.Markdown 
                                            source={answer} 
                                            className='prose prose-sm max-w-none !bg-transparent !text-purple-900'
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {filesReferences.length > 0 && (
                                <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                                    <CodeReferences filesReferences={filesReferences} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='flex justify-end pt-4 border-t'>
                        <Button 
                            type='button' 
                            onClick={() => {setOpen(false)}}
                            variant='outline'
                            className='gap-2'
                        >
                            <X className='w-4 h-4' />
                            Fermer
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            
            <Card className='relative col-span-3 group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 bg-gradient-to-br from-white to-blue-50/30'>
                <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3 mb-2'>
                        <div className='p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors'>
                            <Sparkles className='w-6 h-6 text-blue-600' />
                        </div>
                        <CardTitle className='text-xl font-semibold text-gray-900'>
                            Assistant IA Mem&apos;s
                        </CardTitle>
                    </div>
                    <p className='text-gray-600 leading-relaxed'>
                        Posez vos questions sur votre projet et obtenez des réponses détaillées avec des exemples de code pertinents. 
                        <span className='font-semibold text-blue-600'> Mem&apos;s AI</span> analyse votre codebase pour vous fournir des réponses précises.
                    </p>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <form onSubmit={onSubmit} className='space-y-4'>
                        <div className='relative'>
                            <Textarea 
                                placeholder="Exemple : Quel fichier dois-je éditer pour changer la page d'accueil ? Comment implémenter l'authentification ?"
                                value={question} 
                                onChange={(e) => setQuestion(e.target.value)} 
                                disabled={isLoading}
                                className='min-h-[120px] resize-none border-2 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 pr-12'
                            />
                            <div className='absolute bottom-3 right-3'>
                                {isLoading ? (
                                    <Loader2 className='w-5 h-5 text-blue-600 animate-spin' />
                                ) : (
                                    <Send className='w-5 h-5 text-gray-400' />
                                )}
                            </div>
                        </div>
                        
                        <Button 
                            type='submit' 
                            disabled={isLoading || !question.trim()}
                            className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none gap-2'
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className='w-4 h-4 animate-spin' />
                                    Génération en cours...
                                </>
                            ) : (
                                <>
                                    <Sparkles className='w-4 h-4' />
                                    Envoyer à Mem&apos;s AI
                                </>
                            )}
                        </Button>
                    </form>
                    
                    <div className='text-center'>
                        <p className='text-xs text-gray-500'>
                            💡 Conseil : Plus votre question est spécifique, plus la réponse sera précise
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default AskQuestionCard
