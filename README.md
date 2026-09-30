# LAIVY — frontend React

Frontend React do projeto de gestão esportiva LAIVY, organizado para a primeira entrega do TCC com páginas, rotas, componentes reutilizáveis, hooks, services, estilos e assets.

## Iniciar o projeto

1. Instale o Node.js LTS.
2. Na pasta do projeto, execute `npm install`.
3. Execute `npm run dev` e abra o endereço exibido pelo Vite.

Para gerar a versão de produção, execute `npm run build`.

## Rotas

- `/login` — formulário de login.
- `/home` — tela inicial.
- `/perfil-atleta/:id` — perfil individual do atleta.

Em desenvolvimento, o formulário aceita os dados preenchidos localmente e as páginas exibem dados de exemplo. Para autenticação e dados reais, configure `VITE_API_URL` para o endereço da API Spring.

## Estrutura

- `src/pages` — páginas de login, início e perfil.
- `src/componentes` — componentes reutilizáveis e rodapé.
- `src/hooks` — estado e carregamento de dados.
- `src/services` — comunicação com a API.
- `src/styles` — estilos das páginas.
- `src/assets` e `public` — recursos visuais existentes.
