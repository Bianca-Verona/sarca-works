"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Fraunces, JetBrains_Mono, Work_Sans } from "next/font/google";
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

/* ------------------------------------------------------------------ */
/* FONTES                                                             */
/* ------------------------------------------------------------------ */

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const sans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

/* ------------------------------------------------------------------ */
/* PALETA                                                             */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* PROJETO                                                            */
/* ------------------------------------------------------------------ */

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

const tamanhoClasses: Record<
  Projeto["tamanho"],
  string
> = {
  grande: "md:col-span-7 md:row-span-2",
  media: "md:col-span-5 md:row-span-2",
  pequena: "md:col-span-4 md:row-span-1",
};

function normalizarCapa(capa: string) {
  const valor = capa.trim();

  if (!valor) return "";

  if (
    valor.startsWith("/") ||
    valor.startsWith("http://") ||
    valor.startsWith("https://") ||
    valor.startsWith("data:image/")
  ) {
    return valor;
  }

  return `/${valor.replace(/^\.\//, "").replace(/^\//, "")}`;
}

/* ------------------------------------------------------------------ */
/* SERVIÇOS                                                           */
/* ------------------------------------------------------------------ */

type Servico = {
  numero: string;
  titulo: string;
  texto: string;
  nota: string;
};

const servicos: Servico[] = [
  {
    numero: "01",
    titulo: "Convites interativos",
    texto:
      "Convites que deixam de ser apenas informação e viram experiência.",
    nota: "casamentos · aniversários · eventos corporativos",
  },
  {
    numero: "02",
    titulo: "Sites",
    texto:
      "Sites feitos para apresentar, vender, divulgar ou simplesmente existir do jeito certo.",
    nota: "institucionais · landing pages · páginas de evento",
  },
  {
    numero: "03",
    titulo: "Experiências digitais",
    texto:
      "Flyers, páginas e experiências interativas para eventos, campanhas e projetos especiais.",
    nota: "campanhas · lançamentos · promoções",
  },
  {
    numero: "04",
    titulo: "Identidade visual",
    texto:
      "Marcas com personalidade, sistema visual e presença.",
    nota: "logos · direção visual · peças para redes",
  },
];

/* ------------------------------------------------------------------ */
/* ETAPAS                                                             */
/* ------------------------------------------------------------------ */

const etapas = [
  {
    numero: "01",
    titulo: "IDEIA",
    texto: "Você conta o que imaginou.",
  },
  {
    numero: "02",
    titulo: "CONCEITO",
    texto:
      "Transformamos a ideia em uma direção visual.",
  },
  {
    numero: "03",
    titulo: "CRIAÇÃO",
    texto: "Desenvolvemos o projeto.",
  },
  {
    numero: "04",
    titulo: "ENTREGA",
    texto:
      "Você recebe uma experiência pronta para colocar no mundo.",
  },
];

const navLinks = [
  { label: "Trabalhos", href: "#trabalhos" },
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

/* ------------------------------------------------------------------ */
/* TEXTURA                                                            */
/* ------------------------------------------------------------------ */

function Grao() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.09] mix-blend-multiply"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* MARCA DE REGISTRO                                                  */
/* ------------------------------------------------------------------ */

function MarcaRegistro({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      className={`h-6 w-6 ${className}`}
      style={{ color: C.stone }}
    >
      <circle
        cx="20"
        cy="20"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      <line
        x1="20"
        y1="0"
        x2="20"
        y2="40"
        stroke="currentColor"
        strokeWidth="1"
      />

      <line
        x1="0"
        y1="20"
        x2="40"
        y2="20"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* REVEAL                                                             */
/* ------------------------------------------------------------------ */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, []);

  return {
    ref,
    visivel,
  };
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visivel } =
    useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        opacity: visivel ? 1 : 0,
        transform: visivel
          ? "translateY(0)"
          : "translateY(10px)",
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PÁGINA                                                             */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [menuAberto, setMenuAberto] =
    useState(false);

  const [rolou, setRolou] = useState(false);

  const [projetos, setProjetos] =
    useState<Projeto[]>([]);

  const [carregandoProjetos, setCarregandoProjetos] =
    useState(true);

  /* --------------------------------------------------------------- */
  /* CARREGA PROJETOS PUBLICADOS DO FIRESTORE                       */
  /* --------------------------------------------------------------- */

  useEffect(() => {
    async function carregarProjetos() {
      try {
        const snapshot = await getDocs(
          collection(db, "projects")
        );

        const projetosFirebase: Projeto[] =
          snapshot.docs
            .map((documento): Projeto => {
              const dados = documento.data();

              const tamanhoValido =
                dados.tamanho === "grande" ||
                dados.tamanho === "media" ||
                dados.tamanho === "pequena";

              const statusValido: Projeto["status"] =
                dados.status === "Publicado"
                  ? "Publicado"
                  : "Rascunho";

              const tamanho: Projeto["tamanho"] =
                tamanhoValido
                  ? (dados.tamanho as Projeto["tamanho"])
                  : "media";

              return {
                id: documento.id,

                ordem:
                  typeof dados.ordem === "number"
                    ? dados.ordem
                    : 999,

                nome:
                  typeof dados.nome === "string"
                    ? dados.nome
                    : "",

                categoria:
                  typeof dados.categoria === "string"
                    ? dados.categoria
                    : "Projeto digital",

                descricao:
                  typeof dados.descricao === "string"
                    ? dados.descricao
                    : "",

                status: statusValido,

                url:
                  typeof dados.url === "string"
                    ? dados.url
                    : "",

                capa:
                  typeof dados.capa === "string"
                    ? normalizarCapa(dados.capa)
                    : "",

                tamanho,
              };
            })
            .filter(
              (projeto) =>
                projeto.status === "Publicado"
            );

        projetosFirebase.sort(
          (a, b) => a.ordem - b.ordem
        );

        setProjetos(projetosFirebase);
      } catch (error) {
        console.error(
          "ERRO AO CARREGAR PROJETOS:",
          error
        );
      } finally {
        setCarregandoProjetos(false);
      }
    }

    carregarProjetos();
  }, []);

  /* --------------------------------------------------------------- */
  /* SCROLL                                                          */
  /* --------------------------------------------------------------- */

  useEffect(() => {
    const onScroll = () => {
      setRolou(window.scrollY > 24);
    };

    window.addEventListener(
      "scroll",
      onScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        onScroll
      );
    };
  }, []);

  return (
    <div
      id="topo"
      className={`${display.variable} ${mono.variable} ${sans.variable} font-sans`}
      style={{
        backgroundColor: C.forestDeep,
        color: C.cream,
      }}
    >
      <Grao />

      {/* ========================================================== */}
      {/* HEADER                                                     */}
      {/* ========================================================== */}

      <header
        className="sticky top-0 z-50 border-b transition-colors"
        style={{
          borderColor:
            "rgba(242,232,213,0.15)",
          backgroundColor: rolou
            ? "rgba(15,36,28,0.94)"
            : "transparent",
          backdropFilter: rolou
            ? "blur(6px)"
            : "none",
        }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
          <a
            href="#topo"
            className="flex items-center gap-3"
          >
            <Image
              src="/sarça%20logo.png"
              alt="Sarça Works"
              width={44}
              height={44}
              className="h-10 w-10 rounded-full md:h-11 md:w-11"
              priority
            />

            <span
              className="hidden text-sm tracking-wide sm:block"
              style={{
                fontFamily:
                  "var(--font-mono)",
                color: C.stone,
              }}
            >
              estúdio criativo
            </span>
          </a>

          <nav className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-[15px]"
                style={{
                  color: C.cream,
                }}
              >
                {link.label}

                <span
                  className="absolute -bottom-1 left-0 h-[1.5px] w-0 transition-all duration-300 group-hover:w-full"
                  style={{
                    backgroundColor: C.burnt,
                  }}
                />
              </a>
            ))}
          </nav>

          <a
            href="#contato"
            className="hidden rounded-sm border px-5 py-2.5 text-[13px] font-medium tracking-wide transition-colors md:inline-block"
            style={{
              borderColor: C.burnt,
              color: C.cream,
              fontFamily:
                "var(--font-mono)",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor =
                C.burnt;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor =
                "transparent";
            }}
          >
            QUERO CRIAR
          </a>

          <button
            aria-label={
              menuAberto
                ? "Fechar menu"
                : "Abrir menu"
            }
            className="md:hidden"
            onClick={() =>
              setMenuAberto(
                (valor) => !valor
              )
            }
          >
            {menuAberto ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>
        </div>

        {menuAberto && (
          <div
            className="border-t px-6 py-6 md:hidden"
            style={{
              borderColor:
                "rgba(242,232,213,0.15)",
              backgroundColor:
                C.forestDeep,
            }}
          >
            <div
              className="flex flex-col gap-1 rounded-sm border border-dashed p-5"
              style={{
                borderColor:
                  "rgba(242,232,213,0.3)",
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() =>
                    setMenuAberto(false)
                  }
                  className="border-b py-3 text-lg"
                  style={{
                    borderColor:
                      "rgba(242,232,213,0.1)",
                    fontFamily:
                      "var(--font-display)",
                  }}
                >
                  {link.label}
                </a>
              ))}

              <a
                href="#contato"
                onClick={() =>
                  setMenuAberto(false)
                }
                className="mt-4 rounded-sm px-5 py-3 text-center text-sm font-medium tracking-wide"
                style={{
                  backgroundColor: C.burnt,
                  fontFamily:
                    "var(--font-mono)",
                }}
              >
                QUERO CRIAR
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================== */}
      {/* HERO                                                       */}
      {/* ========================================================== */}

      <section
        id="inicio"
        className="relative overflow-hidden px-6 pb-20 pt-14 md:px-10 md:pb-24 md:pt-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-40px] top-12 h-72 w-72 opacity-25 md:right-[-10px] md:h-96 md:w-96"
          style={{
            backgroundImage: `radial-gradient(${C.burnt} 1.3px, transparent 1.3px)`,
            backgroundSize: "13px 13px",
          }}
        />

        <MarcaRegistro className="absolute left-6 top-6 hidden md:block" />
        <MarcaRegistro className="absolute right-6 top-6 hidden md:block" />

        <div className="relative mx-auto max-w-[1400px]">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <Reveal>
                <div
                  className="mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[12px]"
                  style={{
                    borderColor:
                      "rgba(242,232,213,0.3)",
                    fontFamily:
                      "var(--font-mono)",
                    color: C.stone,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        C.burnt,
                    }}
                  />

                  estúdio de convites, sites &
                  experiências
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h1
                  className="max-w-5xl text-[11vw] font-black italic leading-[0.88] tracking-[-0.045em] md:text-[5.8rem] lg:text-[6.2rem]"
                  style={{
                    fontFamily:
                      "var(--font-display)",
                    color: C.cream,
                  }}
                >
                  IDEIAS QUE NÃO
                  <br />
                  CABEM NO{" "}
                  <span
                    style={{
                      color: C.burnt,
                    }}
                  >
                    PAPEL.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p
                  className="mt-7 max-w-lg text-[16px] leading-relaxed md:text-[17px]"
                  style={{
                    color:
                      "rgba(242,232,213,0.82)",
                  }}
                >
                  Convites, sites e experiências
                  digitais criadas para
                  transformar uma ideia em algo
                  que as pessoas realmente
                  querem abrir, explorar e
                  lembrar.
                </p>
              </Reveal>

              <Reveal delay={300}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a
                    href="#trabalhos"
                    className="rounded-sm px-7 py-3.5 text-[13px] font-medium tracking-wide transition-transform duration-200 hover:-translate-y-0.5"
                    style={{
                      backgroundColor:
                        C.burnt,
                      fontFamily:
                        "var(--font-mono)",
                      color: C.cream,
                    }}
                  >
                    VER TRABALHOS
                  </a>

                  <a
                    href="#contato"
                    className="rounded-sm border px-7 py-3.5 text-[13px] font-medium tracking-wide transition-colors duration-200"
                    style={{
                      borderColor:
                        "rgba(242,232,213,0.4)",
                      fontFamily:
                        "var(--font-mono)",
                      color: C.cream,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        C.burnt;
                      e.currentTarget.style.color =
                        C.burntSoft;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(242,232,213,0.4)";
                      e.currentTarget.style.color =
                        C.cream;
                    }}
                  >
                    CRIAR MEU PROJETO
                  </a>
                </div>
              </Reveal>
            </div>

            {/* CARTAZ */}

            <Reveal
              delay={180}
              className="hidden lg:flex lg:justify-center"
            >
              <div className="relative h-[430px] w-[320px] rotate-[2.5deg] transition-transform duration-500 hover:rotate-0">
                <div
                  className="absolute inset-0 translate-x-3 translate-y-3"
                  style={{
                    backgroundColor:
                      "rgba(0,0,0,0.16)",
                  }}
                />

                <div
                  className="relative h-full w-full border p-5"
                  style={{
                    backgroundColor: C.paper,
                    borderColor: C.ink,
                  }}
                >
                  <div
                    className="flex h-full flex-col justify-between border p-5"
                    style={{
                      borderColor:
                        "rgba(15,36,28,0.35)",
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className="text-[10px] tracking-[0.25em]"
                        style={{
                          fontFamily:
                            "var(--font-mono)",
                          color: C.ink,
                        }}
                      >
                        SARÇA
                      </span>

                      <span
                        className="text-[9px]"
                        style={{
                          fontFamily:
                            "var(--font-mono)",
                          color: C.burnt,
                        }}
                      >
                        Nº 001
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div
                        className="flex h-28 w-28 items-center justify-center rounded-full border-2"
                        style={{
                          borderColor:
                            C.burnt,
                          backgroundColor:
                            C.forestDeep,
                        }}
                      >
                        <svg
                          viewBox="0 0 100 100"
                          className="h-20 w-20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M50 76C35 70 31 58 37 47C40 41 47 36 49 24C60 34 68 43 65 53C63 61 56 65 50 76Z"
                            stroke={C.paper}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          <path
                            d="M30 76C42 72 54 76 69 68"
                            stroke={C.burnt}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />

                          <path
                            d="M39 73C34 66 29 65 25 67C28 73 33 75 39 73Z"
                            stroke={C.burnt}
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />

                          <path
                            d="M57 73C59 66 64 62 70 63C68 69 63 73 57 73Z"
                            stroke={C.burnt}
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />

                          <path
                            d="M48 70C44 63 45 57 49 53"
                            stroke={C.paper}
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <div className="mt-6 text-center">
                        <p
                          className="text-5xl font-black italic leading-none"
                          style={{
                            fontFamily:
                              "var(--font-display)",
                            color: C.ink,
                          }}
                        >
                          ideias
                        </p>

                        <p
                          className="mt-2 text-[10px] uppercase tracking-[0.32em]"
                          style={{
                            fontFamily:
                              "var(--font-mono)",
                            color: C.burnt,
                          }}
                        >
                          em combustão
                        </p>
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <span
                        className="text-[8px] uppercase tracking-[0.2em]"
                        style={{
                          fontFamily:
                            "var(--font-mono)",
                          color: C.ink,
                        }}
                      >
                        design · digital
                      </span>

                      <span
                        className="text-xl"
                        style={{
                          color: C.burnt,
                        }}
                      >
                        ✳
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={400}>
            <div
              className="mt-16 flex flex-wrap gap-x-12 gap-y-4 border-t pt-5 text-[11px]"
              style={{
                borderColor:
                  "rgba(242,232,213,0.15)",
                fontFamily:
                  "var(--font-mono)",
                color: C.stone,
              }}
            >
              <span>EST. SARÇA WORKS</span>
              <span>ESTÚDIO INDEPENDENTE</span>
              <span>FEITO À MÃO, COM CÓDIGO</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/* MANIFESTO                                                  */}
      {/* ========================================================== */}

      <section
        className="relative overflow-hidden border-y px-6 py-24 md:px-10 md:py-36"
        style={{
          borderColor:
            "rgba(242,232,213,0.15)",
          backgroundColor: C.forest,
        }}
      >
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p
              className="text-[11px] tracking-wide"
              style={{
                fontFamily:
                  "var(--font-mono)",
                color: C.burntSoft,
              }}
            >
              — manifesto —
            </p>
          </Reveal>

          <Reveal delay={100}>
            <p
              className="mt-6 max-w-4xl text-[9vw] italic leading-[1.02] md:ml-16 md:text-[5rem]"
              style={{
                fontFamily:
                  "var(--font-display)",
              }}
            >
              Não fazemos só artes.
              <br />

              <span
                style={{
                  color: C.burnt,
                }}
              >
                Criamos experiências.
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/* PORTFÓLIO                                                  */}
      {/* ========================================================== */}

      <section
        id="trabalhos"
        className="px-6 py-24 md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <div
              className="mb-14 flex flex-wrap items-end justify-between gap-6 border-b pb-6"
              style={{
                borderColor:
                  "rgba(242,232,213,0.15)",
              }}
            >
              <h2
                className="text-4xl font-semibold italic md:text-6xl"
                style={{
                  fontFamily:
                    "var(--font-display)",
                }}
              >
                Alguns trabalhos
              </h2>

              <span
                className="text-[12px]"
                style={{
                  fontFamily:
                    "var(--font-mono)",
                  color: C.stone,
                }}
              >
                catálogo 001 — em atualização
                constante
              </span>
            </div>
          </Reveal>

          {/* CARREGANDO */}

          {carregandoProjetos && (
            <div
              className="border border-dashed px-6 py-20 text-center"
              style={{
                borderColor:
                  "rgba(242,232,213,0.2)",
              }}
            >
              <p
                className="text-3xl italic"
                style={{
                  fontFamily:
                    "var(--font-display)",
                }}
              >
                Acendendo as ideias...
              </p>

              <p
                className="mt-3 text-[11px]"
                style={{
                  fontFamily:
                    "var(--font-mono)",
                  color: C.stone,
                }}
              >
                carregando portfólio
              </p>
            </div>
          )}

          {/* SEM PROJETOS */}

          {!carregandoProjetos &&
            projetos.length === 0 && (
              <div
                className="border border-dashed px-6 py-20 text-center"
                style={{
                  borderColor:
                    "rgba(242,232,213,0.2)",
                }}
              >
                <p
                  className="text-3xl italic"
                  style={{
                    fontFamily:
                      "var(--font-display)",
                  }}
                >
                  Em breve.
                </p>

                <p
                  className="mx-auto mt-3 max-w-md text-sm"
                  style={{
                    color: C.stone,
                  }}
                >
                  Os próximos projetos da
                  SARÇA WORKS vão aparecer aqui.
                </p>
              </div>
            )}

          {/* PROJETOS DO FIRESTORE */}

          {!carregandoProjetos &&
            projetos.length > 0 && (
              <div className="grid grid-cols-1 gap-5 md:grid-flow-dense md:grid-cols-12">
                {projetos.map(
                  (projeto, index) => {
                    const link =
                      `/projeto/${projeto.id}`;

                    return (
                      <Reveal
                        key={projeto.id}
                        delay={
                          (index % 4) * 80
                        }
                        className={
                          tamanhoClasses[
                            projeto.tamanho
                          ]
                        }
                      >
                        <a
                          href={link}
                          
                          className="group relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-sm border p-6"
                          style={{
                            borderColor:
                              "rgba(242,232,213,0.15)",
                            backgroundColor:
                              C.forest,
                          }}
                        >
                          {/* CAPA */}

                          {projeto.capa ? (
                            <img
                              src={projeto.capa}
                              alt={`Projeto ${projeto.nome}`}
                              className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
                            />
                          ) : (
                            <div
                              aria-hidden
                              className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                              style={{
                                backgroundImage:
                                  `linear-gradient(160deg, ${C.forestLight}, ${C.forestDeep})`,
                              }}
                            />
                          )}

                          {/* ESCURECIMENTO */}

                          <div
                            aria-hidden
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(to bottom, rgba(15,36,28,0.15), rgba(15,36,28,0.94))",
                            }}
                          />

                          {/* TOPO */}

                          <div className="relative z-10 flex items-start justify-between">
                            <span
                              className="text-[13px]"
                              style={{
                                fontFamily:
                                  "var(--font-mono)",
                                color:
                                  C.burntSoft,
                              }}
                            >
                              {String(
                                projeto.ordem
                              ).padStart(2, "0")}
                            </span>

                            <ArrowUpRight
                              size={20}
                              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                              style={{
                                color:
                                  C.cream,
                              }}
                            />
                          </div>

                          {/* CONTEÚDO */}

                          <div className="relative z-10">
                            <p
                              className="text-[11px] uppercase"
                              style={{
                                fontFamily:
                                  "var(--font-mono)",
                                color:
                                  C.burntSoft,
                                letterSpacing:
                                  "0.08em",
                              }}
                            >
                              {
                                projeto.categoria
                              }
                            </p>

                            <h3
                              className="mt-2 text-2xl leading-tight md:text-3xl"
                              style={{
                                fontFamily:
                                  "var(--font-display)",
                                fontStyle:
                                  "italic",
                                color:
                                  C.cream,
                              }}
                            >
                              {projeto.nome}
                            </h3>

                            <p
                              className="mt-3 max-w-md text-[14px] leading-relaxed"
                              style={{
                                color:
                                  "rgba(242,232,213,0.82)",
                              }}
                            >
                              {
                                projeto.descricao
                              }
                            </p>

                            <div
                              className="mt-5 inline-flex items-center gap-2 border px-4 py-2 text-[11px] uppercase transition-all duration-300 group-hover:bg-white group-hover:text-black"
                              style={{
                                borderColor:
                                  "rgba(242,232,213,0.45)",
                                fontFamily:
                                  "var(--font-mono)",
                                color:
                                  C.cream,
                              }}
                            >
                              VER PROJETO
                              <ArrowUpRight
                                size={14}
                              />
                            </div>
                          </div>
                        </a>
                      </Reveal>
                    );
                  }
                )}
              </div>
            )}
        </div>
      </section>

      {/* ========================================================== */}
      {/* SERVIÇOS                                                   */}
      {/* ========================================================== */}

      <section
        id="servicos"
        className="border-y px-6 py-24 md:px-10 md:py-32"
        style={{
          borderColor:
            "rgba(242,232,213,0.15)",
          backgroundColor: C.forest,
        }}
      >
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <h2
              className="mb-16 text-4xl font-semibold italic md:text-6xl"
              style={{
                fontFamily:
                  "var(--font-display)",
              }}
            >
              O que a gente faz
            </h2>
          </Reveal>

          <div>
            {servicos.map(
              (servico, index) => (
                <Reveal
                  key={servico.numero}
                  delay={index * 80}
                >
                  <div
                    className={`flex flex-col gap-4 border-t py-10 md:flex-row md:items-center md:gap-10 ${
                      index % 2 === 1
                        ? "md:flex-row-reverse md:text-right"
                        : ""
                    }`}
                    style={{
                      borderColor:
                        "rgba(242,232,213,0.15)",
                    }}
                  >
                    <span
                      className="text-6xl font-light md:w-40 md:shrink-0 md:text-7xl"
                      style={{
                        fontFamily:
                          "var(--font-mono)",
                        color:
                          "rgba(242,232,213,0.15)",
                      }}
                    >
                      {servico.numero}
                    </span>

                    <div className="flex-1">
                      <h3
                        className="text-2xl italic md:text-3xl"
                        style={{
                          fontFamily:
                            "var(--font-display)",
                        }}
                      >
                        {servico.titulo}
                      </h3>

                      <p
                        className="mt-3 max-w-xl text-[15px] leading-relaxed"
                        style={{
                          color:
                            "rgba(242,232,213,0.75)",
                        }}
                      >
                        {servico.texto}
                      </p>

                      <p
                        className="mt-3 text-[11px] uppercase"
                        style={{
                          fontFamily:
                            "var(--font-mono)",
                          color:
                            C.burntSoft,
                          letterSpacing:
                            "0.06em",
                        }}
                      >
                        {servico.nota}
                      </p>
                    </div>
                  </div>
                </Reveal>
              )
            )}

            <div
              className="border-t"
              style={{
                borderColor:
                  "rgba(242,232,213,0.15)",
              }}
            />
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* COMO FUNCIONA                                              */}
      {/* ========================================================== */}

      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <div
              className="mb-14 flex items-center gap-3 text-[12px]"
              style={{
                fontFamily:
                  "var(--font-mono)",
                color: C.stone,
              }}
            >
              <span
                className="rounded-sm border px-2 py-1"
                style={{
                  borderColor:
                    "rgba(242,232,213,0.3)",
                }}
              >
                FICHA TÉCNICA
              </span>

              como funciona
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {etapas.map(
              (etapa, index) => (
                <Reveal
                  key={etapa.numero}
                  delay={index * 100}
                >
                  <div
                    className="h-full rounded-sm border border-dashed p-6"
                    style={{
                      borderColor:
                        "rgba(242,232,213,0.25)",
                    }}
                  >
                    <span
                      className="text-[13px]"
                      style={{
                        fontFamily:
                          "var(--font-mono)",
                        color:
                          C.burnt,
                      }}
                    >
                      {etapa.numero}
                    </span>

                    <h3
                      className="mt-4 text-xl"
                      style={{
                        fontFamily:
                          "var(--font-display)",
                        fontWeight: 600,
                      }}
                    >
                      {etapa.titulo}
                    </h3>

                    <p
                      className="mt-3 text-[14px] leading-relaxed"
                      style={{
                        color:
                          "rgba(242,232,213,0.7)",
                      }}
                    >
                      {etapa.texto}
                    </p>
                  </div>
                </Reveal>
              )
            )}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* SOBRE                                                       */}
      {/* ========================================================== */}

      <section
        id="sobre"
        className="relative overflow-hidden border-y px-6 py-24 md:px-10 md:py-32"
        style={{
          borderColor:
            "rgba(242,232,213,0.15)",
          backgroundColor: C.forest,
        }}
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <p
              className="text-[12px] uppercase"
              style={{
                fontFamily:
                  "var(--font-mono)",
                color: C.stone,
                letterSpacing:
                  "0.06em",
              }}
            >
              quem somos
            </p>

            <h2
              className="mt-4 text-4xl italic leading-tight md:text-5xl"
              style={{
                fontFamily:
                  "var(--font-display)",
              }}
            >
              Somos uma
              <br />
              oficina digital.
            </h2>
          </Reveal>

          <Reveal
            delay={150}
            className="md:col-span-7 md:col-start-6"
          >
            <div
              className="space-y-5 border-l pl-8 text-lg leading-relaxed md:text-xl"
              style={{
                borderColor: C.burnt,
                color:
                  "rgba(242,232,213,0.88)",
              }}
            >
              <p>
                A Sarça Works nasceu da
                vontade de criar coisas que
                tenham personalidade.
              </p>

              <p>
                Aqui, tecnologia e design
                trabalham juntos para
                transformar ideias em
                experiências digitais que as
                pessoas guardam, não só
                visitam.
              </p>

              <p
                style={{
                  color: C.burntSoft,
                  fontStyle: "italic",
                }}
              >
                Não existe fórmula pronta.
                Cada projeto começa do zero.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/* CTA FINAL                                                  */}
      {/* ========================================================== */}

      <section
        id="contato"
        className="relative overflow-hidden px-6 py-28 text-center md:px-10 md:py-40"
      >
        <MarcaRegistro className="absolute left-6 top-6 hidden md:block" />

        <MarcaRegistro className="absolute bottom-6 right-6 hidden md:block" />

        <Reveal>
          <h2
            className="mx-auto max-w-3xl text-5xl italic leading-[1.05] md:text-7xl"
            style={{
              fontFamily:
                "var(--font-display)",
            }}
          >
            Tem uma ideia?
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <p
            className="mx-auto mt-4 max-w-2xl text-2xl md:text-3xl"
            style={{
              fontFamily:
                "var(--font-display)",
              fontStyle: "italic",
              color: C.burnt,
            }}
          >
            Então vamos tirar ela do papel.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <a
            href="https://wa.me/5511947610231?text=Oi!%20Conheci%20a%20SAR%C3%87A%20WORKS%20e%20quero%20conversar%20sobre%20um%20projeto.%20%F0%9F%94%A5"
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-block rounded-sm px-9 py-4 text-[14px] font-medium tracking-wide"
            style={{
              backgroundColor: C.burnt,
              fontFamily:
                "var(--font-mono)",
              color: C.cream,
            }}
          >
            COMEÇAR UM PROJETO
          </a>
        </Reveal>

        <Reveal delay={280}>
          <p
            className="mx-auto mt-6 max-w-sm text-[14px]"
            style={{
              color:
                "rgba(242,232,213,0.6)",
            }}
          >
            Convite, site, identidade ou
            alguma ideia que ainda nem tem
            nome.
          </p>
        </Reveal>
      </section>

      {/* ========================================================== */}
      {/* FOOTER                                                     */}
      {/* ========================================================== */}

      <footer
        className="border-t px-6 py-12 md:px-10"
        style={{
          borderColor:
            "rgba(242,232,213,0.15)",
          backgroundColor:
            C.forestDeep,
        }}
      >
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/sarça%20logo.png"
                alt="Sarça Works"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />

              <span
                className="text-lg"
                style={{
                  fontFamily:
                    "var(--font-display)",
                  fontStyle: "italic",
                }}
              >
                Sarça Works
              </span>
            </div>

            <p
              className="mt-3 max-w-xs text-[14px]"
              style={{
                color:
                  "rgba(242,232,213,0.6)",
              }}
            >
              Design, código e ideias fora
              do lugar comum.
            </p>
          </div>

          <div className="flex gap-6">
            <a
              href="https://instagram.com/sarcaworks"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              style={{
                color: C.stone,
              }}
            >
              <span className="text-sm">
                IG
              </span>
            </a>

            <a
              href="https://wa.me/5511947610231"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              style={{
                color: C.stone,
              }}
            >
              <MessageCircle size={20} />
            </a>

            <a
              href="mailto:ola@sarcaworks.com"
              aria-label="E-mail"
              style={{
                color: C.stone,
              }}
            >
              <Mail size={20} />
            </a>
          </div>

          <p
            className="text-[12px]"
            style={{
              fontFamily:
                "var(--font-mono)",
              color: C.stone,
            }}
          >
            © 2026 SARÇA WORKS
          </p>
        </div>
      </footer>
    </div>
  );
}