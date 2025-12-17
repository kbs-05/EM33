"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Building2, GraduationCap, FileText, Trash2, Heart, Plus, Pencil } from "lucide-react"
import { getAllProjects, mockUsers, deleteProject, updateStudent } from "@/lib/mock-data"
import type { Project, Student, Company } from "@/lib/types"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, createStudent } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  const [createStudentDialogOpen, setCreateStudentDialogOpen] = useState(false)
  const [matricule, setMatricule] = useState("")
  const [departement, setDepartement] = useState("")
  const [groupe, setGroupe] = useState("")
  const [password, setPassword] = useState("")
  const [createError, setCreateError] = useState("")
  const [createSuccess, setCreateSuccess] = useState("")

  const [editStudentDialogOpen, setEditStudentDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [editName, setEditName] = useState("")
  const [editDepartement, setEditDepartement] = useState("")
  const [editGroupe, setEditGroupe] = useState("")
  const [editPassword, setEditPassword] = useState("")
  const [editError, setEditError] = useState("")
  const [editSuccess, setEditSuccess] = useState("")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login")
      return
    }

    // Load all data
    const allProjects = getAllProjects()
    setProjects(allProjects)

    const studentUsers = mockUsers.filter((u) => u.role === "student") as Student[]
    const companyUsers = mockUsers.filter((u) => u.role === "company") as Company[]
    setStudents(studentUsers)
    setCompanies(companyUsers)
  }, [isAuthenticated, user, router])

  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete)
      setProjects(getAllProjects())
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    }
  }

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError("")
    setCreateSuccess("")

    const success = await createStudent(matricule, departement, groupe, password)

    if (success) {
      setCreateSuccess("Étudiant créé avec succès!")
      setMatricule("")
      setDepartement("")
      setGroupe("")
      setPassword("")
      // Refresh students list
      const studentUsers = mockUsers.filter((u) => u.role === "student") as Student[]
      setStudents(studentUsers)
      setTimeout(() => {
        setCreateStudentDialogOpen(false)
        setCreateSuccess("")
      }, 2000)
    } else {
      setCreateError("Ce matricule existe déjà.")
    }
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student)
    setEditName(student.name)
    setEditDepartement(student.departement)
    setEditGroupe(student.groupe)
    setEditPassword(typeof window !== "undefined" ? localStorage.getItem(`password_${student.matricule}`) || "" : "")
    setEditError("")
    setEditSuccess("")
    setEditStudentDialogOpen(true)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    setEditError("")
    setEditSuccess("")

    if (!editingStudent) return

    const success = updateStudent(editingStudent.matricule, {
      name: editName,
      departement: editDepartement,
      groupe: editGroupe,
      password: editPassword,
    })

    if (success) {
      setEditSuccess("Étudiant modifié avec succès!")
      // Refresh students list
      const studentUsers = mockUsers.filter((u) => u.role === "student") as Student[]
      setStudents(studentUsers)
      setTimeout(() => {
        setEditStudentDialogOpen(false)
        setEditingStudent(null)
        setEditSuccess("")
      }, 2000)
    } else {
      setEditError("Erreur lors de la modification.")
    }
  }

  if (!user) {
    return null
  }

  const totalLikes = projects.reduce((sum, p) => sum + p.likes.length, 0)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminNav />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Vue d'ensemble de la plateforme</h2>
          <p className="text-muted-foreground">Gérer les utilisateurs, projets et surveiller l'activité</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Utilisateurs</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{mockUsers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {students.length} étudiants, {companies.length} entreprises
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Projets</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{projects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total J'aimes</CardTitle>
              <Heart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalLikes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Moy. J'aimes/Projet</CardTitle>
              <Heart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {projects.length > 0 ? (totalLikes / projects.length).toFixed(1) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="students">Étudiants</TabsTrigger>
            <TabsTrigger value="companies">Entreprises</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tous les Projets</CardTitle>
                <CardDescription>Gérer et surveiller tous les projets étudiants sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Aucun projet disponible</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Étudiant</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>J'aimes</TableHead>
                        <TableHead>Créé</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.title}</TableCell>
                          <TableCell>{project.studentName}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{project.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4 text-muted-foreground" />
                              <span>{project.likes.length}</span>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(project.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Étudiants</CardTitle>
                    <CardDescription>Tous les étudiants inscrits sur la plateforme</CardDescription>
                  </div>
                  <Dialog open={createStudentDialogOpen} onOpenChange={setCreateStudentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Créer un étudiant
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Créer un nouvel étudiant</DialogTitle>
                        <DialogDescription>
                          Ajoutez un nouvel étudiant avec son matricule, département et groupe
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateStudent}>
                        <div className="space-y-4 py-4">
                          {createError && (
                            <Alert variant="destructive">
                              <AlertDescription>{createError}</AlertDescription>
                            </Alert>
                          )}
                          {createSuccess && (
                            <Alert>
                              <AlertDescription>{createSuccess}</AlertDescription>
                            </Alert>
                          )}
                          <div className="space-y-2">
                            <Label htmlFor="matricule">Matricule</Label>
                            <Input
                              id="matricule"
                              placeholder="MAT001"
                              value={matricule}
                              onChange={(e) => setMatricule(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="departement">Département</Label>
                            <Input
                              id="departement"
                              placeholder="Informatique"
                              value={departement}
                              onChange={(e) => setDepartement(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="groupe">Groupe</Label>
                            <Input
                              id="groupe"
                              placeholder="A1"
                              value={groupe}
                              onChange={(e) => setGroupe(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="Mot de passe initial"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Créer l'étudiant</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Aucun étudiant inscrit</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Matricule</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Département</TableHead>
                        <TableHead>Groupe</TableHead>
                        <TableHead>Mot de passe</TableHead>
                        <TableHead>Inscrit le</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-primary" />
                              {student.matricule}
                            </div>
                          </TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.departement}</TableCell>
                          <TableCell>{student.groupe}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {typeof window !== "undefined"
                                ? localStorage.getItem(`password_${student.matricule}`) || "N/A"
                                : "N/A"}
                            </code>
                          </TableCell>
                          <TableCell>{new Date(student.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                              className="text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Entreprises</CardTitle>
                <CardDescription>Toutes les entreprises inscrites sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                {companies.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Aucune entreprise inscrite</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom de l'Entreprise</TableHead>
                        <TableHead>Personne de Contact</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Industrie</TableHead>
                        <TableHead>Inscrite le</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-accent" />
                              {company.companyName}
                            </div>
                          </TableCell>
                          <TableCell>{company.name}</TableCell>
                          <TableCell>{company.email}</TableCell>
                          <TableCell>{company.industry || "N/A"}</TableCell>
                          <TableCell>{new Date(company.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le Projet</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce projet? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editStudentDialogOpen} onOpenChange={setEditStudentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'étudiant</DialogTitle>
            <DialogDescription>Modifiez les informations de l'étudiant</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit}>
            <div className="space-y-4 py-4">
              {editError && (
                <Alert variant="destructive">
                  <AlertDescription>{editError}</AlertDescription>
                </Alert>
              )}
              {editSuccess && (
                <Alert>
                  <AlertDescription>{editSuccess}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-matricule">Matricule</Label>
                <Input id="edit-matricule" value={editingStudent?.matricule || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom</Label>
                <Input
                  id="edit-name"
                  placeholder="Nom de l'étudiant"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-departement">Département</Label>
                <Input
                  id="edit-departement"
                  placeholder="Informatique"
                  value={editDepartement}
                  onChange={(e) => setEditDepartement(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-groupe">Groupe</Label>
                <Input
                  id="edit-groupe"
                  placeholder="A1"
                  value={editGroupe}
                  onChange={(e) => setEditGroupe(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Mot de passe</Label>
                <Input
                  id="edit-password"
                  type="password"
                  placeholder="Nouveau mot de passe"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Enregistrer les modifications</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
