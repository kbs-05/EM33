"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, GraduationCap, Shield } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to appropriate dashboard based on role
      if (user.role === "student") {
        router.push("/student/dashboard")
      } else if (user.role === "company") {
        router.push("/company/dashboard")
      } else if (user.role === "admin") {
        router.push("/admin/dashboard")
      }
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Plateforme Entreprise Étudiante</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-foreground mb-4 text-balance">
              Connecter l'Innovation Étudiante avec les Leaders de l'Industrie
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Une plateforme où les étudiants entrepreneurs présentent leurs projets et les entreprises découvrent la
              prochaine génération de talents.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Student Card */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Étudiants</CardTitle>
                <CardDescription className="text-base">
                  Présentez vos projets entrepreneuriaux et connectez-vous avec des entreprises
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" size="lg" onClick={() => router.push("/student/login")}>
                  Connexion Étudiant
                </Button>
              </CardContent>
            </Card>

            {/* Company Card */}
            <Card className="border-2 hover:border-accent transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">Entreprises</CardTitle>
                <CardDescription className="text-base">
                  Découvrez des projets étudiants innovants et des talents émergents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  size="lg"
                  onClick={() => router.push("/company/login")}
                >
                  Connexion Entreprise
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                  onClick={() => router.push("/company/register")}
                >
                  S'inscrire comme Entreprise
                </Button>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card className="border-2 hover:border-destructive transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Admin</CardTitle>
                <CardDescription className="text-base">
                  Gérer les utilisateurs de la plateforme et superviser tous les projets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full" size="lg" onClick={() => router.push("/admin/login")}>
                  Accès Admin
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Pour les Étudiants</h3>
              <p className="text-muted-foreground">
                Téléchargez des projets, des plans d'affaires et soyez découvert par les meilleures entreprises
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Pour les Entreprises</h3>
              <p className="text-muted-foreground">
                Parcourez des projets innovants, aimez vos favoris et contactez des entrepreneurs prometteurs
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Plateforme Sécurisée</h3>
              <p className="text-muted-foreground">
                Accès basé sur les rôles avec supervision administrative pour la qualité et la sécurité
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Plateforme Entreprise Étudiante - Connecter l'Innovation avec l'Opportunité</p>
        </div>
      </footer>
    </div>
  )
}
