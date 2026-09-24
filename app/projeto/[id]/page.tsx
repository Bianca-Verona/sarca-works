"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import {
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";

import { db } from "@/app/lib/firebase";

type Projeto = {
  id: string;
  ordem: number;
  nome: string;
  categoria: string;
  descricao: string;
  status: "Publicado" | "Rascunho";
  url: string;
  capa: string;
  tamanho: "grande" | "media" | "pequena";
};

const C = {
  forestDeep: "#0F241C",
  forest: "#16342A",
  forestLight: "#1F4535",
  burnt: "#C1571F",
  burntSoft: "#D97A45",
  cream: "#F2E8D5",
  paper: "#E8DCBE",
  ink: "#1A1714",
  stone: "#8B8477",
};

function normalizarCapa(capa: string) {
  const valor = capa.trim();

  if (!valor) return "";

  if (
    valor.startsWith("/") ||
    valor.startsWith("http://") ||
    valor.startsWith("https://")
  ) {
    return valor;
  }

  return `/${valor.replace(/^\.?\//, "")}`;
}

export default function ProjetoPage() {
  const params = useParams();

  const id =
    typeof params.id === "string"
      ? params.id
      : "";

  const [projeto, setProjeto] =
    useState<Projeto | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState("");

  useEffect(() => {
    if (!id) return;

    async function carregarProjeto() {
      try {
        setCarregando(true);
        setErro("");

        const referencia = doc(
          db,
          "projects",
          id
        );

        const resultado =
          await getDoc(referencia);

        if (!resultado.exists()) {
          setErro(
            "Projeto não encontrado."
          );
          return;
        }

        const dados =
          resultado.data();

        if (
          dados.status !==
          "Publicado"
        ) {
          setErro(
            "Este projeto ainda não está publicado."
          );
          return;
        }

        const tamanhoValido =
          dados.tamanho === "grande" ||
          dados.tamanho === "media" ||
          dados.tamanho === "pequena";

        const projetoCarregado: Projeto = {
          id: resultado.id,

          ordem:
            typeof dados.ordem === "number"
              ? dados.ordem
              : 999,

          nome:
            typeof dados.nome === "string"
              ? dados.nome
              : "Projeto",

          categoria:
            typeof dados.categoria ===
            "string"
              ? dados.categoria
              : "Projeto digital",

          descricao:
            typeof dados.descricao ===
            "string"
              ? dados.descricao
              : "",

          status: "Publicado",

          url:
            typeof dados.url === "string"
              ? dados.url
              : "",

          capa:
            typeof dados.capa === "string"
              ? normalizarCapa(
                  dados.capa
                )
              : "",

          tamanho:
            tamanhoValido
              ? dados.tamanho
              : "media",
        };

        setProjeto(
          projetoCarregado
        );
      } catch (error) {
        console.error(
          "Erro ao carregar projeto:",
          error
        );

        setErro(
          "Não foi possível carregar este projeto."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarProjeto();
  }, [id]);

  if (carregando) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor:
            C.forestDeep,
          color: C.cream,
        }}
      >
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{
            fontFamily:
              "monospace",
            color: C.stone,
          }}
        >
          carregando projeto...
        </p>
      </main>
    );
  }

  if (erro || !projeto) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
        style={{
          backgroundColor:
            C.forestDeep,
          color: C.cream,
        }}
      >
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{
            fontFamily:
              "monospace",
            color: C.burnt,
          }}
        >
          SARÇA WORKS
        </p>

        <h1
          className="mt-5 text-5xl italic"
          style={{
            fontFamily:
              "Georgia, serif",
          }}
        >
          {erro ||
            "Projeto não encontrado."}
        </h1>

        <a
          href="/#trabalhos"
          className="mt-8 inline-flex items-center gap-2 border px-5 py-3 text-xs uppercase"
          style={{
            borderColor:
              "rgba(242,232,213,0.3)",
            fontFamily:
              "monospace",
          }}
        >
          <ArrowLeft size={15} />
          Voltar aos trabalhos
        </a>
      </main>
    );
  }

  const temLink =
    projeto.url.trim().length > 0;

  const linkInterno =
    projeto.url.startsWith("/");

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor:
          C.forestDeep,
        color: C.cream,
      }}
    >
      {/* HEADER */}

      <header
        className="border-b"
        style={{
          borderColor:
            "rgba(242,232,213,0.15)",
        }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
          <a
            href="/#trabalhos"
            className="inline-flex items-center gap-2 text-xs uppercase"
            style={{
              fontFamily:
                "monospace",
              color: C.stone,
            }}
          >
            <ArrowLeft size={15} />
            Todos os trabalhos
          </a>

          <span
            className="text-xs"
            style={{
              fontFamily:
                "monospace",
              color: C.burnt,
            }}
          >
            SARÇA WORKS
          </span>
        </div>
      </header>

      {/* HERO */}

      <section className="px-6 pb-20 pt-14 md:px-10 md:pb-28 md:pt-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p
                className="text-xs uppercase tracking-[0.12em]"
                style={{
                  fontFamily:
                    "monospace",
                  color:
                    C.burntSoft,
                }}
              >
                {String(
                  projeto.ordem
                ).padStart(2, "0")}{" "}
                / {projeto.categoria}
              </p>

              <h1
                className="mt-5 text-6xl italic leading-[0.92] md:text-8xl"
                style={{
                  fontFamily:
                    "Georgia, serif",
                }}
              >
                {projeto.nome}
              </h1>

              <p
                className="mt-7 max-w-xl text-lg leading-relaxed"
                style={{
                  color:
                    "rgba(242,232,213,0.75)",
                }}
              >
                {projeto.descricao}
              </p>

              {temLink && (
                <a
                  href={projeto.url}
                  target={
                    linkInterno
                      ? undefined
                      : "_blank"
                  }
                  rel={
                    linkInterno
                      ? undefined
                      : "noreferrer"
                  }
                  className="mt-8 inline-flex items-center gap-3 px-6 py-3.5 text-xs uppercase"
                  style={{
                    backgroundColor:
                      C.burnt,
                    fontFamily:
                      "monospace",
                    color: C.cream,
                  }}
                >
                  ACESSAR PROJETO
                  <ArrowUpRight
                    size={16}
                  />
                </a>
              )}
            </div>

            {/* CAPA */}

            <div
              className="relative min-h-[360px] overflow-hidden border md:min-h-[520px]"
              style={{
                borderColor:
                  "rgba(242,232,213,0.18)",
                backgroundColor:
                  C.forest,
              }}
            >
              {projeto.capa ? (
                <img
                  src={projeto.capa}
                  alt={`Capa de ${projeto.nome}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      `linear-gradient(145deg, ${C.forestLight}, ${C.forestDeep})`,
                  }}
                />
              )}

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(15,36,28,0.05), rgba(15,36,28,0.6))",
                }}
              />

              <div className="absolute left-5 top-5">
                <span
                  className="border px-3 py-2 text-[10px] uppercase"
                  style={{
                    borderColor:
                      "rgba(242,232,213,0.5)",
                    backgroundColor:
                      "rgba(15,36,28,0.6)",
                    fontFamily:
                      "monospace",
                  }}
                >
                  projeto{" "}
                  {String(
                    projeto.ordem
                  ).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE */}

      <section
        className="border-y px-6 py-20 md:px-10 md:py-28"
        style={{
          borderColor:
            "rgba(242,232,213,0.15)",
          backgroundColor:
            C.forest,
        }}
      >
        <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p
              className="text-xs uppercase tracking-[0.15em]"
              style={{
                fontFamily:
                  "monospace",
                color: C.burnt,
              }}
            >
              sobre o projeto
            </p>

            <h2
              className="mt-4 text-4xl italic md:text-5xl"
              style={{
                fontFamily:
                  "Georgia, serif",
              }}
            >
              A ideia por trás.
            </h2>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <p
              className="text-lg leading-relaxed md:text-xl"
              style={{
                color:
                  "rgba(242,232,213,0.82)",
              }}
            >
              {projeto.descricao}
            </p>

            <p
              className="mt-7 text-lg italic leading-relaxed md:text-xl"
              style={{
                color:
                  C.burntSoft,
              }}
            >
              Cada projeto da SARÇA
              nasce de uma ideia e
              ganha forma através de
              design, tecnologia e
              experiência.
            </p>
          </div>
        </div>
      </section>

      {/* FICHA */}

      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1100px]">
          <div
            className="border-t pt-6"
            style={{
              borderColor:
                "rgba(242,232,213,0.2)",
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.15em]"
              style={{
                fontFamily:
                  "monospace",
                color: C.stone,
              }}
            >
              ficha do projeto
            </p>

            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              <div>
                <p
                  className="text-xs uppercase"
                  style={{
                    fontFamily:
                      "monospace",
                    color: C.stone,
                  }}
                >
                  categoria
                </p>

                <p className="mt-2 text-lg">
                  {projeto.categoria}
                </p>
              </div>

              <div>
                <p
                  className="text-xs uppercase"
                  style={{
                    fontFamily:
                      "monospace",
                    color: C.stone,
                  }}
                >
                  formato
                </p>

                <p className="mt-2 text-lg">
                  Experiência digital
                </p>
              </div>

              <div>
                <p
                  className="text-xs uppercase"
                  style={{
                    fontFamily:
                      "monospace",
                    color: C.stone,
                  }}
                >
                  SARÇA
                </p>

                <p className="mt-2 text-lg">
                  Design + Digital
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section
        className="border-t px-6 py-24 text-center md:px-10 md:py-32"
        style={{
          borderColor:
            "rgba(242,232,213,0.15)",
        }}
      >
        <p
          className="text-xs uppercase tracking-[0.18em]"
          style={{
            fontFamily:
              "monospace",
            color: C.stone,
          }}
        >
          gostou da ideia?
        </p>

        <h2
          className="mx-auto mt-5 max-w-2xl text-5xl italic md:text-7xl"
          style={{
            fontFamily:
              "Georgia, serif",
          }}
        >
          Vamos criar a próxima.
        </h2>

        <a
          href="https://wa.me/5511947610231?text=Oi!%20Conheci%20a%20SAR%C3%87A%20WORKS%20e%20quero%20conversar%20sobre%20um%20projeto.%20%F0%9F%94%A5"
          target="_blank"
          rel="noreferrer"
          className="mt-9 inline-flex items-center gap-3 px-7 py-3.5 text-xs uppercase"
          style={{
            backgroundColor:
              C.burnt,
            fontFamily:
              "monospace",
          }}
        >
          COMEÇAR UM PROJETO
          <ArrowUpRight
            size={16}
          />
        </a>
      </section>

      {/* FOOTER */}

      <footer
        className="border-t px-6 py-8 md:px-10"
        style={{
          borderColor:
            "rgba(242,232,213,0.15)",
        }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-5">
          <span
            className="text-xs"
            style={{
              fontFamily:
                "monospace",
              color: C.stone,
            }}
          >
            SARÇA WORKS
          </span>

          <a
            href="/#trabalhos"
            className="text-xs uppercase"
            style={{
              fontFamily:
                "monospace",
              color: C.stone,
            }}
          >
            voltar
          </a>
        </div>
      </footer>
    </main>
  );
}