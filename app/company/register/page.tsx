"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CompanyRegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    industry: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await register(formData.email, formData.password, formData.name, "company", {
      companyName: formData.companyName,
      industry: formData.industry,
    })

    if (success) {
      router.push("/company/dashboard")
    } else {
      setError("Échec de l'inscription. Cet email est peut-être déjà enregistré.")
    }

    setIsLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-accent" />
            </div>
            <CardTitle className="text-3xl">Inscription Entreprise</CardTitle>
            <CardDescription>Créez votre compte pour découvrir des projets étudiants innovants</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'Entreprise</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Tech Innovations Inc"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom de la Personne de Contact</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Créer un mot de passe"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industrie</Label>
                <Input
                  id="industry"
                  type="text"
                  placeholder="Technologie"
                  value={formData.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Création du compte..." : "Créer un compte"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Vous avez déjà un compte?{" "}
                <Link href="/company/login" className="text-accent hover:underline">
                  Connectez-vous ici
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
