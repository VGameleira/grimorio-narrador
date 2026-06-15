import { ScrollText } from "lucide-react";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {" "}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        {" "}
        <div className="w-full max-w-sm">
          {" "}
          <div className="mb-8 flex items-center justify-center gap-3">
            {" "}
            <ScrollText className="h-8 w-8 text-primary" />{" "}
            <div>
              {" "}
              <h1 className="text-2xl font-bold text-gradient">
                Grimório
              </h1>{" "}
              <p className="text-sm text-muted-foreground">do Narrador</p>{" "}
            </div>{" "}
          </div>{" "}
          {children}{" "}
        </div>{" "}
      </div>{" "}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-accent/5 to-purple-500/10 items-center justify-center">
        {" "}
        <div className="max-w-md text-center">
          {" "}
          <ScrollText className="mx-auto h-24 w-24 text-primary/30" />{" "}
          <h2 className="mt-6 text-2xl font-bold text-gradient">
            {" "}
            Seu grimório de campanhas{" "}
          </h2>{" "}
          <p className="mt-3 text-muted-foreground">
            {" "}
            Gerencie NPCs, missões, facções e muito mais. O poder de criar
            histórias incríveis está em suas mãos.{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
