"use client"

import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  CardDescription,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card"

export function SectionCards({stats}:any) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Commandée</CardDescription>
          <CardTitle className="text-warning text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.qteCommander?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon
              />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total des commandes effectuées {" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Toutes les commandes
          </div>
        </CardFooter>
      </Card>
       <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total programmée</CardDescription>
          <CardTitle className="text-warning text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.qteProgrammer?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon
              />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Quantité programmée{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Total programmée</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total livrée</CardDescription>
          <CardTitle className="text-warning text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.qteLivre?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDownIcon
              />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Quantité total livrée{" "}
            <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Toutes les livraisons
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total vendue</CardDescription>
          <CardTitle className="text-warning text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.qteVendue?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon
              />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Quantité totale vendue{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Toutes les ventes</div>
        </CardFooter>
      </Card>
    </div>
  )
}
