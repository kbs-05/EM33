"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Building2, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Company } from "@/lib/types"

export function CompanyNav() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const company = user as Company

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Tableau de Bord Entreprise</h1>
              <p className="text-sm text-muted-foreground">{company?.companyName || user?.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
    </header>
  )
}
