export interface ProjectModel {
    ID?: string
    Name?: string
    Description?: string
    LeadID?: string
    LeadName?: string
    IsActive?: boolean
    Lead?: LeadModel
}

export interface LeadModel {
    FirstName: string
    LastName: string
    ID?: string
}

export interface UserModel {
    FirstName: string
    LastName: string
    Email: string
    Username: string
    IsActive: boolean
}