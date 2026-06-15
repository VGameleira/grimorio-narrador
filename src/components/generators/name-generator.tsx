"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Copy, Check } from "lucide-react";
import { toast } from "sonner";
const japaneseNames = {
  male: [
    "Haruki",
    "Ryo",
    "Kaito",
    "Sora",
    "Yuki",
    "Ren",
    "Hiroshi",
    "Takashi",
    "Kenji",
    "Satoshi",
    "Daisuke",
    "Takeshi",
    "Shinji",
    "Kazuki",
    "Ryota",
    "Shota",
    "Yudai",
    "Kenta",
    "Tsubasa",
    "Hayato",
  ],
  female: [
    "Yuki",
    "Sakura",
    "Hana",
    "Aoi",
    "Rin",
    "Miyuki",
    "Akari",
    "Yua",
    "Mei",
    "Koharu",
    "Himari",
    "Yuna",
    "Saki",
    "Ayaka",
    "Misaki",
    "Nanami",
    "Riko",
    "Mao",
    "Natsuki",
    "Chihiro",
  ],
  surname: [
    "Tanaka",
    "Suzuki",
    "Takahashi",
    "Watanabe",
    "Ito",
    "Yamamoto",
    "Nakamura",
    "Kobayashi",
    "Kato",
    "Yoshida",
    "Yamada",
    "Sasaki",
    "Matsumoto",
    "Inoue",
    "Kimura",
    "Hayashi",
    "Shimizu",
    "Yamaguchi",
  ],
};
const portugueseNames = {
  male: [
    "Lucas",
    "Mateus",
    "Gabriel",
    "Rafael",
    "Felipe",
    "Thiago",
    "Rodrigo",
    "Bruno",
    "Carlos",
    "Eduardo",
    "Vinicius",
    "Pedro",
    "João",
    "Paulo",
    "Marcos",
    "Leonardo",
    "André",
    "Diego",
    "Gustavo",
    "Daniel",
  ],
  female: [
    "Isabella",
    "Sophia",
    "Alice",
    "Manuela",
    "Laura",
    "Valentina",
    "Helena",
    "Gabriela",
    "Beatriz",
    "Clara",
    "Mariana",
    "Júlia",
    "Vitória",
    "Fernanda",
    "Ana",
    "Luiza",
    "Camila",
    "Amanda",
    "Larissa",
    "Rafaela",
  ],
  surname: [
    "Silva",
    "Santos",
    "Oliveira",
    "Souza",
    "Rodrigues",
    "Ferreira",
    "Alves",
    "Pereira",
    "Lima",
    "Gomes",
    "Costa",
    "Ribeiro",
    "Martins",
    "Carvalho",
    "Almeida",
    "Lopes",
    "Soares",
    "Barbosa",
  ],
};
type NameCategory = "japanese" | "portuguese";
export function NameGenerator() {
  const [category, setCategory] = useState<NameCategory>("japanese");
  const [names, setNames] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const generate = useCallback(() => {
    const pool = category === "japanese" ? japaneseNames : portugueseNames;
    const count = 5;
    const generated: string[] = [];
    for (let i = 0; i < count; i++) {
      const gender = Math.random() > 0.5 ? "male" : "female";
      const first =
        pool[gender][Math.floor(Math.random() * pool[gender].length)];
      const surname =
        pool.surname[Math.floor(Math.random() * pool.surname.length)];
      generated.push(`${first} ${surname}`);
    }
    setNames(generated);
    setCopiedIndex(null);
  }, [category]);
  async function copyName(name: string, index: number) {
    await navigator.clipboard.writeText(name);
    setCopiedIndex(index);
    toast.success("Nome copiado!");
    setTimeout(() => setCopiedIndex(null), 2000);
  }
  return (
    <Card>
      {" "}
      <CardHeader>
        {" "}
        <CardTitle>Gerador de Nomes</CardTitle>{" "}
      </CardHeader>{" "}
      <CardContent className="space-y-4">
        {" "}
        <div className="flex items-center gap-4">
          {" "}
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as NameCategory)}
          >
            {" "}
            <SelectTrigger className="w-[180px]">
              {" "}
              <SelectValue />{" "}
            </SelectTrigger>{" "}
            <SelectContent>
              {" "}
              <SelectItem value="japanese">Japoneses</SelectItem>{" "}
              <SelectItem value="portuguese">Portugueses</SelectItem>{" "}
            </SelectContent>{" "}
          </Select>{" "}
          <Button onClick={generate}>
            {" "}
            <RefreshCw className="mr-2 h-4 w-4" /> Gerar{" "}
          </Button>{" "}
        </div>{" "}
        {names.length > 0 && (
          <div className="space-y-2">
            {" "}
            {names.map((name, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                {" "}
                <span className="font-medium">{name}</span>{" "}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyName(name, i)}
                >
                  {" "}
                  {copiedIndex === i ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}{" "}
                </Button>{" "}
              </div>
            ))}{" "}
          </div>
        )}{" "}
      </CardContent>{" "}
    </Card>
  );
}
