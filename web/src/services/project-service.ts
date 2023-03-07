import { ProjectModel } from '@/models'
import httpClient from '@/utils/http-client'

export async function getProjects(search?: string): Promise<ProjectModel[]> {
    const response = await httpClient.get(`api/projects?s=${search ?? ''}`)
    return response
}

export default {
    getProjects
}