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
import { Shield, ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"
import { ADMIN_ACCESS_CODE } from "@/lib/mock-data"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Admin login uses access code as password
    const success = await login(email, accessCode, "admin")

    if (success) {
      router.push("/admin/dashboard")
    } else {
      setError("Identifiants ou code d'accès invalide. Veuillez vérifier vos informations.")
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
        <Card className="w-full max-w-md border-destructive/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-3xl">Accès Admin</CardTitle>
            <CardDescription>Connexion sécurisée pour les administrateurs de la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Alert className="bg-destructive/10 border-destructive/20">
                <Lock className="w-4 h-4" />
                <AlertDescription className="text-foreground">
                  L'accès admin nécessite un code d'accès spécial. Les tentatives d'accès non autorisées sont
                  enregistrées.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="email">Email Admin</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@platform.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessCode">Code d'Accès</Label>
                <Input
                  id="accessCode"
                  type="password"
                  placeholder="Entrez le code d'accès admin"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="destructive" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Vérification..." : "Accéder au Tableau de Bord Admin"}
              </Button>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Demo: admin@example.com / {ADMIN_ACCESS_CODE}
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
