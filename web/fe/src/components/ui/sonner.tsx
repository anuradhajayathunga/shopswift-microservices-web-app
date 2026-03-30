"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { 
  CheckCircle2Icon, 
  InfoIcon, 
  AlertTriangleIcon, 
  XCircleIcon, 
  Loader2Icon 
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // Position it beautifully based on your app layout (bottom-right is standard SaaS)
      position="bottom-right"
      icons={{
        success: <CheckCircle2Icon className="size-4.5 text-emerald-500" />,
        info: <InfoIcon className="size-4.5 text-blue-500" />,
        warning: <AlertTriangleIcon className="size-4.5 text-amber-500" />,
        error: <XCircleIcon className="size-4.5 text-red-500" />,
        loading: <Loader2Icon className="size-4.5 text-muted-foreground animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          // Base Toast Styling: Glassmorphism, subtle borders, premium shadows
          toast:
            "group toast group-[.toaster]:bg-background/80 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-border/50 group-[.toaster]:shadow-xl group-[.toaster]:shadow-black/5 dark:group-[.toaster]:shadow-black/20 group-[.toaster]:rounded-xl px-4 py-3.5 border transition-all flex gap-3",
          
          // Typography
          title: "font-medium text-[14px] leading-none",
          description: "group-[.toast]:text-muted-foreground text-[13px] leading-relaxed mt-1.5",
          
          // Buttons
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium rounded-md px-3 py-1.5 text-xs transition-transform active:scale-95",
          cancelButton:
            "group-[.toast]:bg-secondary group-[.toast]:text-secondary-foreground font-medium rounded-md px-3 py-1.5 text-xs transition-transform active:scale-95",
            
          // Close Button (If you enable closeButton prop)
          closeButton: 
            "group-[.toast]:bg-transparent group-[.toast]:text-muted-foreground hover:group-[.toast]:text-foreground hover:group-[.toast]:bg-secondary/50 transition-colors rounded-md",

          // State overrides (We rely on icon colors now, but we can add subtle border hints if desired)
          success: "group-[.toaster]:border-emerald-500/10",
          error: "group-[.toaster]:border-red-500/10",
          warning: "group-[.toaster]:border-amber-500/10",
          info: "group-[.toaster]:border-blue-500/10",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }