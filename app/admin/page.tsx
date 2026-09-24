"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";

import { auth, db } from "@/app/lib/firebase";

type TamanhoProjeto = "grande" | "media" | "pequena";

type Projeto = {
  id: string;
  ordem: number;
  nome: string;
  categoria: string;
  descricao: string;
  status: "Publicado" | "Rascunho";
  url: string;
  capa: string;
  tamanho: TamanhoProjeto;
};

const projetosIniciais: Omit<Projeto, "id">[] = [
  {
    ordem: 1,
    nome: "GIRLS OF CARS",
    categoria: "Experiência digital",
    descricao:
      "Experiência digital para evento automotivo, com cadastro, missões, pontos, ranking e painel administrativo.",
    status: "Publicado",
    url: "/girls-of-cars",
    capa: "/girls-of-cars/girls-home.png",
    tamanho: "grande",
  },
  {
    ordem: 2,
    nome: "CONVITE .001",
    categoria: "Convite interativo",
    descricao:
      "Projeto de convite digital interativo.",
    status: "Rascunho",
    url: "",
    capa: "",
    tamanho: "pequena",
  },
];

export default function AdminPage() {
  const [usuario, setUsuario] =
    useState<User | null>(null);

  const [carregandoAuth, setCarregandoAuth] =
    useState(true);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erroLogin, setErroLogin] =
    useState("");

  const [projetos, setProjetos] =
    useState<Projeto[]>([]);

  const [carregandoProjetos, setCarregandoProjetos] =
    useState(false);

  const [modalAberto, setModalAberto] =
    useState(false);

  const [editandoId, setEditandoId] =
    useState<string | null>(null);

  const [nomeProjeto, setNomeProjeto] =
    useState("");

  const [categoriaProjeto, setCategoriaProjeto] =
    useState("");

  const [descricaoProjeto, setDescricaoProjeto] =
    useState("");

  const [urlProjeto, setUrlProjeto] =
    useState("");

  const [capaProjeto, setCapaProjeto] =
    useState("");

  const [tamanhoProjeto, setTamanhoProjeto] =
    useState<TamanhoProjeto>("media");

  const [salvando, setSalvando] =
    useState(false);

  const [mensagem, setMensagem] =
    useState("");

  /* ============================================================ */
  /* AUTENTICAÇÃO                                                 */
  /* ============================================================ */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {
          setUsuario(user);
          setCarregandoAuth(false);
        }
      );

    return () => unsubscribe();
  }, []);

  /* ============================================================ */
  /* CARREGAR PROJETOS                                             */
  /* ============================================================ */

  useEffect(() => {
    if (!usuario) return;

    carregarProjetos();
  }, [usuario]);

  async function carregarProjetos() {
    try {
      setCarregandoProjetos(true);

      const snapshot = await getDocs(
        collection(db, "projects")
      );

      if (snapshot.empty) {
        const criados: Projeto[] = [];

        for (const projeto of projetosIniciais) {
          const ref = await addDoc(
            collection(db, "projects"),
            projeto
          );

          criados.push({
            id: ref.id,
            ...projeto,
          });
        }

        criados.sort(
          (a, b) => a.ordem - b.ordem
        );

        setProjetos(criados);
        return;
      }

      const lista: Projeto[] =
        snapshot.docs.map((documento) => {
          const dados = documento.data();

          const tamanhoValido =
            dados.tamanho === "grande" ||
            dados.tamanho === "media" ||
            dados.tamanho === "pequena";

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
                : "",

            descricao:
              typeof dados.descricao === "string"
                ? dados.descricao
                : "",

            status:
              dados.status === "Publicado"
                ? "Publicado"
                : "Rascunho",

            url:
              typeof dados.url === "string"
                ? dados.url
                : "",

            capa:
              typeof dados.capa === "string"
                ? dados.capa
                : "",

            tamanho: tamanhoValido
              ? dados.tamanho
              : "media",
          };
        });

      lista.sort(
        (a, b) => a.ordem - b.ordem
      );

      setProjetos(lista);
    } catch (error) {
      console.error(
        "Erro ao carregar projetos:",
        error
      );

      setMensagem(
        "Não foi possível carregar os projetos."
      );
    } finally {
      setCarregandoProjetos(false);
    }
  }

  /* ============================================================ */
  /* LOGIN                                                         */
  /* ============================================================ */

  async function fazerLogin(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setErroLogin("");

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

      setEmail("");
      setSenha("");
    } catch (error: unknown) {
      console.error(error);

      setErroLogin(
        "E-mail ou senha inválidos."
      );
    }
  }

  /* ============================================================ */
  /* LOGOUT                                                        */
  /* ============================================================ */

  async function fazerLogout() {
    await signOut(auth);
  }

  /* ============================================================ */
  /* NOVO PROJETO                                                  */
  /* ============================================================ */

  function abrirNovoProjeto() {
    setEditandoId(null);

    setNomeProjeto("");
    setCategoriaProjeto("");
    setDescricaoProjeto("");
    setUrlProjeto("");
    setCapaProjeto("");
    setTamanhoProjeto("media");

    setMensagem("");

    setModalAberto(true);
  }

  /* ============================================================ */
  /* EDITAR PROJETO                                                */
  /* ============================================================ */

  function abrirEdicao(
    projeto: Projeto
  ) {
    setEditandoId(projeto.id);

    setNomeProjeto(projeto.nome);
    setCategoriaProjeto(
      projeto.categoria
    );
    setDescricaoProjeto(
      projeto.descricao
    );
    setUrlProjeto(projeto.url);
    setCapaProjeto(projeto.capa);
    setTamanhoProjeto(
      projeto.tamanho || "media"
    );

    setMensagem("");

    setModalAberto(true);
  }

  /* ============================================================ */
  /* SALVAR                                                        */
  /* ============================================================ */

  async function salvarProjeto(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!nomeProjeto.trim()) {
      setMensagem(
        "Digite o nome do projeto."
      );
      return;
    }

    try {
      setSalvando(true);
      setMensagem("");

      if (editandoId) {
        const projetoRef = doc(
          db,
          "projects",
          editandoId
        );

        await updateDoc(projetoRef, {
          nome: nomeProjeto.trim(),
          categoria:
            categoriaProjeto.trim(),
          descricao:
            descricaoProjeto.trim(),
          url: urlProjeto.trim(),
          capa: capaProjeto.trim(),
          tamanho: tamanhoProjeto,
        });
      } else {
        const maiorOrdem =
          projetos.length > 0
            ? Math.max(
                ...projetos.map(
                  (projeto) =>
                    projeto.ordem
                )
              )
            : 0;

        await addDoc(
          collection(db, "projects"),
          {
            ordem: maiorOrdem + 1,
            nome: nomeProjeto.trim(),
            categoria:
              categoriaProjeto.trim(),
            descricao:
              descricaoProjeto.trim(),
            status: "Rascunho",
            url: urlProjeto.trim(),
            capa: capaProjeto.trim(),
            tamanho: tamanhoProjeto,
          }
        );
      }

      await carregarProjetos();

      setModalAberto(false);

      setMensagem(
        editandoId
          ? "Projeto atualizado!"
          : "Projeto criado como rascunho!"
      );
    } catch (error) {
      console.error(
        "Erro ao salvar projeto:",
        error
      );

      setMensagem(
        "Não foi possível salvar o projeto."
      );
    } finally {
      setSalvando(false);
    }
  }

  /* ============================================================ */
  /* ALTERAR STATUS                                                */
  /* ============================================================ */

  async function alternarStatus(
    projeto: Projeto
  ) {
    try {
      const novoStatus =
        projeto.status === "Publicado"
          ? "Rascunho"
          : "Publicado";

      await updateDoc(
        doc(db, "projects", projeto.id),
        {
          status: novoStatus,
        }
      );

      setProjetos((lista) =>
        lista.map((item) =>
          item.id === projeto.id
            ? {
                ...item,
                status: novoStatus,
              }
            : item
        )
      );
    } catch (error) {
      console.error(error);

      setMensagem(
        "Erro ao alterar o status."
      );
    }
  }

  /* ============================================================ */
  /* EXCLUIR                                                       */
  /* ============================================================ */

  async function excluirProjeto(
    projeto: Projeto
  ) {
    const confirmar = window.confirm(
      `Excluir o projeto "${projeto.nome}"?`
    );

    if (!confirmar) return;

    try {
      await deleteDoc(
        doc(
          db,
          "projects",
          projeto.id
        )
      );

      setProjetos((lista) =>
        lista.filter(
          (item) =>
            item.id !== projeto.id
        )
      );

      setMensagem("Projeto excluído.");
    } catch (error) {
      console.error(error);

      setMensagem(
        "Erro ao excluir o projeto."
      );
    }
  }

  /* ============================================================ */
  /* LOGIN                                                        */
  /* ============================================================ */

  if (carregandoAuth) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor:
            "#0F241C",
          color: "#F2E8D5",
        }}
      >
        <p
          style={{
            fontFamily:
              "monospace",
          }}
        >
          carregando...
        </p>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-6"
        style={{
          backgroundColor:
            "#0F241C",
          color: "#F2E8D5",
        }}
      >
        <div
          className="w-full max-w-md border p-8"
          style={{
            borderColor:
              "rgba(242,232,213,0.2)",
          }}
        >
          <div className="mb-10">
            <p
              className="text-xs uppercase tracking-[0.2em]"
              style={{
                color: "#C1571F",
                fontFamily:
                  "monospace",
              }}
            >
              SARÇA WORKS
            </p>

            <h1
              className="mt-3 text-4xl italic"
              style={{
                fontFamily:
                  "Georgia, serif",
              }}
            >
              Painel administrativo
            </h1>

            <p
              className="mt-3 text-sm"
              style={{
                color:
                  "rgba(242,232,213,0.6)",
              }}
            >
              Entre para gerenciar seus
              projetos.
            </p>
          </div>

          <form
            onSubmit={fazerLogin}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider">
                E-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
                className="w-full border bg-transparent px-4 py-3 outline-none"
                style={{
                  borderColor:
                    "rgba(242,232,213,0.25)",
                }}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider">
                Senha
              </label>

              <input
                type="password"
                value={senha}
                onChange={(e) =>
                  setSenha(
                    e.target.value
                  )
                }
                required
                className="w-full border bg-transparent px-4 py-3 outline-none"
                style={{
                  borderColor:
                    "rgba(242,232,213,0.25)",
                }}
              />
            </div>

            {erroLogin && (
              <p
                className="text-sm"
                style={{
                  color: "#D97A45",
                }}
              >
                {erroLogin}
              </p>
            )}

            <button
              type="submit"
              className="w-full px-5 py-3 text-sm font-medium"
              style={{
                backgroundColor:
                  "#C1571F",
              }}
            >
              ENTRAR
            </button>
          </form>
        </div>
      </main>
    );
  }

  /* ============================================================ */
  /* ADMIN                                                        */
  /* ============================================================ */

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor:
          "#0F241C",
        color: "#F2E8D5",
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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p
              className="text-xs uppercase tracking-[0.2em]"
              style={{
                color: "#C1571F",
                fontFamily:
                  "monospace",
              }}
            >
              SARÇA WORKS
            </p>

            <p
              className="mt-1 text-sm"
              style={{
                color:
                  "rgba(242,232,213,0.55)",
              }}
            >
              painel administrativo
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="border px-4 py-2 text-xs"
              style={{
                borderColor:
                  "rgba(242,232,213,0.25)",
              }}
            >
              VER SITE
            </a>

            <button
              onClick={fazerLogout}
              className="border px-4 py-2 text-xs"
              style={{
                borderColor:
                  "rgba(242,232,213,0.25)",
              }}
            >
              SAIR
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {/* TÍTULO */}

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="text-xs uppercase tracking-[0.2em]"
              style={{
                color: "#C1571F",
                fontFamily:
                  "monospace",
              }}
            >
              portfólio
            </p>

            <h1
              className="mt-2 text-5xl italic"
              style={{
                fontFamily:
                  "Georgia, serif",
              }}
            >
              Projetos.
            </h1>

            <p
              className="mt-3 text-sm"
              style={{
                color:
                  "rgba(242,232,213,0.55)",
              }}
            >
              Gerencie o que aparece no
              seu site.
            </p>
          </div>

          <button
            onClick={abrirNovoProjeto}
            className="px-5 py-3 text-sm font-medium"
            style={{
              backgroundColor:
                "#C1571F",
            }}
          >
            + NOVO PROJETO
          </button>
        </div>

        {/* MENSAGEM */}

        {mensagem && (
          <div
            className="mb-6 border px-4 py-3 text-sm"
            style={{
              borderColor:
                "rgba(242,232,213,0.2)",
              color: "#D97A45",
            }}
          >
            {mensagem}
          </div>
        )}

        {/* LISTA */}

        {carregandoProjetos ? (
          <div
            className="border border-dashed p-10 text-center"
            style={{
              borderColor:
                "rgba(242,232,213,0.2)",
            }}
          >
            carregando projetos...
          </div>
        ) : projetos.length === 0 ? (
          <div
            className="border border-dashed p-10 text-center"
            style={{
              borderColor:
                "rgba(242,232,213,0.2)",
            }}
          >
            Nenhum projeto cadastrado.
          </div>
        ) : (
          <div className="space-y-3">
            {projetos.map(
              (projeto) => (
                <article
                  key={projeto.id}
                  className="border p-5"
                  style={{
                    borderColor:
                      "rgba(242,232,213,0.15)",
                    backgroundColor:
                      "rgba(242,232,213,0.025)",
                  }}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      {/* MINI CAPA */}

                      <div
                        className="relative h-20 w-20 shrink-0 overflow-hidden border"
                        style={{
                          borderColor:
                            "rgba(242,232,213,0.15)",
                          backgroundColor:
                            "#16342A",
                        }}
                      >
                        {projeto.capa ? (
                          <img
                            src={
                              projeto.capa
                            }
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs opacity-40">
                            sem capa
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className="text-xs"
                            style={{
                              color:
                                "#C1571F",
                              fontFamily:
                                "monospace",
                            }}
                          >
                            {String(
                              projeto.ordem
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <h2 className="text-xl">
                            {projeto.nome}
                          </h2>

                          <span
                            className="rounded-full border px-2 py-1 text-[10px] uppercase"
                            style={{
                              borderColor:
                                projeto.status ===
                                "Publicado"
                                  ? "#C1571F"
                                  : "rgba(242,232,213,0.2)",
                              color:
                                projeto.status ===
                                "Publicado"
                                  ? "#D97A45"
                                  : "#8B8477",
                            }}
                          >
                            {projeto.status}
                          </span>
                        </div>

                        <p
                          className="mt-2 text-sm"
                          style={{
                            color:
                              "rgba(242,232,213,0.55)",
                          }}
                        >
                          {
                            projeto.categoria
                          }
                        </p>

                        <p
                          className="mt-1 max-w-2xl text-sm"
                          style={{
                            color:
                              "rgba(242,232,213,0.4)",
                          }}
                        >
                          {
                            projeto.descricao
                          }
                        </p>

                        <div
                          className="mt-3 flex flex-wrap gap-3 text-[10px] uppercase"
                          style={{
                            fontFamily:
                              "monospace",
                            color:
                              "#8B8477",
                          }}
                        >
                          <span>
                            Card:{" "}
                            {projeto.tamanho}
                          </span>

                          {projeto.capa && (
                            <span>
                              Capa definida
                            </span>
                          )}

                          {projeto.url && (
                            <span>
                              Link definido
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* AÇÕES */}

                    <div className="flex flex-wrap gap-2 lg:shrink-0">
                      <button
                        onClick={() =>
                          alternarStatus(
                            projeto
                          )
                        }
                        className="border px-4 py-2 text-xs"
                        style={{
                          borderColor:
                            "rgba(242,232,213,0.2)",
                        }}
                      >
                        {projeto.status ===
                        "Publicado"
                          ? "DESPUBLICAR"
                          : "PUBLICAR"}
                      </button>

                      <button
                        onClick={() =>
                          abrirEdicao(
                            projeto
                          )
                        }
                        className="border px-4 py-2 text-xs"
                        style={{
                          borderColor:
                            "rgba(242,232,213,0.2)",
                        }}
                      >
                        EDITAR
                      </button>

                      <button
                        onClick={() =>
                          excluirProjeto(
                            projeto
                          )
                        }
                        className="border px-4 py-2 text-xs"
                        style={{
                          borderColor:
                            "rgba(193,87,31,0.45)",
                          color:
                            "#D97A45",
                        }}
                      >
                        EXCLUIR
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* MODAL                                                    */}
      {/* ======================================================== */}

      {modalAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setModalAberto(false);
            }
          }}
        >
          <div
            className="w-full max-w-2xl border p-6 md:p-8"
            style={{
              backgroundColor:
                "#16342A",
              borderColor:
                "rgba(242,232,213,0.2)",
            }}
          >
            <div className="mb-7 flex items-start justify-between gap-5">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.2em]"
                  style={{
                    color: "#C1571F",
                    fontFamily:
                      "monospace",
                  }}
                >
                  {editandoId
                    ? "editar projeto"
                    : "novo projeto"}
                </p>

                <h2
                  className="mt-2 text-3xl italic"
                  style={{
                    fontFamily:
                      "Georgia, serif",
                  }}
                >
                  {editandoId
                    ? "Editar."
                    : "Adicionar."}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setModalAberto(false)
                }
                className="text-xl opacity-60 hover:opacity-100"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={salvarProjeto}
              className="space-y-5"
            >
              {/* NOME */}

              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider">
                  Nome do projeto
                </label>

                <input
                  value={nomeProjeto}
                  onChange={(e) =>
                    setNomeProjeto(
                      e.target.value
                    )
                  }
                  placeholder="Ex.: GIRLS OF CARS"
                  required
                  className="w-full border bg-transparent px-4 py-3 outline-none"
                  style={{
                    borderColor:
                      "rgba(242,232,213,0.2)",
                  }}
                />
              </div>

              {/* CATEGORIA */}

              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider">
                  Categoria
                </label>

                <input
                  value={categoriaProjeto}
                  onChange={(e) =>
                    setCategoriaProjeto(
                      e.target.value
                    )
                  }
                  placeholder="Ex.: Experiência digital"
                  className="w-full border bg-transparent px-4 py-3 outline-none"
                  style={{
                    borderColor:
                      "rgba(242,232,213,0.2)",
                  }}
                />
              </div>

              {/* DESCRIÇÃO */}

              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider">
                  Descrição
                </label>

                <textarea
                  value={descricaoProjeto}
                  onChange={(e) =>
                    setDescricaoProjeto(
                      e.target.value
                    )
                  }
                  placeholder="Explique rapidamente o projeto..."
                  rows={4}
                  className="w-full resize-none border bg-transparent px-4 py-3 outline-none"
                  style={{
                    borderColor:
                      "rgba(242,232,213,0.2)",
                  }}
                />
              </div>

              {/* CAPA */}

              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider">
                  Capa do projeto
                </label>

                <input
                  value={capaProjeto}
                  onChange={(e) =>
                    setCapaProjeto(
                      e.target.value
                    )
                  }
                  placeholder="/projetos/meu-projeto.jpg"
                  className="w-full border bg-transparent px-4 py-3 outline-none"
                  style={{
                    borderColor:
                      "rgba(242,232,213,0.2)",
                  }}
                />

                <p
                  className="mt-2 text-[11px]"
                  style={{
                    color:
                      "rgba(242,232,213,0.45)",
                  }}
                >
                  Coloque a imagem dentro de
                  <strong>
                    {" "}
                    public/projetos/
                  </strong>{" "}
                  e informe o caminho aqui.
                </p>

                {capaProjeto && (
                  <div className="mt-4">
                    <p className="mb-2 text-[10px] uppercase tracking-wider opacity-50">
                      prévia
                    </p>

                    <div
                      className="relative h-40 w-full overflow-hidden border"
                      style={{
                        borderColor:
                          "rgba(242,232,213,0.15)",
                      }}
                    >
                      <img
                        src={capaProjeto}
                        alt="Prévia da capa"
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* TAMANHO */}

              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider">
                  Tamanho no portfólio
                </label>

                <select
                  value={tamanhoProjeto}
                  onChange={(e) =>
                    setTamanhoProjeto(
                      e.target
                        .value as TamanhoProjeto
                    )
                  }
                  className="w-full border bg-transparent px-4 py-3 outline-none"
                  style={{
                    borderColor:
                      "rgba(242,232,213,0.2)",
                    color: "#F2E8D5",
                    backgroundColor:
                      "#16342A",
                  }}
                >
                  <option
                    value="grande"
                    style={{
                      backgroundColor:
                        "#16342A",
                    }}
                  >
                    Grande
                  </option>

                  <option
                    value="media"
                    style={{
                      backgroundColor:
                        "#16342A",
                    }}
                  >
                    Média
                  </option>

                  <option
                    value="pequena"
                    style={{
                      backgroundColor:
                        "#16342A",
                    }}
                  >
                    Pequena
                  </option>
                </select>

                <p
                  className="mt-2 text-[11px]"
                  style={{
                    color:
                      "rgba(242,232,213,0.45)",
                  }}
                >
                  Grande ocupa mais espaço no
                  grid. Pequena ocupa menos.
                </p>
              </div>

              {/* LINK */}

              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider">
                  Link do projeto
                </label>

                <input
                  value={urlProjeto}
                  onChange={(e) =>
                    setUrlProjeto(
                      e.target.value
                    )
                  }
                  placeholder="/girls-of-cars ou https://..."
                  className="w-full border bg-transparent px-4 py-3 outline-none"
                  style={{
                    borderColor:
                      "rgba(242,232,213,0.2)",
                  }}
                />

                <p
                  className="mt-2 text-[11px]"
                  style={{
                    color:
                      "rgba(242,232,213,0.45)",
                  }}
                >
                  Para páginas dentro do site,
                  use /pagina. Para outro site,
                  use https://...
                </p>
              </div>

              {/* ERRO/MENSAGEM */}

              {mensagem && (
                <p
                  className="text-sm"
                  style={{
                    color:
                      "#D97A45",
                  }}
                >
                  {mensagem}
                </p>
              )}

              {/* BOTÕES */}

              <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 px-5 py-3 text-sm font-medium disabled:opacity-50"
                  style={{
                    backgroundColor:
                      "#C1571F",
                  }}
                >
                  {salvando
                    ? "SALVANDO..."
                    : editandoId
                    ? "SALVAR ALTERAÇÕES"
                    : "CRIAR PROJETO"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setModalAberto(false)
                  }
                  className="border px-5 py-3 text-sm"
                  style={{
                    borderColor:
                      "rgba(242,232,213,0.2)",
                  }}
                >
                  CANCELAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}