import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "glass" | "gradient" | "neon" }
>(({ className, variant = "default", ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-2xl border text-card-foreground shadow-sm transition-all duration-300 font-sans group relative overflow-hidden",
            variant === "default" && "bg-zinc-900 border-zinc-800 hover:border-primary/30 shadow-lg hover:shadow-xl",
            variant === "glass" && "bg-zinc-900/80 backdrop-blur-xl border-zinc-800 shadow-glass hover:bg-zinc-900 hover:border-zinc-700 hover:shadow-cyan-500/5",
            variant === "gradient" && "bg-gradient-to-br from-zinc-900 to-black border-zinc-800 hover:border-primary/50",
            variant === "neon" && "bg-zinc-900 border-primary/30 shadow-[0_0_20px_rgba(6,182,212,0.05)] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-primary/60",
            className
        )}
        {...props}
    >
        {variant !== 'default' && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}
        <div className="relative z-10 h-full">
            {props.children}
        </div>
    </div>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-bold leading-none tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-primary group-hover:to-primary/80 transition-colors",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground leading-relaxed", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
