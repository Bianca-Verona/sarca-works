import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  Fraunces,
  JetBrains_Mono,
  Work_Sans,
} from "next/font/google";

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

const whatsapp =
  "https://wa.me/5511947610231?text=Oi!%20Conheci%20a%20SAR%C3%87A%20WORKS%20e%20quero%20conversar%20sobre%20um%20projeto.%20%F0%9F%94%A5";

export default function GirlsOfCarsCase() {
  return (
    <main
      className={`${display.variable} ${mono.variable} ${sans.variable} min-h-screen font-sans`}
      style={{
        backgroundColor: C.forestDeep,
        color: C.cream,
      }}
    >
      {/* HEADER */}

      <header
        className="border-b"
        style={{
          borderColor: "rgba(242,232,213,0.15)",
        }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
          <Link
            href="/#trabalhos"
            className="inline-flex items-center gap-2 text-[12px]"
            style={{
              fontFamily: "var(--font-mono)",
              color: C.stone,
            }}
          >
            <ArrowLeft size={16} />
            VOLTAR AOS TRABALHOS
          </Link>

          <span
            className="text-[11px] uppercase tracking-[0.16em]"
            style={{
              fontFamily: "var(--font-mono)",
              color: C.burntSoft,
            }}
          >
            case study · 001
          </span>
        </div>
      </header>

      {/* HERO */}

      <section className="px-6 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-5xl">
            <p
              className="text-[11px] uppercase tracking-[0.12em]"
              style={{
                fontFamily: "var(--font-mono)",
                color: C.burntSoft,
              }}
            >
              Experiência digital · Evento automotivo
            </p>

            <h1
              className="mt-5 text-[13vw] font-black italic leading-[0.86] tracking-[-0.05em] md:text-[8rem]"
              style={{
                fontFamily: "var(--font-display)",
              }}
            >
              GIRLS
              <br />
              <span style={{ color: C.burnt }}>
                OF CARS.
              </span>
            </h1>

            <p
              className="mt-8 max-w-2xl text-lg leading-relaxed md:text-xl"
              style={{
                color: "rgba(242,232,213,0.78)",
              }}
            >
              Uma experiência digital criada para transformar a
              divulgação de um evento automotivo em participação.
              Em vez de apenas informar, o projeto convida as
              participantes a entrar, explorar, cumprir missões e
              acompanhar sua evolução.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Web",
                "Gamificação",
                "Ranking",
                "Firebase",
                "Evento",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-4 py-2 text-[11px]"
                  style={{
                    borderColor:
                      "rgba(242,232,213,0.25)",
                    fontFamily: "var(--font-mono)",
                    color: C.cream,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMAGEM PRINCIPAL */}

      <section className="px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-[1100px]">
          <div
            className="relative overflow-hidden rounded-sm border"
            style={{
              borderColor:
                "rgba(242,232,213,0.18)",
              backgroundColor: C.forest,
            }}
          >
            <Image
              src="/girls-of-cars/girls-home.png"
              alt="Tela inicial do projeto Girls of Cars"
              width={1600}
              height={1000}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p
              className="max-w-xl text-sm leading-relaxed"
              style={{
                color:
                  "rgba(242,232,213,0.58)",
              }}
            >
              A experiência foi pensada para funcionar como uma
              extensão digital do evento, conectando divulgação,
              interação e ações das participantes em um único lugar.
            </p>

            <a
              href="https://girls-of-cars.web.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border px-5 py-3 text-[11px]"
              style={{
                borderColor: C.burnt,
                color: C.cream,
                fontFamily: "var(--font-mono)",
              }}
            >
              ABRIR PROJETO
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* INTENÇÃO */}

      <section
        className="border-y px-6 py-24 md:px-10 md:py-32"
        style={{
          borderColor:
            "rgba(242,232,213,0.15)",
          backgroundColor: C.forest,
        }}
      >
        <div className="mx-auto grid max-w-[1400px] gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p
              className="text-[11px] uppercase tracking-[0.12em]"
              style={{
                fontFamily: "var(--font-mono)",
                color: C.burntSoft,
              }}
            >
              01 · intenção
            </p>

            <h2
              className="mt-4 text-4xl italic leading-tight md:text-6xl"
              style={{
                fontFamily: "var(--font-display)",
              }}
            >
              Fazer o público participar.
            </h2>
          </div>

          <div
            className="space-y-6 text-lg leading-relaxed md:col-span-7 md:col-start-6 md:text-xl"
            style={{
              color:
                "rgba(242,232,213,0.82)",
            }}
          >
            <p>
              O desafio era levar a energia do Girls of Cars para
              o ambiente digital e criar algo que tivesse utilidade
              antes e durante o evento.
            </p>

            <p>
              A solução foi transformar a página em uma experiência
              gamificada: cada participante poderia acompanhar seu
              progresso, realizar missões, acumular pontos e visualizar
              sua posição no ranking.
            </p>

            <p
              style={{
                color: C.burntSoft,
              }}
            >
              A ideia central: divulgação deixa de ser apenas
              conteúdo e vira ação.
            </p>
          </div>
        </div>
      </section>

      {/* O QUE FOI CRIADO */}

      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 max-w-3xl">
            <p
              className="text-[11px] uppercase tracking-[0.12em]"
              style={{
                fontFamily: "var(--font-mono)",
                color: C.burntSoft,
              }}
            >
              02 · o que foi criado
            </p>

            <h2
              className="mt-4 text-4xl italic md:text-6xl"
              style={{
                fontFamily: "var(--font-display)",
              }}
            >
              Uma experiência, não só uma página.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              [
                "MISSÕES",
                "Ações para gerar participação e distribuir pontos.",
              ],
              [
                "PROGRESSO",
                "Área individual para acompanhar pontos e atividades concluídas.",
              ],
              [
                "RANKING",
                "Classificação das participantes baseada na pontuação.",
              ],
              [
                "EVENTO",
                "Informações, ingresso, localização e convite reunidos na experiência.",
              ],
            ].map(([title, text]) => (
              <div
                key={title}
                className="border p-7 md:p-9"
                style={{
                  borderColor:
                    "rgba(242,232,213,0.18)",
                  backgroundColor:
                    "rgba(22,52,42,0.45)",
                }}
              >
                <p
                  className="text-[12px]"
                  style={{
                    fontFamily:
                      "var(--font-mono)",
                    color: C.burnt,
                  }}
                >
                  {title}
                </p>

                <p className="mt-4 max-w-md text-lg leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTE */}

      <section
        className="border-y px-6 py-24 md:px-10 md:py-32"
        style={{
          borderColor:
            "rgba(242,232,213,0.15)",
          backgroundColor: C.paper,
          color: C.ink,
        }}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-3xl">
            <p
              className="text-[11px] uppercase tracking-[0.12em]"
              style={{
                fontFamily: "var(--font-mono)",
                color: C.burnt,
              }}
            >
              03 · quer testar?
            </p>

            <h2
              className="mt-4 text-4xl italic md:text-6xl"
              style={{
                fontFamily: "var(--font-display)",
              }}
            >
              Entre na experiência.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl">
              Você pode acessar o projeto e fazer um cadastro usando{" "}
              <strong>dados fictícios</strong> para explorar a
              experiência. Não use informações pessoais ou dados reais
              durante o teste.
            </p>

            <div
              className="mt-8 border-l-2 pl-5 text-sm leading-relaxed"
              style={{
                borderColor: C.burnt,
              }}
            >
              <strong>Para testar:</strong> abra o projeto, faça seu
              cadastro com informações fictícias e explore as missões,
              o progresso e o ranking.
            </div>

            <a
              href="https://girls-of-cars.web.app/"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 text-[12px]"
              style={{
                backgroundColor: C.burnt,
                color: C.cream,
                fontFamily: "var(--font-mono)",
              }}
            >
              TESTAR O GIRLS OF CARS
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="px-6 py-24 text-center md:px-10 md:py-32">
        <p
          className="text-[11px] uppercase tracking-[0.12em]"
          style={{
            fontFamily: "var(--font-mono)",
            color: C.stone,
          }}
        >
          feito pela SARÇA WORKS
        </p>

        <h2
          className="mx-auto mt-5 max-w-3xl text-4xl italic md:text-6xl"
          style={{
            fontFamily: "var(--font-display)",
          }}
        >
          Tem uma ideia que também pode virar experiência?
        </h2>

        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="mt-9 inline-flex items-center gap-2 px-7 py-3.5 text-[12px]"
          style={{
            backgroundColor: C.burnt,
            color: C.cream,
            fontFamily: "var(--font-mono)",
          }}
        >
          VAMOS CRIAR
          <ArrowUpRight size={16} />
        </a>
      </section>
    </main>
  );
}