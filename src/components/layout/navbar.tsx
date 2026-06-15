"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, LogOut, Settings, User, Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlobalSearch } from "@/components/search/global-search";
export function Navbar() {
  const { data: session } = useSession();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm">
      {" "}
      <div className="flex-1 max-w-md">
        {" "}
        <GlobalSearch />{" "}
      </div>{" "}
      <div className="flex items-center gap-2">
        {" "}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="text-muted-foreground hover:text-foreground"
        >
          {" "}
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}{" "}
        </Button>{" "}
        <DropdownMenu>
          {" "}
          <DropdownMenuTrigger >
            {" "}
            <Button variant="ghost" size="icon" className="rounded-full">
              {" "}
              <Avatar className="h-8 w-8">
                {" "}
                <AvatarImage src={session?.user?.image ?? undefined} />{" "}
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {" "}
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "?"}{" "}
                </AvatarFallback>{" "}
              </Avatar>{" "}
            </Button>{" "}
          </DropdownMenuTrigger>{" "}
          <DropdownMenuContent align="end" className="w-56">
            {" "}
            <div className="flex items-center gap-2 px-2 py-1.5">
              {" "}
              <div className="flex flex-col">
                {" "}
                <p className="text-sm font-medium">
                  {session?.user?.name}
                </p>{" "}
                <p className="text-xs text-muted-foreground">
                  {" "}
                  {session?.user?.email}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <DropdownMenuSeparator />{" "}
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>
              {" "}
              <User className="mr-2 h-4 w-4" /> Perfil{" "}
            </DropdownMenuItem>{" "}
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>
              {" "}
              <Settings className="mr-2 h-4 w-4" /> Configurações{" "}
            </DropdownMenuItem>{" "}
            <DropdownMenuSeparator />{" "}
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              {" "}
              <LogOut className="mr-2 h-4 w-4" /> Sair{" "}
            </DropdownMenuItem>{" "}
          </DropdownMenuContent>{" "}
        </DropdownMenu>{" "}
      </div>{" "}
    </header>
  );
}
