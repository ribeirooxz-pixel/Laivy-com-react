import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CartaoResumo from '../componentes/CartaoResumo'
import { usePerfilAtleta } from '../hooks/usePerfilAtleta'
import '../styles/PerfilAtleta.css'

const dataBR = (data) => {
    if (!data) return '—'

    return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR')
}

const idade = (data) => {
    if (!data) return '—'

    const nascimento = new Date(`${data}T00:00:00`)
    const hoje = new Date()
    let anos = hoje.getFullYear() - nascimento.getFullYear()

    const aindaNaoFezAniversario =
        hoje < new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate())

    if (aindaNaoFezAniversario) anos--

    return `${anos} anos`
}

const iniciais = (nome = '') => {
    const partesDoNome = nome.trim().split(/\s+/).filter(Boolean).slice(0, 2)

    return partesDoNome.map((parte) => parte[0]).join('').toUpperCase() || '?'
}

const ordenar = (lista, campo) => {
    return [...(lista || [])].sort(
        (a, b) => new Date(b[campo] || 0) - new Date(a[campo] || 0),
    )
}

function PerfilAtleta() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { dados, carregando, erro } = usePerfilAtleta(id)

    useEffect(() => {
        const sessao = JSON.parse(localStorage.getItem('usuario') || 'null')

        if (!sessao) {
            navigate('/login', { replace: true })
            return
        }

        const ehAtleta = Number(sessao.tipo_usuario) === 3
        const estaAcessandoOutroPerfil = String(sessao.id_usuario) !== String(id)

        if (ehAtleta && estaAcessandoOutroPerfil) {
            navigate(`/perfil-atleta/${sessao.id_usuario}`, { replace: true })
        }
    }, [id, navigate])

    if (carregando) {
        return (
            <main className="atleta-shell">
                <p className="atleta-feedback">Carregando perfil do atleta…</p>
            </main>
        )
    }

    if (erro || !dados) {
        return (
            <main className="atleta-shell">
                <Link className="atleta-voltar" to="/home">
                    ← Voltar ao início
                </Link>

                <section className="atleta-feedback">
                    <h1>Não foi possível abrir o perfil</h1>
                    <p>{erro || 'Atleta não encontrado.'}</p>
                    <p className="atleta-ajuda">
                        Confira se a API está ativa e se VITE_API_URL aponta para o endereço correto.
                    </p>
                </section>
            </main>
        )
    }

    const {
        atleta,
        exames = [],
        desempenhos = [],
        atividades = [],
    } = dados

    const nome = atleta.nome_usuario || 'Atleta'
    const timeSelecionado = JSON.parse(localStorage.getItem('timeSelecionado') || 'null')
    const time = atleta.time?.nome_time || timeSelecionado?.nome || 'Sem equipe vinculada'
    const cpf = atleta.cpf_usuario || '—'

    const pontuacoes = ordenar(
        desempenhos.filter((desempenho) => desempenho.pontuacao != null),
        'data_desempenho',
    )
        .reverse()
        .slice(-12)

    const maxPts = Math.max(
        1,
        ...pontuacoes.map((desempenho) => Number(desempenho.pontuacao)),
    )

    return (
        <div className="atleta-shell">
            <header className="atleta-topbar">
                <Link className="atleta-brand" to="/home">
                    LAIVY<span>•</span>
                </Link>

                <div className="atleta-topbar-acoes">
                    {import.meta.env.DEV && (
                        <Link className="atleta-voltar" to="/home">
                            ← Voltar
                        </Link>
                    )}
                </div>
            </header>

            <main className="atleta-main">
                <div className="atleta-titulo">
                    <div>
                        <span className="atleta-kicker">GESTÃO ESPORTIVA</span>
                        <h1>Perfil do Atleta</h1>
                    </div>

                    <span className="atleta-id">ID #{id}</span>
                </div>

                <section className="atleta-hero">
                    <div className="atleta-avatar">
                        {atleta.foto_usuario ? (
                            <img src={atleta.foto_usuario} alt={`Foto de ${nome}`} />
                        ) : (
                            iniciais(nome)
                        )}
                    </div>

                    <div className="atleta-identidade">
                        <h2>{nome}</h2>

                        <div className="atleta-tags">
                            <span>Atleta</span>
                            <span className="tag-equipe">{time}</span>
                        </div>

                        <div className="atleta-stats">
                            <CartaoResumo rotulo="Atividades" valor={atividades.length} />
                            <CartaoResumo rotulo="Exames" valor={exames.length} />
                            <CartaoResumo rotulo="Desempenhos" valor={desempenhos.length} />
                            <CartaoResumo
                                rotulo="Idade"
                                valor={idade(atleta.data_nasc_usuario)}
                            />
                        </div>
                    </div>
                </section>

                <h2 className="atleta-secao-titulo">Informações pessoais</h2>

                <section className="atleta-info">
                    <div>
                        <span>CPF</span>
                        <strong>{cpf}</strong>
                    </div>
                    <div>
                        <span>Nascimento</span>
                        <strong>{dataBR(atleta.data_nasc_usuario)}</strong>
                    </div>
                    <div>
                        <span>Celular</span>
                        <strong>{atleta.cel_usuario || '—'}</strong>
                    </div>
                </section>

                <section className="atleta-grid">
                    <article className="atleta-card">
                        <h2>Pontuação nos jogos</h2>

                        {pontuacoes.length ? (
                            <div
                                className="atleta-chart"
                                role="img"
                                aria-label="Gráfico das pontuações dos últimos desempenhos"
                            >
                                {pontuacoes.map((desempenho, indice) => {
                                    const altura = Math.max(
                                        8,
                                        (Number(desempenho.pontuacao) / maxPts) * 100,
                                    )

                                    return (
                                        <div
                                            className="atleta-bar-wrap"
                                            key={`${desempenho.data_desempenho}-${indice}`}
                                        >
                                            <span>{desempenho.pontuacao}</span>
                                            <div
                                                className="atleta-bar"
                                                style={{ height: `${altura}%` }}
                                            />
                                            <small>{dataBR(desempenho.data_desempenho)}</small>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="atleta-vazio">
                                📈<br />
                                Sem pontuações registradas
                            </p>
                        )}
                    </article>

                    <article className="atleta-card">
                        <h2>Exames médicos</h2>

                        {exames.length ? (
                            <div className="atleta-lista">
                                {ordenar(exames, 'data_inicio_exame').map((exame, indice) => {
                                    const medidas = [
                                        exame.peso_usuario && `${exame.peso_usuario} kg`,
                                        exame.altura_usuario && `${exame.altura_usuario} m`,
                                        exame.taxa_gordura_usuario && `${exame.taxa_gordura_usuario}% gordura`,
                                    ]
                                        .filter(Boolean)
                                        .join(' · ')

                                    return (
                                        <div
                                            className="exame-linha"
                                            key={exame.id_exame || indice}
                                        >
                                            <div>
                                                <strong>{dataBR(exame.data_inicio_exame)}</strong>
                                                <small>{medidas || 'Sem medidas informadas'}</small>
                                                {exame.observacoes_exame && (
                                                    <small>{exame.observacoes_exame}</small>
                                                )}
                                            </div>

                                            <span
                                                className={
                                                    exame.status_usuario === 1
                                                        ? 'status-apto'
                                                        : 'status-inapto'
                                                }
                                            >
                                                {exame.status_usuario === 1 ? 'Apto' : 'Inapto'}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="atleta-vazio">
                                🩺<br />
                                Nenhum exame registrado
                            </p>
                        )}
                    </article>
                </section>

                <article className="atleta-card atleta-lista-card">
                    <h2>Atividades participadas</h2>

                    {atividades.length ? (
                        <div className="atleta-lista">
                            {ordenar(atividades, 'data_atividade')
                                .slice(0, 20)
                                .map((atividade, indice) => {
                                    const ehJogo = Number(atividade.tipo_atividade) === 2
                                    const local = atividade.lugar_atividade
                                        ? ` · ${atividade.lugar_atividade}`
                                        : ''

                                    return (
                                        <div
                                            className="atividade-linha"
                                            key={atividade.id_atividade || indice}
                                        >
                                            <i className={ehJogo ? 'dot-jogo' : 'dot-treino'} />

                                            <div>
                                                <strong>{atividade.nome_atividade || 'Atividade'}</strong>
                                                <small>
                                                    {dataBR(atividade.data_atividade)}{local}
                                                </small>
                                            </div>

                                            <span>{ehJogo ? 'Jogo' : 'Treino'}</span>
                                        </div>
                                    )
                                })}
                        </div>
                    ) : (
                        <p className="atleta-vazio">
                            📅<br />
                            Nenhuma atividade registrada
                        </p>
                    )}
                </article>

                <article className="atleta-card atleta-lista-card">
                    <h2>Histórico de desempenho</h2>

                    {desempenhos.length ? (
                        <div className="atleta-lista">
                            {ordenar(desempenhos, 'data_desempenho').map((desempenho, indice) => {
                                const medidas = [
                                    desempenho.salto_horizontal &&
                                        `Salto horizontal: ${desempenho.salto_horizontal} m`,
                                    desempenho.salto_vertical &&
                                        `Salto vertical: ${desempenho.salto_vertical} m`,
                                ]
                                    .filter(Boolean)
                                    .join(' · ')

                                return (
                                    <div
                                        className="desempenho-linha"
                                        key={desempenho.id_desempenho || indice}
                                    >
                                        <div>
                                            <strong>{dataBR(desempenho.data_desempenho)}</strong>
                                            <small>{medidas || 'Sem medidas registradas'}</small>
                                        </div>

                                        <b>
                                            {desempenho.pontuacao ?? '—'}
                                            <small>pts</small>
                                        </b>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="atleta-vazio">
                            📊<br />
                            Nenhum desempenho registrado
                        </p>
                    )}
                </article>
            </main>
        </div>
    )
}

export default PerfilAtleta
