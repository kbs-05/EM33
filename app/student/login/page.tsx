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
import { GraduationCap, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function StudentLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [matricule, setMatricule] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(matricule, password, "student")

    if (success) {
      router.push("/student/dashboard")
    } else {
      setError("Identifiants invalides. Vérifiez votre matricule et mot de passe.")
    }

    setIsLoading(false)
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
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Connexion Étudiant</CardTitle>
            <CardDescription>Accédez à votre tableau de bord et gérez vos projets</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="matricule">Matricule</Label>
                <Input
                  id="matricule"
                  type="text"
                  placeholder="MAT001"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">Demo: MAT001 / n'importe quel mot de passe</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
