export default interface User {
    id: number
    name: string
    email: string
    password: string
    role: string
    social: string
    application: string
    createdAt: Date
    updatedAt: Date
    lastLogin: Date
    active: boolean
}