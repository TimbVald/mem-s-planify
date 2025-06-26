"use client"

import { useUser } from '@clerk/nextjs'
import { ExternalLink, Github, Users, Calendar, Activity } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import useProject from '@/hooks/use-project'
import CommitLog from './commit-log'
import AskQuestionCard from './ask-question-card'
import MeetingCard from './meeting-card'
import TeamMembers from './team-members'
import dynamic from 'next/dynamic'
const InviteButton = dynamic(() => import('./invite-button'), { ssr: false })
import ArchiveButton from './archive-button'

const DashboardPage = () => {
  // const {user} = useUser()
  const { project } = useProject()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-6">
          {/* Project Info Card */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-blue-500/5 p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <Github className="size-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-gray-900 mb-1">
                    {project?.name ?? 'Projet'}
                  </h1>
                  <p className="text-sm text-gray-600 mb-2">
                    Projet connecté à GitHub
                  </p>
                  <Link 
                    href={project?.githubUrl ?? ""} 
                    target='_blank' 
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
                  >
                    {project?.githubUrl}
                    <ExternalLink className="size-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Team Actions */}
          <div className="flex items-center gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg shadow-blue-500/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <TeamMembers />
                </div>
                <div className="flex items-center gap-2">
                  <InviteButton />
                  <ArchiveButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-8">
        {/* AI Tools Section */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Activity className="size-3 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 underline">
                Outils IA
              </h2>
            </div>
            <p className="text-gray-600">
              Utilisez l&apos;intelligence artificielle pour analyser votre code et vos réunions
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <AskQuestionCard />
            <MeetingCard />
          </div>
        </div>

        {/* Activity Section */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                <Calendar className="size-3 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 underline">
                Activité Récente
              </h2>
            </div>
            <p className="text-gray-600">
              Suivez les dernières contributions de votre équipe
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-blue-500/5 p-6">
            <CommitLog />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
