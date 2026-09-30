// A URL base da API vem de uma variável de ambiente (arquivo .env)
const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
// Função assíncrona: o async indica que a operação depende de resposta externa.
export async function fazerLogin(login, senha, tipo) {
    // No modo de desenvolvimento o login é local, para permitir avaliar o frontend sem servidor ou banco.
    if (import.meta.env.DEV) {
        if (!login.trim() || !senha) throw new Error('Preencha o login e a senha para continuar.');
        return {
            usuario: {
                id_usuario: 1,
                nome_usuario: login.trim(),
                login_usuario: login.trim(),
                tipo_usuario: Number(tipo),
                primeiro_login: 0,
                time: { id_time: 1, nome_time: 'LAIVY Esporte Clube' },
            },
        };
    }

    let resposta;
    try {
        resposta = await fetch(`${apiUrl}/usuarios/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            login_usuario: login,
            senha_usuario: senha,
            tipo_usuario: String(tipo),
        }),
        });
    } catch {
        throw new Error('Não foi possível conectar à API. Confirme se o backend está ativo em http://localhost:8080.');
    }

    const texto = await resposta.text();
    let resultado = {};
    if (texto.trim()) {
        try {
            resultado = JSON.parse(texto);
        } catch {
            throw new Error(`A API respondeu com conteúdo inesperado (HTTP ${resposta.status}). Verifique o endereço do backend.`);
        }
    }
    if (!resposta.ok) {
        throw new Error(resultado.erro || resultado.error || `Falha no login (HTTP ${resposta.status}). Confira as credenciais e o perfil selecionado.`);
    }
    if (!resultado.usuario) {
        throw new Error('A API aceitou o login, mas não retornou os dados do usuário. Confira a resposta do backend.');
    }
    return resultado;
}
