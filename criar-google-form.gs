/* ============================================================
   CRIAR-GOOGLE-FORM.GS
   Script para gerar automaticamente o Google Forms de
   credenciamento do Clube do Buteco, com todas as perguntas,
   tipos de campo, opções e validações já configurados.

   COMO USAR:
   1. Acesse https://script.google.com
   2. Clique em "Novo projeto"
   3. Apague o conteúdo padrão (function myFunction() {...}) e
      cole todo o conteúdo deste arquivo no lugar
   4. Clique no ícone de salvar (💾) e dê um nome ao projeto
      (ex: "Gerador Clube do Buteco")
   5. Clique em "Executar" (▶) — na primeira vez o Google vai
      pedir autorização: clique em "Revisar permissões", escolha
      sua conta, clique em "Avançado" e depois em
      "Acessar Gerador Clube do Buteco (não seguro)" — é seguro,
      esse aviso aparece porque o script não foi publicado
      publicamente, apenas para você.
   6. Após rodar, vá em "Ver" → "Registros" (ou "Execuções") para
      ver os links impressos no final: o link de EDIÇÃO do
      formulário e o link PÚBLICO para respostas.
   7. Abra o link de edição, revise o formulário e publique.
   8. Para conectar ao site, use "Obter link pré-preenchido"
      (⋮ → Obter link pré-preenchido) como explicado no arquivo
      perguntas-google-forms.md.

   Este script cria a versão COMPLETA (todas as etapas do site).
   Se quiser a versão ESSENCIAL (10 perguntas), veja a função
   criarFormularioEssencial() no final deste arquivo — troque
   qual função é chamada ao executar (selecione o nome da função
   no menu suspenso ao lado do botão "Executar").
   ============================================================ */

function criarFormularioCompleto() {
  var form = FormApp.create('Credenciamento — Clube do Buteco');
  form.setDescription(
    'Formulário de credenciamento de bares, botecos e estabelecimentos gastronômicos ' +
    'de Juiz de Fora na campanha Clube do Buteco, do O Seu Clube. Participação gratuita.'
  );
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setConfirmationMessage(
    'Cadastro recebido. A primeira rodada já foi servida! Nossa equipe vai entrar em ' +
    'contato pelo WhatsApp para dar continuidade ao credenciamento.'
  );
  form.setShowLinkToRespondAgain(false);

  // ---------------------------------------------------------
  // ETAPA 1 — Informações básicas
  // ---------------------------------------------------------
  form.addPageBreakItem().setTitle('Etapa 1 — Informações básicas');

  form.addTextItem().setTitle('Nome do estabelecimento').setRequired(true);
  form.addTextItem().setTitle('Nome do proprietário').setRequired(true);
  form.addTextItem().setTitle('Nome do responsável pelo cadastro').setRequired(true);
  form.addTextItem().setTitle('WhatsApp').setRequired(true);
  form.addTextItem().setTitle('Telefone');

  var email = form.addTextItem().setTitle('E-mail').setRequired(true);
  email.setValidation(FormApp.createTextValidation().requireTextIsEmail().build());

  form.addTextItem().setTitle('Instagram');
  form.addTextItem().setTitle('CNPJ');
  form.addTextItem().setTitle('Endereço').setRequired(true);
  form.addTextItem().setTitle('Bairro').setRequired(true);
  form.addTextItem().setTitle('Cidade').setRequired(true);
  form.addTextItem().setTitle('CEP');

  form.addMultipleChoiceItem()
    .setTitle('Tipo de estabelecimento')
    .setChoiceValues([
      'Bar', 'Boteco', 'Pub', 'Gastrobar', 'Cervejaria', 'Restaurante',
      'Espetaria', 'Hamburgueria', 'Casa de petiscos', 'Casa de samba', 'Outro'
    ])
    .setRequired(true);

  // ---------------------------------------------------------
  // ETAPA 2 — Sobre o estabelecimento
  // ---------------------------------------------------------
  form.addPageBreakItem().setTitle('Etapa 2 — Sobre o estabelecimento');

  form.addTextItem().setTitle('Ano de fundação');
  form.addTextItem().setTitle('Ticket médio aproximado');
  form.addParagraphTextItem().setTitle('Conte brevemente a história do estabelecimento');
  form.addTextItem().setTitle('Dias de funcionamento');
  form.addTextItem().setTitle('Horários');
  form.addTextItem().setTitle('Capacidade aproximada');
  form.addTextItem().setTitle('Principais produtos');
  form.addTextItem().setTitle('Prato mais vendido');
  form.addTextItem().setTitle('Bebida mais vendida');

  form.addCheckboxItem()
    .setTitle('Características do estabelecimento')
    .setChoiceValues([
      'Possui cachaças',
      'Possui música ao vivo',
      'Possui área externa',
      'Possui televisão para jogos',
      'Possui espaço para grupos'
    ]);

  form.addTextItem().setTitle('Dias de menor movimento');
  form.addTextItem().setTitle('Horários de menor movimento');

  // ---------------------------------------------------------
  // ETAPA 3 — Promoção
  // ---------------------------------------------------------
  form.addPageBreakItem().setTitle('Etapa 3 — Promoção');

  form.addMultipleChoiceItem()
    .setTitle('Você já sabe qual benefício deseja oferecer?')
    .setChoiceValues([
      'Já tenho uma promoção',
      'Tenho algumas ideias',
      'Preciso de ajuda',
      'Quero receber sugestões'
    ]);

  form.addTextItem().setTitle('Nome da promoção');
  form.addParagraphTextItem().setTitle('Descrição da promoção');
  form.addTextItem().setTitle('Produtos participantes');
  form.addTextItem().setTitle('Dias válidos');
  form.addTextItem().setTitle('Horários válidos');
  form.addTextItem().setTitle('Valor mínimo');
  form.addTextItem().setTitle('Limite por cliente');
  form.addParagraphTextItem().setTitle('Regras da promoção');
  form.addParagraphTextItem().setTitle('Restrições');
  form.addTextItem().setTitle('Prazo de validade');

  form.addCheckboxItem()
    .setTitle('Promoção exclusiva para usuários do Clube?')
    .setChoiceValues(['Sim, exclusiva para usuários do Clube do Buteco']);

  // ---------------------------------------------------------
  // ETAPA 4 — Conteúdo
  // ---------------------------------------------------------
  form.addPageBreakItem().setTitle('Etapa 4 — Conteúdo');

  form.addCheckboxItem()
    .setTitle('Conteúdo e participação')
    .setChoiceValues([
      'Possui logotipo',
      'Possui fotos profissionais',
      'Deseja receber visita para fotos',
      'Autoriza fotos no estabelecimento',
      'Autoriza gravação de vídeo',
      'Gostaria de contar a história do bar',
      'Interesse em entrevista',
      'Interesse em ação de rádio',
      'Interesse em sorteio',
      'Interesse em ação com marca de cachaça'
    ]);

  form.addTextItem().setTitle('Melhor dia para visita');
  form.addTextItem().setTitle('Melhor horário para visita');

  // Upload de arquivo é opcional — exige que o respondente esteja
  // logado com uma conta Google. Descomente as linhas abaixo se
  // quiser habilitar (e ative "Coletar e-mails" no formulário):
  //
  // form.setCollectEmail(true);
  // form.addFileUploadItem()
  //   .setTitle('Envie fotos, logotipo, cardápio ou vídeos (opcional)')
  //   .setRequired(false);

  form.addParagraphTextItem().setTitle(
    'Observação: por enquanto, envie fotos, logotipo, cardápio ou vídeos diretamente ' +
    'pelo WhatsApp após o cadastro.'
  );

  // ---------------------------------------------------------
  // ETAPA 5 — Confirmação
  // ---------------------------------------------------------
  form.addPageBreakItem().setTitle('Etapa 5 — Confirmação');

  var confirmacoes = form.addCheckboxItem()
    .setTitle('Confirmações (marque todas para concluir o cadastro)')
    .setChoiceValues([
      'Confirmo que as informações são verdadeiras.',
      'Autorizo o contato da equipe do O Seu Clube.',
      'Estou ciente de que o cadastro é gratuito.',
      'Estou ciente de que a promoção deverá ser aprovada.',
      'Estou ciente de que será necessário assinar um termo de compromisso.',
      'Comprometo-me a cumprir a promoção após sua publicação.',
      'Autorizo o tratamento dos dados para análise do credenciamento.',
      'Declaro que o estabelecimento cumpre as regras aplicáveis à comercialização de bebidas alcoólicas.'
    ])
    .setRequired(true);

  confirmacoes.setValidation(
    FormApp.createCheckboxValidation().requireSelectExactly(8).build()
  );

  // ---------------------------------------------------------
  // Cria uma planilha do Google Sheets para receber as respostas
  // ---------------------------------------------------------
  var sheet = SpreadsheetApp.create('Respostas — Clube do Buteco');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('Formulário criado com sucesso!');
  Logger.log('Link de EDIÇÃO (só para você): ' + form.getEditUrl());
  Logger.log('Link PÚBLICO (para preencher): ' + form.getPublishedUrl());
  Logger.log('Planilha de respostas: ' + sheet.getUrl());
}

/* ============================================================
   VERSÃO ESSENCIAL (10 perguntas) — opcional
   Para usar, selecione "criarFormularioEssencial" no menu
   suspenso ao lado do botão "Executar" antes de clicar em rodar.
   ============================================================ */
function criarFormularioEssencial() {
  var form = FormApp.create('Credenciamento — Clube do Buteco (essencial)');
  form.setDescription(
    'Formulário rápido de credenciamento de bares e botecos de Juiz de Fora na ' +
    'campanha Clube do Buteco, do O Seu Clube. Participação gratuita.'
  );
  form.setConfirmationMessage(
    'Cadastro recebido. A primeira rodada já foi servida! Nossa equipe vai entrar em ' +
    'contato pelo WhatsApp em breve.'
  );
  form.setShowLinkToRespondAgain(false);

  form.addTextItem().setTitle('Nome do estabelecimento').setRequired(true);
  form.addTextItem().setTitle('Nome do proprietário').setRequired(true);
  form.addTextItem().setTitle('WhatsApp').setRequired(true);

  var email = form.addTextItem().setTitle('E-mail').setRequired(true);
  email.setValidation(FormApp.createTextValidation().requireTextIsEmail().build());

  form.addTextItem().setTitle('Instagram');
  form.addTextItem().setTitle('Endereço / bairro').setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Tipo de estabelecimento')
    .setChoiceValues([
      'Bar', 'Boteco', 'Pub', 'Gastrobar', 'Cervejaria', 'Restaurante',
      'Espetaria', 'Hamburgueria', 'Casa de petiscos', 'Casa de samba', 'Outro'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Já sabe qual promoção quer oferecer?')
    .setChoiceValues([
      'Já tenho uma promoção',
      'Tenho algumas ideias',
      'Preciso de ajuda',
      'Quero receber sugestões'
    ]);

  form.addParagraphTextItem().setTitle('Nome ou ideia da promoção');
  form.addTextItem().setTitle('Melhor dia e horário para visita');

  var sheet = SpreadsheetApp.create('Respostas — Clube do Buteco (essencial)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('Formulário criado com sucesso!');
  Logger.log('Link de EDIÇÃO (só para você): ' + form.getEditUrl());
  Logger.log('Link PÚBLICO (para preencher): ' + form.getPublishedUrl());
  Logger.log('Planilha de respostas: ' + sheet.getUrl());
}

/* ============================================================
   LISTAR IDS DAS PERGUNTAS (entry.XXXXXXX)
   Gera, de uma vez, o ID de cada pergunta do formulário — sem
   precisar preencher a página de "Preencher formulário
   automaticamente" manualmente pergunta por pergunta.

   COMO USAR:
   1. No mesmo projeto do Apps Script (o que já usou para criar
      o formulário), cole esta função junto com as anteriores
      (ou substitua o ID abaixo pelo do seu formulário — ele já
      está preenchido com o formulário que você criou).
   2. No menu suspenso ao lado do botão "Executar", selecione
      "listarEntryIds".
   3. Clique em "Executar".
   4. Vá em "Ver" → "Registros de execução" (ou "Execuções").
   5. Copie TODAS as linhas que aparecerem (título da pergunta
      + entry.XXXXXXX + tipo) e me envie aqui no chat.
   ============================================================ */
function listarEntryIds() {
  // ID extraído da URL de edição do formulário:
  // https://docs.google.com/forms/d/ESSE_ID_AQUI/edit
  var formId = '1MMzxS8bUb5skXof2E8poNZOgzpVJe0t0wh1P8YcKObo';

  var form = FormApp.openById(formId);
  var items = form.getItems();

  Logger.log('Formulário: ' + form.getTitle());
  Logger.log('----------------------------------------');

  items.forEach(function (item) {
    var tipo = item.getType();
    // Quebras de página e cabeçalhos de seção não têm entry.ID (não são perguntas)
    if (tipo === FormApp.ItemType.PAGE_BREAK || tipo === FormApp.ItemType.SECTION_HEADER) {
      Logger.log('--- ' + item.getTitle() + ' ---');
      return;
    }
    Logger.log(item.getTitle() + '  =>  entry.' + item.getId() + '  (' + tipo + ')');
  });

  Logger.log('----------------------------------------');
  Logger.log('Copie tudo acima e envie no chat.');
}
