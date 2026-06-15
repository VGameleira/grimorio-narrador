"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { registerSchema } from "@/lib/validations";
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao criar conta");
        return;
      }
      router.push("/login?registered=true");
    } catch {
      setError("Ocorreu um erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card>
      {" "}
      <CardHeader>
        {" "}
        <CardTitle className="text-center">Criar Conta</CardTitle>{" "}
        <CardDescription className="text-center">
          {" "}
          Cadastre-se para começar suas campanhas{" "}
        </CardDescription>{" "}
      </CardHeader>{" "}
      <CardContent>
        {" "}
        <form onSubmit={handleSubmit} className="space-y-4">
          {" "}
          {error && (
            <Alert variant="destructive">
              {" "}
              <AlertCircle className="h-4 w-4" />{" "}
              <AlertDescription>{error}</AlertDescription>{" "}
            </Alert>
          )}{" "}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="name">Nome</Label>{" "}
            <Input
              id="name"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="email">Email</Label>{" "}
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="password">Senha</Label>{" "}
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>{" "}
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />{" "}
          </div>{" "}
          <Button type="submit" className="w-full" disabled={loading}>
            {" "}
            {loading ? (
              <>
                {" "}
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando
                conta...{" "}
              </>
            ) : (
              "Criar Conta"
            )}{" "}
          </Button>{" "}
        </form>{" "}
      </CardContent>{" "}
      <CardFooter className="flex justify-center">
        {" "}
        <p className="text-sm text-muted-foreground">
          {" "}
          Já tem conta?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium"
          >
            {" "}
            Fazer login{" "}
          </Link>{" "}
        </p>{" "}
      </CardFooter>{" "}
    </Card>
  );
}
