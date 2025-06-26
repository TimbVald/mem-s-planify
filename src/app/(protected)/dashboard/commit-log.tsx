/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { ExternalLink, GitCommit, Calendar } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import useProject from '@/hooks/use-project'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'

const commitLog = () => {
    const { projectId, project } = useProject()
    const { data: commits } = api.project.getCommits.useQuery({ projectId })
    
    return (
        <div className="w-full">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nouveaux Commits</h3>
                <p className="text-sm text-gray-600">Dernières activités de votre équipe</p>
            </div>
            
            <ul className="space-y-4">
                {commits?.map((commit, commitIdx) => {
                    return (
                        <li key={commit.id} className='relative group'>
                            {/* Timeline connector */}
                            <div className={cn(
                                'absolute left-4 top-8 w-0.5 transition-all duration-300',
                                commitIdx === commits.length - 1 
                                    ? 'h-0' 
                                    : 'h-12 bg-gradient-to-b from-blue-500 to-gray-200'
                            )} />
                            
                            <div className='relative flex gap-x-4 hover:bg-gray-50/50 rounded-xl p-3 transition-all duration-200'>
                                {/* Avatar */}
                                <div className="relative">
                                    <img 
                                        src={commit.commitAuthorAvatar} 
                                        alt={commit.commitAuthorName} 
                                        className='relative mt-2 size-10 flex-none rounded-full bg-gray-50 ring-2 ring-white shadow-sm hover:ring-blue-200 transition-all duration-200' 
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                        <GitCommit className="w-2 h-2 text-white" />
                                    </div>
                                </div>
                                
                                {/* Commit content */}
                                <div className='flex-auto min-w-0'>
                                    <div className='bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4'>
                                        <div className='flex items-start justify-between gap-x-4 mb-2'>
                                            <div className="flex items-center gap-2">
                                                <span className='font-medium text-gray-900 text-sm'>
                                                    {commit.commitAuthorName}
                                                </span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                    committed
                                                </span>
                                            </div>
                                            
                                            <Link 
                                                href={`${project?.githubUrl}/commit/${commit.commitHash}`} 
                                                className='inline-flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1 rounded hover:bg-blue-50' 
                                                target='_blank'
                                            >
                                                <ExternalLink className='size-3' />
                                                Voir
                                            </Link>
                                        </div>
                                        
                                        <h4 className='font-semibold text-gray-900 text-sm mb-2 line-clamp-2'>
                                            {commit.commitMessage}
                                        </h4>
                                        
                                        {commit.summary && (
                                            <div className="bg-gray-50 rounded-md p-3 border-l-4 border-blue-500">
                                                <pre className='whitespace-pre-wrap text-xs leading-5 text-gray-600 font-mono'>
                                                    {commit.summary}
                                                </pre>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Calendar className="size-3" />
                                                <span>Juste maintenant</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>Succès</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
            
            {(!commits || commits.length === 0) && (
                <div className="text-center py-12">
                    <GitCommit className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Aucun commit</h3>
                    <p className="text-sm text-gray-500">Les commits apparaîtront ici une fois que votre équipe commencera à contribuer</p>
                </div>
            )}
        </div>
    )
}

export default commitLog
