export interface ProjectModel {
    id?: string
    name?: string
    description?: string
    leadID?: string
    leadName?: string
    isActive?: boolean
    lead?: LeadModel
}

export interface LeadModel {
    firstName: string
    lastName: string
    id?: string
}

export interface UserModel {
    firstName: string
    lastName: string
    email: string
    username: string
    isActive: boolean
}