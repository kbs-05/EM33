"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { CompanyNav } from "@/components/company-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, Search, FileText, Calendar, Mail, Download } from "lucide-react"
import { getAllProjects, toggleProjectLike } from "@/lib/mock-data"
import type { Project } from "@/lib/types"

export default function CompanyDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "company") {
      router.push("/company/login")
      return
    }

    // Load all projects
    const allProjects = getAllProjects()
    setProjects(allProjects)
    setFilteredProjects(allProjects)
  }, [isAuthenticated, user, router])

  useEffect(() => {
    // Filter projects based on search query
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredProjects(filtered)
    }
  }, [searchQuery, projects])

  const handleLike = (projectId: string) => {
    if (!user) return
    console.log("[v0] handleLike called for project:", projectId)
    toggleProjectLike(projectId, user.id)
    // Refresh projects
    const allProjects = getAllProjects()
    setProjects(allProjects)
    setFilteredProjects(
      searchQuery.trim() === ""
        ? allProjects
        : allProjects.filter(
            (project) =>
              project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              project.category.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
    )
  }

  const handleDownloadBusinessPlan = (project: Project) => {
    if (!project.businessPlanUrl) return

    const link = document.createElement("a")
    link.href = project.businessPlanUrl
    link.download = `${project.title}_Plan_Affaires.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const isLiked = (project: Project) => {
    return user ? project.likes.includes(user.id) : false
  }

  const likedProjects = projects.filter((p) => isLiked(p))

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CompanyNav />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Découvrir les Projets Étudiants</h2>
          <p className="text-muted-foreground">
            Parcourez des projets entrepreneuriaux innovants d'étudiants talentueux
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total des Projets</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{projects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projets Aimés</CardTitle>
              <Heart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{likedProjects.length}</div>
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher des projets par titre, catégorie ou description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground">
            {searchQuery ? `Résultats de Recherche (${filteredProjects.length})` : "Tous les Projets"}
          </h3>
        </div>

        {filteredProjects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mb-4" />
              <h4 className="text-xl font-semibold text-foreground mb-2">Aucun projet trouvé</h4>
              <p className="text-muted-foreground text-center max-w-md">
                {searchQuery
                  ? "Essayez d'ajuster vos termes de recherche"
                  : "Aucun projet étudiant disponible pour le moment"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:border-accent transition-colors flex flex-col">
                <CardHeader className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{project.category}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(project.id)}
                      className={isLiked(project) ? "text-red-500 hover:text-red-600" : "text-muted-foreground"}
                    >
                      <Heart className={`w-5 h-5 ${isLiked(project) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                  <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-3 mb-3">{project.description}</CardDescription>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Par {project.studentName}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      <span>{project.likes.length} j'aime</span>
                    </div>
                    {project.businessPlanUrl && (
                      <Badge variant="outline" className="bg-transparent">
                        <FileText className="w-3 h-3 mr-1" />
                        Plan d'Affaires
                      </Badge>
                    )}
                  </div>
                  {project.businessPlanUrl && (
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      size="sm"
                      onClick={() => handleDownloadBusinessPlan(project)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger le Plan d'Affaires
                    </Button>
                  )}
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter l'Admin
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
