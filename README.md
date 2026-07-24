# Clube do Buteco — Landing Page de Credenciamento

Landing page completa e responsiva para credenciamento gratuito de bares, botecos, pubs, gastrobares, cervejarias, restaurantes, espetarias e casas de petiscos de Juiz de Fora na campanha **Clube do Buteco**, do O Seu Clube.

## Estrutura de arquivos

```
clube-do-buteco/
├── index.html          → todo o conteúdo e estrutura da página
├── styles.css           → identidade visual (cores, tipografia, layout, responsividade)
├── script.js             → configuração editável + lógica interativa (formulário, máscaras, FAQ, etc.)
├── assets/
│   ├── images/           → fotos (hero, influenciador, especialista, imagem de Open Graph)
│   └── icons/             → favicon
└── README.md
```

## Como publicar

1. Substitua as imagens de `assets/images/` por fotos reais dos bares, do influenciador e do especialista (as imagens atuais são placeholders coloridos gerados automaticamente).
2. Ajuste as configurações em `script.js` (veja a seção abaixo).
3. Publique os três arquivos (`index.html`, `styles.css`, `script.js`) e a pasta `assets/` em qualquer hospedagem estática: Netlify, Vercel, GitHub Pages, S3, cPanel etc. Não há dependência de backend/servidor — é HTML, CSS e JavaScript puro.
4. Teste o formulário completo (as 5 etapas) e confirme que os dados aparecem corretamente no console do navegador (modo demonstração) ou no seu webhook, se configurado.

## Onde editar cada coisa

Tudo o que muda com frequência está centralizado no topo de `script.js`, no objeto `CONFIG`:

| O que editar | Onde | Campo |
|---|---|---|
| Datas da campanha (início/fim) | `script.js` | `CONFIG.CAMPAIGN_START_DATE`, `CONFIG.CAMPAIGN_END_DATE` |
| Número de WhatsApp da equipe | `script.js` | `CONFIG.WHATSAPP_NUMBER` (só números, com DDI+DDD, ex: `"5532999999999"`) — já configurado com `5532987026136` |
| Mensagem automática do WhatsApp (botão flutuante e tela de sucesso) | `script.js` | `CONFIG.WHATSAPP_MESSAGE` |
| Enviar o cadastro do formulário direto pelo WhatsApp | `script.js` | `CONFIG.SEND_TO_WHATSAPP_ON_SUBMIT` (`true`/`false`) |
| URL do webhook (Make, Zapier, RD Station, HubSpot, Pipedrive, Google Sheets, API própria) | `script.js` | `CONFIG.WEBHOOK_URL` |
| Influenciador/embaixador da campanha | `script.js` | `CONFIG.INFLUENCER` (defina `active: true` e preencha nome, Instagram, bio, foto e vídeo) |
| Especialista em cachaças | `script.js` | `CONFIG.SPECIALIST` (defina `active: true` e preencha os dados) |
| Cachaça oficial / patrocinador | `script.js` | `CONFIG.SPONSOR` (defina `confirmed: true` e `name` só após a parceria ser assinada; `showSection: false` oculta a seção inteira) |

Textos de todas as seções (títulos, parágrafos, promoções, FAQ, calendário etc.) ficam diretamente em `index.html`, na ordem em que aparecem na página — cada seção tem um comentário `<!-- SEÇÃO ... -->` indicando o que é.

### Datas da campanha
As datas são exibidas por extenso e a duração em dias é calculada automaticamente. Basta alterar `CAMPAIGN_START_DATE` e `CAMPAIGN_END_DATE` em `script.js` (formato `AAAA-MM-DD`).

### WhatsApp
Enquanto `WHATSAPP_NUMBER` estiver vazio, os botões de WhatsApp (flutuante e da tela de sucesso) ficam inativos (`href="#"`). O número já está preenchido com `5532987026136`.

Como não existe API gratuita para o WhatsApp receber dados automaticamente, ao concluir o formulário (com `SEND_TO_WHATSAPP_ON_SUBMIT: true`) o site abre uma aba do WhatsApp já com um resumo do cadastro (nome do bar, contato, promoção etc.) pronto no campo de mensagem — quem preencheu só precisa clicar em enviar. Se preferir receber os cadastros só por outro canal (ex: planilha via webhook), defina `SEND_TO_WHATSAPP_ON_SUBMIT: false`.

### Webhook / integração
Se `WEBHOOK_URL` estiver vazio, o formulário roda em **modo demonstração**: valida tudo normalmente, simula o envio, mostra a tela de sucesso e imprime o JSON completo do cadastro no console do navegador (F12 → Console) — nenhum dado é perdido. Quando `WEBHOOK_URL` for preenchida, o formulário faz um `POST` com o JSON do cadastro (incluindo UTMs, data/hora e nomes dos arquivos anexados) para essa URL. Não insira credenciais/segredos diretamente no front-end — use o webhook apenas como porta de entrada para sua automação (Make, Zapier etc.), que deve tratar autenticação do lado do servidor.

## Funcionalidades do formulário

- 5 etapas com barra de progresso e navegação (voltar/continuar).
- Validação de campos obrigatórios, e-mail e checkboxes de confirmação.
- Máscaras automáticas para telefone/WhatsApp, CEP e CNPJ.
- Cards clicáveis com sugestões de promoção (preenchem o campo automaticamente).
- Upload de arquivos (fotos, vídeos, cardápio, logotipo) com pré-visualização e limite de 20MB por arquivo.
- Salvamento automático no navegador (`localStorage`): se a pessoa fechar a aba, os dados preenchidos são recuperados ao voltar.
- Captura automática de UTMs (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) da URL.
- Prevenção de envio duplicado dentro da mesma sessão.
- Tela de sucesso com os próximos passos e botão de WhatsApp.

## Regras de conteúdo respeitadas

- Nenhum dado, patrocinador, influenciador, especialista ou resultado foi inventado — todos os campos correspondentes têm placeholders explícitos ("em definição") até serem preenchidos com informações reais.
- A campanha é apresentada como gratuita, sem mensalidade, comissão ou taxa de adesão, em todas as seções.
- Mensagens de consumo responsável ("Se beber, não dirija", "Aprecie com moderação. Venda e consumo proibidos para menores de 18 anos") aparecem no rodapé e na seção dedicada.
- Nenhuma promessa de resultado, alcance garantido ou presença certa em todos os canais/ações — todos os avisos legais do briefing foram incluídos como "fine print".

## Tecnologias

HTML5, CSS3 e JavaScript puro (vanilla), sem frameworks. Ícones via [Lucide](https://lucide.dev) (CDN). Fontes via Google Fonts (Bree Serif, Manrope, Kalam). Mobile-first, com barra fixa "Participar gratuitamente" e botão flutuante de WhatsApp em telas pequenas. Segue diretrizes WCAG AA (contraste, foco visível, labels, ARIA, HTML semântico).
