"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
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
import { loginSchema } from "@/lib/validations";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Email ou senha inválidos");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Ocorreu um erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card>
      {" "}
      <CardHeader>
        {" "}
        <CardTitle className="text-center">Entrar</CardTitle>{" "}
        <CardDescription className="text-center">
          {" "}
          Acesse seu grimório de campanhas{" "}
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
          <Button type="submit" className="w-full" disabled={loading}>
            {" "}
            {loading ? (
              <>
                {" "}
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                Entrando...{" "}
              </>
            ) : (
              "Entrar"
            )}{" "}
          </Button>{" "}
        </form>{" "}
      </CardContent>{" "}
      <CardFooter className="flex justify-center">
        {" "}
        <p className="text-sm text-muted-foreground">
          {" "}
          Não tem conta?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 font-medium"
          >
            {" "}
            Criar conta{" "}
          </Link>{" "}
        </p>{" "}
      </CardFooter>{" "}
    </Card>
  );
}
