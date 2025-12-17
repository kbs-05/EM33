import type { Student, Company, Admin, Project } from "./types"

// Mock users storage
export const mockUsers: (Student | Company | Admin)[] = [
  {
    id: "1",
    email: "MAT001@etudiant.com",
    name: "John Doe",
    role: "student",
    matricule: "MAT001",
    departement: "Informatique",
    groupe: "A1",
    university: "MIT",
    major: "Computer Science",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "company@example.com",
    name: "Jane Smith",
    role: "company",
    companyName: "Tech Innovations Inc",
    industry: "Technology",
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
]

// Mock projects storage
export const mockProjects: Project[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "John Doe",
    title: "AI-Powered Study Assistant",
    description:
      "An intelligent tutoring system that helps students learn more effectively using machine learning algorithms.",
    category: "Education Technology",
    createdAt: new Date("2024-02-15"),
    likes: [],
  },
  {
    id: "2",
    studentId: "1",
    studentName: "John Doe",
    title: "Sustainable Food Delivery",
    description:
      "A carbon-neutral food delivery platform that connects local restaurants with eco-conscious consumers.",
    category: "Sustainability",
    createdAt: new Date("2024-03-01"),
    likes: ["2"],
  },
]

// Admin access code
export const ADMIN_ACCESS_CODE = "ADMIN2024"

// Helper functions for mock data operations
export const getUserByEmail = (email: string) => {
  return mockUsers.find((user) => user.email === email)
}

export const addUser = (user: Student | Company | Admin) => {
  mockUsers.push(user)
}

export const getProjectsByStudentId = (studentId: string) => {
  return mockProjects.filter((project) => project.studentId === studentId)
}

export const getAllProjects = () => {
  return mockProjects
}

export const addProject = (project: Project) => {
  mockProjects.push(project)
}

export const toggleProjectLike = (projectId: string, companyId: string) => {
  console.log("[v0] toggleProjectLike called with:", { projectId, companyId })
  const project = mockProjects.find((p) => p.id === projectId)
  if (project) {
    const likeIndex = project.likes.indexOf(companyId)
    console.log("[v0] Current likes:", project.likes, "likeIndex:", likeIndex)
    if (likeIndex > -1) {
      project.likes.splice(likeIndex, 1)
      console.log("[v0] Removed like, new likes:", project.likes)
    } else {
      project.likes.push(companyId)
      console.log("[v0] Added like, new likes:", project.likes)
    }
  } else {
    console.log("[v0] Project not found")
  }
}

export const deleteProject = (projectId: string) => {
  const index = mockProjects.findIndex((p) => p.id === projectId)
  if (index > -1) {
    mockProjects.splice(index, 1)
  }
}

// New function to find a student by matricule
export const getStudentByMatricule = (matricule: string) => {
  return mockUsers.find((user) => user.role === "student" && (user as Student).matricule === matricule) as
    | Student
    | undefined
}

// New function to create a student
export const createStudent = (matricule: string, departement: string, groupe: string, password: string) => {
  const newStudent: Student = {
    id: Date.now().toString(),
    email: `${matricule}@etudiant.com`,
    name: `Étudiant ${matricule}`,
    role: "student",
    matricule,
    departement,
    groupe,
    createdAt: new Date(),
  }
  mockUsers.push(newStudent)
  // Store password separately (in real app, this would be hashed)
  localStorage.setItem(`password_${matricule}`, password)
  return newStudent
}

export const updateStudent = (
  matricule: string,
  updates: { name?: string; departement?: string; groupe?: string; password?: string },
) => {
  const studentIndex = mockUsers.findIndex(
    (user) => user.role === "student" && (user as Student).matricule === matricule,
  )

  if (studentIndex > -1) {
    const student = mockUsers[studentIndex] as Student
    if (updates.name) student.name = updates.name
    if (updates.departement) student.departement = updates.departement
    if (updates.groupe) student.groupe = updates.groupe
    if (updates.password) {
      localStorage.setItem(`password_${matricule}`, updates.password)
    }
    return true
  }
  return false
}
