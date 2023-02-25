export interface ProjectModel {
    id?: string
    name?: string
    description?: string
    leadID?: string
    leadName?: string
    isActive?: boolean
    lead?: {
        leadID: string
        firstName: string
        lastName: string
    }
}

export interface ProjectDetailModel {
    name?: string
    description?: string
    isActive?: boolean
    leadID?: string
}

export interface LeadModel {
    name: string
    id?: string

}

export interface UserModel {
    firstName: string
    lastName: string
    email: string
    username: string
    isActive: boolean
}