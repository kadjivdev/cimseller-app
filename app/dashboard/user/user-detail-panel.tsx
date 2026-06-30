// user-detail-panel.tsx
export function UserDetailPanel({ user }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Rôle</p>
        <p className="font-medium">{user.role?.name || "—"}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Statut</p>
        <p className="font-medium">{user.status || "—"}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Créé le</p>
        <p className="font-medium">
          {new Date(user.created_at).toLocaleDateString("fr-FR")}
        </p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Permissions</p>
        <p className="font-medium">{user.role?.permissions?.length || 0} permission(s)</p>
      </div>
    </div>
  )
}