"use client";

import { Bot, CreditCard, LayoutDashboard, Plus, Presentation, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useProject from "@/hooks/use-project";

// Définition des éléments de navigation avec icônes et couleurs
const navigationItems = [
    {
        title: "Tableau de bord",
        url: "/dashboard",
        icon: LayoutDashboard,
        color: "from-blue-500 to-blue-600",
        bgColor: "from-blue-500/10 to-blue-600/10",
    },
    {
        title: "Questions & Réponses",
        url: "/qa",
        icon: Bot,
        color: "from-purple-500 to-purple-600",
        bgColor: "from-purple-500/10 to-purple-600/10",
        badge: "IA",
    },
    {
        title: "Réunions",
        url: "/meetings",
        icon: Presentation,
        color: "from-green-500 to-green-600",
        bgColor: "from-green-500/10 to-green-600/10",
    },
    {
        title: "Facturation",
        url: "/billing",
        icon: CreditCard,
        color: "from-orange-500 to-orange-600",
        bgColor: "from-orange-500/10 to-orange-600/10",
    },
]

export function AppSidebar() {
    const pathname = usePathname()
    const { open } = useSidebar()
    const {projects, projectId, setProjectId} = useProject()

    return (
        <TooltipProvider delayDuration={300}>
            <Sidebar 
                collapsible="icon" 
                variant="floating" 
                className="border-r border-border/40 bg-gradient-to-b from-background/95 via-background/90 to-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-2xl shadow-black/5"
            >
                <SidebarHeader className="border-b border-border/30 px-6 py-6">
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-primary/40 via-primary/20 to-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 blur-md opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            <Image 
                                src="/logo.png" 
                                alt="logo" 
                                width={40} 
                                height={40} 
                                className="relative rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl" 
                            />
                        </div>
                        {open && (
                            <div className="flex flex-col space-y-1">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                                    Mem&apos;s PlaniFy
                                </h1>
                                <div className="flex items-center gap-1">
                                    <Sparkles className="size-3 text-primary" />
                                    <p className="text-xs text-muted-foreground font-medium">
                                       SaaS AI GitHub
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </SidebarHeader>

                <SidebarContent className="px-3 py-6 space-y-6">
                    {/* Navigation principale */}
                    <SidebarGroup>
                        <SidebarGroupLabel className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                            Navigation
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-2">
                                {navigationItems.map((item) => {
                                    const isActive = pathname === item.url;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <SidebarMenuButton asChild>
                                                        <Link
                                                            href={item.url}
                                                            className={cn(
                                                                "group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-black/5",
                                                                {
                                                                    [`bg-gradient-to-r ${item.color} text-white shadow-xl shadow-black/10`]: isActive,
                                                                    [`hover:bg-gradient-to-r ${item.bgColor} hover:text-foreground`]: !isActive,
                                                                    "text-muted-foreground": !isActive
                                                                }
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "flex items-center justify-center transition-all duration-300",
                                                                {
                                                                    "text-white": isActive,
                                                                    "text-muted-foreground group-hover:text-foreground": !isActive
                                                                }
                                                            )}>
                                                                <item.icon className="size-5" />
                                                            </div>
                                                            {open && (
                                                                <div className="flex flex-col flex-1 min-w-0">
                                                                    <span className="truncate font-semibold">{item.title}</span>
                                                                </div>
                                                            )}
                                                            {item.badge && open && (
                                                                <Badge 
                                                                    variant="secondary" 
                                                                    className={cn(
                                                                        "ml-auto text-xs px-2 py-0.5 font-bold",
                                                                        {
                                                                            "bg-white/20 text-white border-white/30": isActive,
                                                                            "bg-muted/50 text-muted-foreground": !isActive
                                                                        }
                                                                    )}
                                                                >
                                                                    {item.badge}
                                                                </Badge>
                                                            )}
                                                            {isActive && (
                                                                <div className="absolute right-3 size-2 rounded-full bg-white shadow-sm" />
                                                            )}
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </TooltipTrigger>
                                                {!open && (
                                                    <TooltipContent side="right" className="bg-background/95 backdrop-blur-sm border-border/50 shadow-xl">
                                                        <div className="space-y-1">
                                                            <p className="font-bold">{item.title}</p>
                                                        </div>
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <div className="border-t border-border/30" />

                    {/* Section Projets */}
                    <SidebarGroup>
                        <SidebarGroupLabel className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                            Vos Projets
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-2">
                                {projects?.map(project => {
                                    const isActive = project.id === projectId;
                                    return (
                                        <SidebarMenuItem key={project.name}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <SidebarMenuButton asChild>
                                                        <div 
                                                            onClick={() => setProjectId(project.id)}
                                                            className={cn(
                                                                "group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-black/5",
                                                                {
                                                                    "bg-gradient-to-r from-primary/15 to-primary/10 border border-primary/20 text-primary shadow-lg": isActive,
                                                                    "text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground": !isActive
                                                                }
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "flex size-8 items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 shadow-sm",
                                                                {
                                                                    "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md": isActive,
                                                                    "bg-muted text-muted-foreground group-hover:bg-accent-foreground group-hover:text-accent": !isActive
                                                                }
                                                            )}>
                                                                {project.name[0]}
                                                            </div>
                                                            {open && (
                                                                <div className="flex flex-col flex-1 min-w-0">
                                                                    <span className="truncate font-semibold">{project.name}</span>
                                                                </div>
                                                            )}
                                                            {isActive && (
                                                                <div className="absolute right-3 size-2 rounded-full bg-primary shadow-sm" />
                                                            )}
                                                        </div>
                                                    </SidebarMenuButton>
                                                </TooltipTrigger>
                                                {!open && (
                                                    <TooltipContent side="right" className="bg-background/95 backdrop-blur-sm border-border/50 shadow-xl">
                                                        <div className="space-y-1">
                                                            <p className="font-bold">{project.name}</p>
                                                        </div>
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        </SidebarMenuItem>
                                    )
                                })}

                                {/* Bouton Créer un projet */}
                                <div className="px-3 py-2">
                                    {open ? (
                                        <Link href="/create-project" className="w-full">
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="w-full gap-3 border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all duration-300 group rounded-2xl"
                                            >
                                                <Plus className="size-4 group-hover:scale-110 transition-transform duration-300" />
                                                <span className="font-bold">Créer un projet</span>
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link href="/create-project" className="w-full">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline" 
                                                        className="w-full h-11 w-11 p-0 border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all duration-300 group rounded-2xl"
                                                    >
                                                        <Plus className="size-4 group-hover:scale-110 transition-transform duration-300" />
                                                    </Button>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="bg-background/95 backdrop-blur-sm border-border/50 shadow-xl">
                                                <p className="font-bold">Créer un projet</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </TooltipProvider>
    );
}
