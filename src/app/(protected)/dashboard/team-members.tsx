/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'

const TeamMembers = () => {
    const {projectId} = useProject()
    const {data: members} = api.project.getTeamMembers.useQuery({projectId})
  return (
    <div>
         {members?.map((member) => (
          <img key={member.id} src={member.user.imageURL ?? ''} alt={member.user.firstName ?? ''} height={32} width={32} className='rounded-full' />
         ))}
    </div>
  )
}

export default TeamMembers