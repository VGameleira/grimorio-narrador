"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  LayoutDashboard,
  Swords,
  Bot,
  Sparkles,
  StickyNote,
  BookText,
  ScrollText,
  Dices,
  UserPlus,
  Skull,
  LucideIcon,
} from "lucide-react";
type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  masterOnly?: boolean;
};
const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Campanhas", href: "/campaigns", icon: Swords },
  {
    label: "Assistente IA",
    href: "/ai-assistant",
    icon: Bot,
    masterOnly: true,
  },
  { label: "Grimório", href: "/grimorio", icon: BookText },
  { label: "Inimigos", href: "/geradores/inimigos", icon: Skull },
  { label: "Dados", href: "/geradores/dados", icon: Dices },
  { label: "Personagens", href: "/personagens/novo", icon: UserPlus },
  { label: "Biblioteca", href: "/biblioteca", icon: BookOpen },
  { label: "Notas", href: "/notes", icon: StickyNote },
];
export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isMaster = session?.user?.role === "MASTER";
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      {" "}
      <div className="flex h-full flex-col">
        {" "}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 border-b border-border px-6 py-5"
        >
          {" "}
          <ScrollText className="h-7 w-7 text-primary" />{" "}
          <div>
            {" "}
            <h1 className="text-lg font-bold text-gradient">Grimório</h1>{" "}
            <p className="text-xs text-muted-foreground">do Narrador</p>{" "}
          </div>{" "}
        </Link>{" "}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {" "}
          {mainNav.map((item) => {
            if (item.masterOnly && !isMaster) return null;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {" "}
                <item.icon className="h-4 w-4" /> {item.label}{" "}
              </Link>
            );
          })}{" "}
        </nav>{" "}
        <div className="border-t border-border p-4">
          {" "}
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            {" "}
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              {" "}
              <span className="text-xs font-bold text-primary">
                {" "}
                {session?.user?.name?.charAt(0)?.toUpperCase() || "?"}{" "}
              </span>{" "}
            </div>{" "}
            <div className="flex-1 min-w-0">
              {" "}
              <p className="text-sm font-medium truncate">
                {" "}
                {session?.user?.name || "Narrador"}{" "}
              </p>{" "}
              <p className="text-xs text-muted-foreground">
                {" "}
                {isMaster ? "Mestre" : "Jogador"}{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </aside>
  );
}
