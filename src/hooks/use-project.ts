import { api } from '@/trpc/react'
import React from 'react'
import {useLocalStorage} from 'usehooks-ts'

const useProject = () => {
    const {data: projects} = api.project.getProjects.useQuery()
    const [projectId, setProjectId] = useLocalStorage('mems-projectId', '')
    
     const project = projects?.find(project => project.id === projectId)

  // Retourne les données et fonctions utiles pour la gestion des projets
    return {projects, project, projectId, setProjectId}

}

export default useProject