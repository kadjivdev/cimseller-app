import * as React from "react"

import { cn } from "@/lib/utils"

interface DrawerContextValue {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  direction: "right" | "bottom"
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null)

function useDrawerContext() {
  const context = React.useContext(DrawerContext)
  if (!context) {
    throw new Error("Drawer components must be used within a Drawer")
  }
  return context
}

function Drawer({
  children,
  direction = "right",
}: {
  children: React.ReactNode
  direction?: "right" | "bottom"
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <DrawerContext.Provider value={{ open, setOpen, direction }}>
      {children}
    </DrawerContext.Provider>
  )
}

function DrawerTrigger({
  asChild,
  children,
}: {
  asChild?: boolean
  children: React.ReactNode
}) {
  const { setOpen } = useDrawerContext()

  if (!React.isValidElement(children)) {
    return null
  }

  const triggerProps = {
    onClick: () => setOpen(true),
  }

  return asChild
    ? React.cloneElement(children, triggerProps)
    : <button type="button" onClick={() => setOpen(true)}>{children}</button>
}

function DrawerContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen, direction } = useDrawerContext()

  if (!open) {
    return null
  }

  const panelClasses =
    direction === "bottom"
      ? "fixed inset-x-0 bottom-0 z-50 h-3/5 overflow-auto rounded-t-3xl bg-background p-4 shadow-2xl"
      : "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-auto bg-background p-4 shadow-2xl"

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-end bg-black/40" onClick={() => setOpen(false)}>
      <div
        className={cn(panelClasses, className)}
        onClick={(event) => event.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 flex flex-col gap-1", className)} {...props} />
  )
}

function DrawerTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-lg font-semibold", className)} {...props} />
  )
}

function DrawerDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
}

function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-4 flex flex-wrap gap-2", className)} {...props} />
  )
}

function DrawerClose({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  const { setOpen } = useDrawerContext()

  if (!React.isValidElement(children)) {
    return null
  }

  const closeProps = {
    onClick: () => setOpen(false),
  }

  return asChild
    ? React.cloneElement(children, closeProps)
    : <button type="button" onClick={() => setOpen(false)}>{children}</button>
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
}
