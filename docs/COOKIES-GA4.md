# Avaliação, consentimento e futura integração GA4

## Estado publicado nesta etapa

- Nenhum Measurement ID configurado e nenhuma tag de Analytics carregada.
- CTA após a cotação e link secundário no rodapé: https://g.page/r/CQbD5_WnJjTnECE/review.
- Ambos têm `data-analytics-event="google_review_click"`; a localização é `review_section` ou `footer`.
- Política: `/privacidade.html`. Painel disponível em **Configurar cookies** no rodapé de ambas as páginas.
- Comportamento em `assets/js/main.js`; estilos em `assets/css/styles.css`; HTML explícito nas duas páginas.

## Consentimento

`kl_cookie_consent` em localStorage contém apenas `version`, `analytics` (`granted`/`denied`) e `updatedAt`. Versão inicial: 1. Registro inválido, ausente ou de outra versão equivale a `denied` e exibe o banner. Limpar dados do navegador também renova a escolha; não há prazo de retenção arbitrário.

Aceitar autoriza somente analíticos. Recusar registra `denied`. Salvar usa o checkbox atual. Abrir preferências ou fechar com Escape/× não altera a decisão. O dialog nativo contém foco; ao fechar, o foco retorna ao acionador disponível. O banner não é modal e não captura foco automaticamente.

Mudanças em outra aba e restaurações pelo back/forward cache são sincronizadas. Se localStorage falhar, a decisão vale apenas na página aberta e a mensagem acessível informa essa limitação. Sem JavaScript, nenhuma tag analítica carrega, e os controles de preferência ficam ocultos.

## Ativação futura — somente com ID oficial e revisão da política

1. Em `assets/js/main.js`, preencher a constante `GA4_MEASUREMENT_ID`, hoje vazia, com o ID oficial da propriedade da K.L. Não acrescentar outro snippet no HTML ou Google Tag Manager.
2. Revisar a política, retirando a afirmação de que Analytics ainda não está instalado e descrevendo os recursos efetivamente habilitados. Incrementar `CONSENT_VERSION` se houver mudança de finalidade/escopo; isso solicita nova escolha.
3. Desativar na propriedade GA4 a medição otimizada de interações de formulário e qualquer coleta automática que possa incluir dados pessoais, URLs de saída com texto de cotação ou parâmetros sensíveis. Revisar as demais medições otimizadas antes de publicar.
4. Testar com a propriedade oficial e ferramentas do Google: entrada sem escolha, recusa, aceite, reload, retirada do aceite, mudança entre abas e retorno pelo histórico. Conferir Network e cookies antes e depois; nunca usar dados reais de cotação nos testes.

A arquitetura segue **Basic Consent Mode**: `analytics_storage`, `ad_storage`, `ad_user_data` e `ad_personalization` começam como `denied`. A fila inicial fica apenas em memória. O script remoto só é inserido quando há ID válido E `analytics === 'granted'`. Publicidade permanece negada. Google Signals e personalização de anúncios ficam desativados na configuração.

Ao retirar autorização, `ga-disable-<ID>` passa a `true` antes da atualização de consentimento; os cookies `_ga`/`_ga_*` no caminho raiz são removidos. A biblioteca já carregada permanece em memória até sair da página, com envio desativado. Nenhuma decisão desfaz envios anteriores. Uma requisição já iniciada durante consentimento positivo não pode ser desfeita. O comportamento de rede da biblioteca real exige validação quando o ID oficial for instalado.

Cliques de avaliação só entram na fila se houver ID e autorização. Os eventos levam apenas o nome e a posição do link, nunca campos do formulário. A URL de página enviada pela configuração exclui query string e hash. Nenhum evento é armazenado para envio posterior ao consentimento.

Fontes técnicas:
- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/tag-platform/security/guides/privacy

## Validação

Verificar home e política; consentimento inicial, persistência, recusa e retirada; teclado, foco, Escape e checkbox; atalhos flutuantes e ausência de overflow nas larguras 320, 375, 390, 430, 768, 980, 1366 e 1440. Preservar HERO, formulário, contatos, domínio, CNAME e configuração Pages.
