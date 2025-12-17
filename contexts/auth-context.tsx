"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserRole, AuthContextType, Student, Company, Admin } from "@/lib/types"
import {
  getUserByEmail,
  addUser,
  ADMIN_ACCESS_CODE,
  getStudentByMatricule,
  createStudent as createStudentInDb,
} from "@/lib/mock-data"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (identifier: string, password: string, role: UserRole): Promise<boolean> => {
    // Pour admin, vérifier le code d'accès
    if (role === "admin") {
      if (password !== ADMIN_ACCESS_CODE) {
        return false
      }
      const adminUser = getUserByEmail(identifier)
      if (adminUser && adminUser.role === "admin") {
        setUser(adminUser)
        setIsAuthenticated(true)
        localStorage.setItem("currentUser", JSON.stringify(adminUser))
        return true
      }
      return false
    }

    // Pour les étudiants, utiliser le matricule
    if (role === "student") {
      const foundStudent = getStudentByMatricule(identifier)
      if (foundStudent) {
        // Vérifier le mot de passe stocké
        const storedPassword = localStorage.getItem(`password_${identifier}`)
        if (storedPassword === password) {
          setUser(foundStudent)
          setIsAuthenticated(true)
          localStorage.setItem("currentUser", JSON.stringify(foundStudent))
          return true
        }
      }
      return false
    }

    // Pour les entreprises, utiliser l'email
    const foundUser = getUserByEmail(identifier)
    if (foundUser && foundUser.role === role) {
      setUser(foundUser)
      setIsAuthenticated(true)
      localStorage.setItem("currentUser", JSON.stringify(foundUser))
      return true
    }

    return false
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    additionalData?: any,
  ): Promise<boolean> => {
    // Check if user already exists
    if (getUserByEmail(email)) {
      return false
    }

    const newUser: Student | Company | Admin = {
      id: Date.now().toString(),
      email,
      name,
      role,
      createdAt: new Date(),
      ...additionalData,
    } as Student | Company | Admin

    addUser(newUser)
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    return true
  }

  const createStudent = async (
    matricule: string,
    departement: string,
    groupe: string,
    password: string,
  ): Promise<boolean> => {
    // Vérifier si le matricule existe déjà
    if (getStudentByMatricule(matricule)) {
      return false
    }

    createStudentInDb(matricule, departement, groupe, password)
    return true
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("currentUser")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, createStudent, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
