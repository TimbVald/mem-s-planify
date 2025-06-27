import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'
import FloatingAIAssistant from '@/components/floating-ai-assistant'
// import useProject from '@/hooks/use-project'

type Props = {
    children: React.ReactNode
}

const SidebarLayout = ({children}: Props) => {
    // const { project } = useProject()
  return (
    <SidebarProvider>
        <AppSidebar />
        <main className='w-full m-2'>
            <div className='flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-4'>
                {/* <SearchBar /> */}
                <nav className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-700">En ligne</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Projet actif:</span>
                            <span className="font-medium text-gray-900">Mem&apos;s Planify</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white shadow-sm"
                        />
                    </div>


                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Dernière activité:</span>
                            <span className="font-medium text-gray-900">
                                {new Date().toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>
                </nav>
                <div className='ml-auto'></div>
                <UserButton />
            </div>
            <div className='h-4'></div>
            {/* main content */}
            <div className='border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4'>
                {children}
            </div>
        </main>
        <FloatingAIAssistant />
    </SidebarProvider>
  )
}

export default SidebarLayout
