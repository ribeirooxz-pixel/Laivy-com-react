package br.com.gerenciador.projeto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * O frontend é um app React (pasta frontend/, build em static/). Todas as
 * telas abrem o mesmo index.html — quem escolhe a tela é o roteador do React.
 *
 * Rotas atuais do React: /login, /home, /trocar-senha e /perfil-atleta/{id}. As URLs antigas
 * com ".html" continuam respondendo porque os e-mails de acesso e o healthcheck
 * do docker-compose.prod.yml ainda apontam para elas (o React redireciona para
 * /login quando não conhece a rota).
 * "index" fica de fora do padrão para o forward não cair aqui de novo.
 */
@Controller
public class SpaController {

    @GetMapping({"/", "/login", "/home", "/trocar-senha", "/perfil-atleta/{id}", "/{tela:(?!index\\.)[a-z-]+}.html"})
    public String spa() {
        return "forward:/index.html";
    }
}
