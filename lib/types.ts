export type UserRole = "student" | "company" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
}

export interface Student extends User {
  role: "student"
  matricule: string
  departement: string
  groupe: string
  university?: string
  major?: string
}

export interface Company extends User {
  role: "company"
  companyName: string
  industry?: string
}

export interface Admin extends User {
  role: "admin"
}

export interface Project {
  id: string
  studentId: string
  studentName: string
  title: string
  description: string
  category: string
  businessPlanUrl?: string
  createdAt: Date
  likes: string[] // Array of company IDs who liked this project
}

export interface AuthContextType {
  user: User | null
  login: (identifier: string, password: string, role: UserRole) => Promise<boolean>
  register: (email: string, password: string, name: string, role: UserRole, additionalData?: any) => Promise<boolean>
  createStudent: (matricule: string, departement: string, groupe: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}
