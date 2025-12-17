"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { StudentNav } from "@/components/student-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Heart, Calendar } from "lucide-react"
import { getProjectsByStudentId } from "@/lib/mock-data"
import type { Project } from "@/lib/types"

export default function StudentDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      router.push("/student/login")
      return
    }

    // Load student's projects
    const studentProjects = getProjectsByStudentId(user.id)
    setProjects(studentProjects)
  }, [isAuthenticated, user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StudentNav />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Bienvenue, {user.name}</h2>
          <p className="text-muted-foreground">
            Gérez vos projets entrepreneuriaux et suivez l'intérêt des entreprises
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
              <div className="text-3xl font-bold text-foreground">
                {projects.reduce((sum, p) => sum + p.likes.length, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Membre Depuis</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {new Date(user.createdAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-foreground">Vos Projets</h3>
          <Button onClick={() => router.push("/student/projects/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un Nouveau Projet
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h4 className="text-xl font-semibold text-foreground mb-2">Aucun projet pour le moment</h4>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Commencez à présenter vos idées entrepreneuriales en créant votre premier projet
              </p>
              <Button onClick={() => router.push("/student/projects/new")}>
                <Plus className="w-4 h-4 mr-2" />
                Créer Votre Premier Projet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                      <Badge variant="secondary" className="mb-2">
                        {project.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{project.likes.length}</span>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-3">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Créé le {new Date(project.createdAt).toLocaleDateString("fr-FR")}</span>
                    {project.businessPlanUrl && (
                      <Badge variant="outline" className="bg-transparent">
                        Plan d'Affaires Joint
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
