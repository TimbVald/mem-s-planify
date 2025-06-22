import { Octokit } from "octokit"
import { db } from "@/server/db"
import axios from "axios"
import { aiSummariseCommit } from "./gemini"

// Initialisation de l'instance Octokit pour interagir avec l'API GitHub
// Utilise le token d'authentification stocké dans les variables d'environnement
export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
})

type Response = {
    commitMessage: string      // Message du commit
    commitHash: string         // Hash SHA du commit
    commitAuthorName: string   // Nom de l'auteur du commit
    commitAuthorAvatar: string // URL de l'avatar de l'auteur
    commitDate: string         // Date du commit
}

// const githubUrl = "http://github.com/docker/genai-stack"

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {

    // Extraction du propriétaire et du nom du repository depuis l'URL
    // Exemple: "https://github.com/docker/genai-stack" -> owner="docker", repo="genai-stack"

    const urlParts = githubUrl.split("/")
    const lastPart = urlParts[urlParts.length - 1]
    const secondLastPart = urlParts[urlParts.length - 2]

    // Supprime l'extension .git si présente
    const repo = lastPart?.replace(/\.git$/, '')
    const owner = secondLastPart

    if (!owner || !repo) {
        throw new Error(`URL GitHub invalide: ${githubUrl}`)
    }

    // Appel à l'API GitHub pour récupérer la liste des commits
    const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo
    })


    // Tri des commits par date (du plus récent au plus ancien)
    const sortedCommits = data.sort((a: any, b: any) =>
        new Date(b.commit.author.date || '').getTime() - new Date(a.commit.author.date || '').getTime()
    ) as any[]

    // Retourne les 10 premiers commits avec leurs détails formatés
    return sortedCommits.slice(0, 10).map((commit: any) => ({
        commitMessage: commit.commit.message ?? 'Aucun message',
        commitHash: commit.sha as string,
        commitAuthorName: commit.commit?.author?.name ?? "",
        commitAuthorAvatar: commit.author?.avatar_url ?? "",
        commitDate: commit.commit?.author?.date ?? "",
    }))

}

export const pollCommits = async (projectId: string) => {
    // Récupère l'URL GitHub associée au projet
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId)
    const commitHashes = await getCommitHashes(githubUrl)
    // Filtre pour ne garder que les commits non traités
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)

    const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit => {
        return summariseCommits(githubUrl, commit.commitHash)
    }))

    const summaries = summaryResponses.map((response) => {
        if (response.status === 'fulfilled') {
            return response.value as string
        }
        return "Aucun résumé disponible"
    })

    const commits = await db.commit.createMany({
        data: summaries.map((summary, index) => {
            console.log(`Creating commit ${index}`)
            return {
                projectId: projectId,
                commitMessage: unprocessedCommits[index]!.commitMessage,
                commitHash: unprocessedCommits[index]!.commitHash,
                commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                commitdate: unprocessedCommits[index]!.commitDate,
                summary
            }
        })
    })

    return commits

}

async function summariseCommits(githubUrl: string, commitHash: string) {
    // TODO: Implémenter la logique de résumé des commits
    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers: {
            Accept: 'application/vnd.github.v3.diff'
        }
    })
    return await aiSummariseCommit(data) || "Aucun résumé disponible"
}


async function fetchProjectGithubUrl(projectId: string) {
    // Recherche du projet dans la base de données
    const project = await db.project.findUnique({
        where: {
            id: projectId,
        },
        select: {
            githubUrl: true
        }
    })

    // Vérification que le projet existe et a une URL GitHub
    if (!project?.githubUrl) {
        throw new Error("Projet non trouvé ou aucune URL GitHub")
    }

    return {
        project,
        githubUrl: project.githubUrl,

    }
}

async function filterUnprocessedCommits(projectId: string, commitsHashes: Response[]) {
    // Récupère tous les commits déjà traités pour ce projet
    const processedCommits = await db.commit.findMany({
        where: {
            projectId,
        },
    })

    // Filtre les commits en excluant ceux déjà présents en base
    const unprocessedCommits = commitsHashes.filter((commit) =>
        !processedCommits.some((c) => c.commitHash === commit.commitHash)
    )
    return unprocessedCommits

}

// await pollCommits("cmc6f702b0000ryjokapmg3w2").then(console.log)