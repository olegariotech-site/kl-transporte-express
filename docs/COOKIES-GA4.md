# Avaliação, consentimento e Google Analytics 4

## Estado publicado

- Measurement ID oficial: `G-WD9YYDMBTQ`.
- A tag GA4 não é colocada diretamente no HTML.
- O script remoto do Google só é carregado quando o visitante autoriza **Analíticos**.
- Consentimento atual: versão 2, para solicitar uma nova escolha após a ativação efetiva do GA4.
- Publicidade permanece negada: `ad_storage`, `ad_user_data` e `ad_personalization` ficam em `denied`.
- Google Signals e personalização de anúncios ficam desativados na configuração do site.
- Política: `/privacidade.html`.

## Eventos comerciais configurados

Somente após consentimento analítico:

- `google_review_click`: clique no CTA/link de avaliação.
- `whatsapp_click`: clique em links diretos do WhatsApp.
- `phone_click`: clique no telefone.
- `instagram_click`: clique no Instagram.
- `email_click`: clique no e-mail.
- `generate_lead`: envio válido do formulário de cotação.

Os eventos não enviam nomes, endereços de coleta/entrega, mercadoria, peso, dimensões, observações nem o texto montado para o WhatsApp.

## Consentimento

`kl_cookie_consent` em localStorage contém apenas `version`, `analytics` (`granted`/`denied`) e `updatedAt`.

A tag começa bloqueada. Aceitar carrega GA4 e atualiza `analytics_storage` para `granted`. Recusar mantém a tag sem carregamento. Ao retirar autorização, o envio é desativado e cookies `_ga` / `_ga_*` do domínio são removidos.

## Configuração recomendada no painel GA4

Em **Medição otimizada**, revisar os recursos automáticos. Manter somente o que fizer sentido e desativar **Interações com formulários**, porque o projeto já mede `generate_lead` de forma controlada. Se quiser evitar duplicidade com os eventos próprios, também é recomendável revisar **Cliques de saída**.

Não habilitar Google Signals, personalização de anúncios ou recursos publicitários sem uma nova revisão de consentimento e política.

## Validação

Testar home e política:
- primeira visita sem escolha: nenhuma requisição para `googletagmanager.com/gtag/js`;
- Recusar: GA4 continua bloqueado;
- Aceitar: GA4 carrega e cria cookies analíticos;
- recarregar: preferência persiste;
- Configurar cookies > retirar aceite: envio fica bloqueado e cookies GA são removidos;
- eventos comerciais aparecem no DebugView/Tempo real somente com consentimento.

Fontes técnicas:
- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/tag-platform/security/guides/privacy
