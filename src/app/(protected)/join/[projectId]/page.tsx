'use server'
import React from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/server/db'
import { clerkClient } from '@clerk/nextjs/server'

type Props = {
    params: Promise<{
        projectId: string
    }>
}

const JoinHandlePage = async (props: Props) => {
    const {projectId} = await props.params
    const {userId} = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }
    const dbUser = await db.user.findUnique({
        where: {
            id: userId
        }
    })

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    if (!dbUser) {
        await db.user.create({
            data: {
                id: userId,
                emailAddress: user.emailAddresses[0]!.emailAddress ?? '',
                imageURL: user.imageUrl ?? '',
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',

            }
        })
    }

    const project = await db.project.findUnique({
        where: {
            id: projectId
        }
    })
    if (!project) {
        return redirect('/dashboard')
    }
    try {
        await db.userToProject.create({
            data: {
                projectId,
                userId
            }
        })
    } catch (error) {
        console.log('user already in project')
    }
    return redirect(`/dashboard/${projectId}`)
}

export default JoinHandlePage