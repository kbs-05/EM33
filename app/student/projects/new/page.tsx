"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { StudentNav } from "@/components/student-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { addProject } from "@/lib/mock-data"
import type { Project } from "@/lib/types"

export default function NewProjectPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      router.push("/student/login")
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!user) return

    let businessPlanUrl: string | undefined = undefined
    if (file) {
      const reader = new FileReader()
      await new Promise<void>((resolve) => {
        reader.onload = () => {
          businessPlanUrl = reader.result as string
          resolve()
        }
        reader.readAsDataURL(file)
      })
    }

    // Create new project
    const newProject: Project = {
      id: Date.now().toString(),
      studentId: user.id,
      studentName: user.name,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      businessPlanUrl,
      createdAt: new Date(),
      likes: [],
    }

    addProject(newProject)
    router.push("/student/dashboard")

    setIsLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StudentNav />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Tableau de Bord
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Créer un Nouveau Projet</CardTitle>
              <CardDescription>Partagez votre projet entrepreneurial avec les entreprises</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Titre du Projet</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Assistant d'Étude Alimenté par l'IA"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Input
                    id="category"
                    type="text"
                    placeholder="Technologie Éducative"
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre projet, ses objectifs et ce qui le rend unique..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessPlan">Plan d'Affaires (PDF)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <Input
                      id="businessPlan"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <Label htmlFor="businessPlan" className="cursor-pointer">
                      <span className="text-sm text-muted-foreground">
                        {file ? file.name : "Cliquez pour télécharger ou glissez-déposez"}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">PDF jusqu'à 10MB</p>
                    </Label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" size="lg" disabled={isLoading}>
                    {isLoading ? "Création..." : "Créer le Projet"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-transparent"
                    onClick={() => router.push("/student/dashboard")}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
