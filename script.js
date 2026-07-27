/* ============================================================
   CLUBE DO BUTECO — script.js
   Toda a lógica interativa da landing page: configuração editável,
   formulário multi-etapas, máscaras, upload, promo builder, FAQ,
   WhatsApp flutuante e integração por webhook.
   ============================================================ */

/* ============================================================
   1. CONFIGURAÇÃO EDITÁVEL
   Altere os valores abaixo para atualizar textos, datas, contatos
   e integrações sem precisar mexer no restante do código.
   ============================================================ */
const CONFIG = {

  // ---- Datas da campanha (formato AAAA-MM-DD) ----
  CAMPAIGN_START_DATE: "2026-08-06",
  CAMPAIGN_END_DATE: "2026-09-19",

  // ---- WhatsApp da equipe (apenas números, com DDI e DDD) ----
  // Exemplo: "5532999999999"
  WHATSAPP_NUMBER: "5532987026136",
  WHATSAPP_MESSAGE: "Olá! Tenho um bar em Juiz de Fora e gostaria de saber como participar gratuitamente do Clube do Buteco.",

  // ---- Envio do cadastro direto pelo WhatsApp ----
  // Não existe API gratuita para o WhatsApp receber automaticamente os dados
  // do formulário. Por isso, ao concluir o cadastro, o site abre o WhatsApp
  // do número acima com um resumo pronto — o dono do bar só precisa clicar
  // em "enviar" dentro do WhatsApp. Defina como false para desativar esse
  // redirecionamento automático (por exemplo, se preferir usar apenas o
  // WEBHOOK_URL abaixo para receber os dados por outro canal).
  SEND_TO_WHATSAPP_ON_SUBMIT: true,

  // ---- Webhook para receber os cadastros do formulário ----
  // Compatível com Make, Zapier, RD Station, HubSpot, Pipedrive,
  // Google Sheets (via App Script) ou API própria.
  // Se estiver vazio E o Google Forms abaixo também estiver vazio, o
  // formulário roda em MODO DEMONSTRAÇÃO: simula o envio, mostra a tela
  // de sucesso e registra o JSON no console.
  WEBHOOK_URL: "",

  // ---- Google Forms como backend gratuito do formulário ----
  // Envia os dados em segundo plano (sem sair do site) para o Google Forms
  // "Credenciamento — Clube do Buteco". As respostas caem automaticamente
  // na planilha do Google Sheets vinculada ao formulário.
  // Para trocar de formulário no futuro: pegue a URL pública do formulário
  // (algo como https://docs.google.com/forms/d/e/XXXXX/viewform), troque
  // "viewform" por "formResponse" no fim, e gere novos IDs de campo com a
  // função listarEntryIds() do arquivo criar-google-form.gs.
  GOOGLE_FORM_ACTION_URL: "https://docs.google.com/forms/d/e/1FAIpQLScKCvBq1Ryd2dxotoKdCGKorD0ZckhoL1gF1tDr1zQVk9I2eg/formResponse",

  // ---- Influenciador / embaixador da campanha ----
  // Preencha apenas com informações reais e validadas.
  INFLUENCER: {
    active: false, // true = exibir dados reais | false = exibir placeholder "em definição"
    name: "",
    role: "Criador de conteúdo — gastronomia e cultura local",
    instagram: "", // ex: "@usuario"
    bio: "",
    photo: "assets/images/influencer-placeholder.jpg",
    videoUrl: "" // link do vídeo de apresentação (YouTube, Instagram, etc.)
  },

  // ---- Especialista em cachaças ----
  SPECIALIST: {
    active: false,
    name: "",
    role: "Especialista em cachaças",
    bio: "",
    photo: "assets/images/specialist-placeholder.jpg",
    instagram: ""
  },

  // ---- Cachaça oficial da campanha ----
  SPONSOR: {
    confirmed: false, // true = mostrar nome/marca | false = mostrar "Marca parceira em definição"
    showSection: true, // false = ocultar toda a seção 15 até a parceria ser formalizada
    name: ""
  }
};

/* ============================================================
   2. UTILITÁRIOS
   ============================================================ */
function $(selector, ctx = document) { return ctx.querySelector(selector); }
function $all(selector, ctx = document) { return Array.from(ctx.querySelectorAll(selector)); }

function formatDatePt(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  return `${d} de ${meses[m - 1]}`;
}

function daysBetween(startIso, endIso) {
  const start = new Date(startIso + "T00:00:00");
  const end = new Date(endIso + "T00:00:00");
  return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  const utmFields = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const utms = {};
  utmFields.forEach((field) => {
    const value = params.get(field);
    if (value) {
      utms[field] = value;
      sessionStorage.setItem(field, value);
    } else if (sessionStorage.getItem(field)) {
      utms[field] = sessionStorage.getItem(field);
    }
  });
  return utms;
}

/* ============================================================
   2b. INTEGRAÇÃO COM GOOGLE FORMS
   Mapeia cada campo do formulário do site (atributo "name" do HTML)
   para o entry.XXXXXXX correspondente no Google Forms "Credenciamento
   — Clube do Buteco". Gerado com a função listarEntryIds() do
   arquivo criar-google-form.gs.
   ============================================================ */

// Campos de resposta única (texto, parágrafo, múltipla escolha)
const GOOGLE_FORM_FIELD_MAP = {
  nome_estabelecimento: "entry.1214260748",
  nome_proprietario: "entry.365617123",
  nome_responsavel: "entry.448295202",
  whatsapp: "entry.1132640366",
  telefone: "entry.397519054",
  email: "entry.1793992244",
  instagram: "entry.364506054",
  cnpj: "entry.1871291339",
  endereco: "entry.1522932826",
  bairro: "entry.1374145540",
  cidade: "entry.1428991678",
  cep: "entry.339684751",
  tipo_estabelecimento: "entry.685099654",

  ano_fundacao: "entry.770284089",
  ticket_medio: "entry.1126896051",
  historia: "entry.1584833174",
  dias_funcionamento: "entry.1371717384",
  horarios: "entry.1103054494",
  capacidade: "entry.1990593534",
  principais_produtos: "entry.777002349",
  prato_mais_vendido: "entry.2047595834",
  bebida_mais_vendida: "entry.2126768310",
  dias_menor_movimento: "entry.1401635964",
  horarios_menor_movimento: "entry.657011841",

  status_promocao: "entry.920886206",
  nome_promocao: "entry.1573461428",
  descricao_promocao: "entry.424864788",
  produtos_participantes: "entry.380105695",
  dias_validos: "entry.384557196",
  horarios_validos: "entry.1187961751",
  valor_minimo: "entry.741585885",
  limite_cliente: "entry.2082318341",
  regras_promocao: "entry.529425505",
  restricoes_promocao: "entry.865860575",
  prazo_validade: "entry.58425284",

  melhor_dia_visita: "entry.1061111940",
  melhor_horario_visita: "entry.1360137072"
};

// Perguntas de caixas de seleção (várias opções por pergunta).
// Cada checkbox do site "empurra" o texto da opção correspondente
// no Google Forms quando estiver marcado.
const GOOGLE_FORM_CHECKBOX_GROUPS = [
  {
    entry: "entry.138430209", // Características do estabelecimento
    options: {
      possui_cachacas: "Possui cachaças",
      musica_ao_vivo: "Possui música ao vivo",
      area_externa: "Possui área externa",
      tv_jogos: "Possui televisão para jogos",
      espaco_grupos: "Possui espaço para grupos"
    }
  },
  {
    entry: "entry.1237607159", // Promoção exclusiva para usuários do Clube?
    options: {
      exclusiva_clube: "Sim, exclusiva para usuários do Clube do Buteco"
    }
  },
  {
    entry: "entry.204160588", // Conteúdo e participação
    options: {
      possui_logotipo: "Possui logotipo",
      possui_fotos_profissionais: "Possui fotos profissionais",
      deseja_visita_fotos: "Deseja receber visita para fotos",
      autoriza_fotos: "Autoriza fotos no estabelecimento",
      autoriza_video: "Autoriza gravação de vídeo",
      quer_contar_historia: "Gostaria de contar a história do bar",
      interesse_entrevista: "Interesse em entrevista",
      interesse_radio: "Interesse em ação de rádio",
      interesse_sorteio: "Interesse em sorteio",
      interesse_cachaca: "Interesse em ação com marca de cachaça"
    }
  },
  {
    entry: "entry.1202026566", // Confirmações (etapa 5)
    options: {
      confirma_verdadeiras: "Confirmo que as informações são verdadeiras.",
      autoriza_contato: "Autorizo o contato da equipe do O Seu Clube.",
      ciente_gratuito: "Estou ciente de que o cadastro é gratuito.",
      ciente_aprovacao: "Estou ciente de que a promoção deverá ser aprovada.",
      ciente_termo: "Estou ciente de que será necessário assinar um termo de compromisso.",
      compromisso_cumprir: "Comprometo-me a cumprir a promoção após sua publicação.",
      autoriza_dados: "Autorizo o tratamento dos dados para análise do credenciamento.",
      declara_regras_alcool: "Declaro que o estabelecimento cumpre as regras aplicáveis à comercialização de bebidas alcoólicas."
    }
  }
];

// Monta os parâmetros no formato que o Google Forms espera
// (application/x-www-form-urlencoded, com entry.ID repetido para
// cada opção marcada em perguntas de caixas de seleção).
function buildGoogleFormParams(payload) {
  const params = new URLSearchParams();

  Object.entries(GOOGLE_FORM_FIELD_MAP).forEach(([field, entry]) => {
    if (payload[field]) params.append(entry, payload[field]);
  });

  GOOGLE_FORM_CHECKBOX_GROUPS.forEach((group) => {
    Object.entries(group.options).forEach(([field, label]) => {
      if (payload[field]) params.append(group.entry, label);
    });
  });

  return params;
}

// Envia o cadastro para o Google Forms em segundo plano. Como a
// requisição usa mode "no-cors" (obrigatório para o domínio do Forms),
// não é possível ler a resposta — o envio é "silencioso" por natureza.
async function submitToGoogleForm(payload) {
  if (!CONFIG.GOOGLE_FORM_ACTION_URL) return;
  const params = buildGoogleFormParams(payload);
  await fetch(CONFIG.GOOGLE_FORM_ACTION_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });
}

/* ============================================================
   3. APLICAR CONFIGURAÇÃO NA PÁGINA
   ============================================================ */
function applyConfig() {
  // Datas da campanha
  $("#campaign-start-date").textContent = formatDatePt(CONFIG.CAMPAIGN_START_DATE);
  $("#campaign-end-date").textContent = formatDatePt(CONFIG.CAMPAIGN_END_DATE);
  $("#campaign-duration").textContent = `${daysBetween(CONFIG.CAMPAIGN_START_DATE, CONFIG.CAMPAIGN_END_DATE)} dias`;

  // WhatsApp flutuante e botão da tela de sucesso
  const waNumber = CONFIG.WHATSAPP_NUMBER.replace(/\D/g, "");
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(CONFIG.WHATSAPP_MESSAGE)}`
    : "#";
  const waFloat = $("#whatsapp-float");
  const waSuccess = $("#success-whatsapp-btn");
  if (waFloat) waFloat.href = waLink;
  if (waSuccess) waSuccess.href = waLink;
  if (!waNumber) {
    if (waFloat) waFloat.setAttribute("aria-disabled", "true");
  }

  // Influenciador
  if (CONFIG.INFLUENCER.active) {
    $("#influencer-name").textContent = CONFIG.INFLUENCER.name || "Influenciador em definição";
    $("#influencer-role").textContent = CONFIG.INFLUENCER.role;
    $("#influencer-bio").textContent = CONFIG.INFLUENCER.bio || "";
    $("#influencer-photo").src = CONFIG.INFLUENCER.photo;
    if (CONFIG.INFLUENCER.instagram) {
      $("#influencer-instagram").textContent = CONFIG.INFLUENCER.instagram;
    }
    if (CONFIG.INFLUENCER.videoUrl) {
      const btn = $("#influencer-video-btn");
      btn.hidden = false;
      btn.addEventListener("click", () => window.open(CONFIG.INFLUENCER.videoUrl, "_blank", "noopener"));
    }
  }

  // Especialista
  if (CONFIG.SPECIALIST.active) {
    $("#specialist-name").textContent = CONFIG.SPECIALIST.name || "Especialista em definição";
    $("#specialist-role").textContent = CONFIG.SPECIALIST.role;
    $("#specialist-bio").textContent = CONFIG.SPECIALIST.bio || "";
    $("#specialist-photo").src = CONFIG.SPECIALIST.photo;
    if (CONFIG.SPECIALIST.instagram) {
      $("#specialist-social").textContent = CONFIG.SPECIALIST.instagram;
    }
  }

  // Cachaça oficial / patrocinador
  const sponsorSection = $("#sponsor-section");
  if (!CONFIG.SPONSOR.showSection) {
    sponsorSection.hidden = true;
  } else if (CONFIG.SPONSOR.confirmed && CONFIG.SPONSOR.name) {
    $("#sponsor-name").textContent = CONFIG.SPONSOR.name;
  }

  // Ano do rodapé
  $("#footer-year").textContent = new Date().getFullYear();
}

/* ============================================================
   4. ÍCONES (Lucide)
   ============================================================ */
function initIcons() {
  if (window.lucide) window.lucide.createIcons();
}

/* ============================================================
   5. MÁSCARAS DE CAMPOS
   ============================================================ */
function maskPhone(value) {
  let v = value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 10) {
    return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim().replace(/-$/, "");
  } else if (v.length > 5) {
    return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim().replace(/-$/, "");
  } else if (v.length > 2) {
    return v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  } else if (v.length > 0) {
    return v.replace(/(\d{0,2})/, "($1");
  }
  return v;
}

function maskCEP(value) {
  return value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d{0,3})/, "$1-$2").replace(/-$/, "");
}

function maskCNPJ(value) {
  return value.replace(/\D/g, "").slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function initMasks() {
  const whatsapp = $("#whatsapp");
  const telefone = $("#telefone");
  const cep = $("#cep");
  const cnpj = $("#cnpj");

  if (whatsapp) whatsapp.addEventListener("input", (e) => { e.target.value = maskPhone(e.target.value); });
  if (telefone) telefone.addEventListener("input", (e) => { e.target.value = maskPhone(e.target.value); });
  if (cep) cep.addEventListener("input", (e) => { e.target.value = maskCEP(e.target.value); });
  if (cnpj) cnpj.addEventListener("input", (e) => { e.target.value = maskCNPJ(e.target.value); });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* ============================================================
   6. FORMULÁRIO MULTI-ETAPAS
   ============================================================ */
const FORM_STORAGE_KEY = "clubeDoButeco_formData";
const FORM_SENT_KEY = "clubeDoButeco_formSent";

const FormWizard = {
  currentStep: 1,
  totalSteps: 5,
  form: null,

  init() {
    this.form = $("#credenciamento-form");
    if (!this.form) return;

    this.restoreFromStorage();
    this.bindNav();
    this.bindAutoSave();
    this.bindPromoChips();
    this.bindUpload();
    this.bindSubmit();
    this.renderStep();
  },

  bindNav() {
    $("#btn-next").addEventListener("click", () => this.next());
    $("#btn-prev").addEventListener("click", () => this.prev());
  },

  next() {
    if (!this.validateStep(this.currentStep)) return;
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.renderStep();
    }
  },

  prev() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.renderStep();
    }
  },

  goToStep(step) {
    this.currentStep = step;
    this.renderStep();
  },

  renderStep() {
    $all(".form-step", this.form).forEach((step) => {
      step.hidden = Number(step.dataset.step) !== this.currentStep;
    });

    $("#btn-prev").hidden = this.currentStep === 1;
    $("#btn-next").hidden = this.currentStep === this.totalSteps;
    $("#btn-submit").hidden = this.currentStep !== this.totalSteps;

    const pct = (this.currentStep / this.totalSteps) * 100;
    $("#form-progress-bar").style.setProperty("--pct", pct + "%");
    $("#form-progress").setAttribute("aria-valuenow", this.currentStep);

    $all(".form-progress-steps li").forEach((li) => {
      const step = Number(li.dataset.step);
      li.classList.toggle("active", step === this.currentStep);
      li.classList.toggle("done", step < this.currentStep);
    });

    const panel = $(`.form-step[data-step="${this.currentStep}"]`, this.form);
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  },

  validateStep(step) {
    const panel = $(`.form-step[data-step="${step}"]`, this.form);
    if (!panel) return true;
    let valid = true;

    $all("[required]", panel).forEach((field) => {
      field.setCustomValidity("");
      if (field.type === "checkbox" && !field.checked) {
        valid = false;
      } else if (field.type !== "checkbox" && !field.value.trim()) {
        valid = false;
        field.reportValidity();
      }
    });

    const email = $("#email", panel);
    if (email && email.value && !isValidEmail(email.value)) {
      $("#error-email").textContent = "Digite um e-mail válido.";
      valid = false;
    } else if (email) {
      $("#error-email").textContent = "";
    }

    if (step === 5) {
      const missing = $all("[required]", panel).filter((f) => f.type === "checkbox" && !f.checked);
      $("#error-checks").textContent = missing.length
        ? "Confirme todos os itens obrigatórios para continuar."
        : "";
      if (missing.length) valid = false;
    }

    return valid;
  },

  bindAutoSave() {
    this.form.addEventListener("input", () => this.saveToStorage());
    this.form.addEventListener("change", () => this.saveToStorage());
  },

  saveToStorage() {
    try {
      const data = this.serializeForm(false);
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* localStorage indisponível - ignora silenciosamente */ }
  },

  restoreFromStorage() {
    try {
      const raw = localStorage.getItem(FORM_STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      Object.entries(data).forEach(([name, value]) => {
        const fields = this.form.querySelectorAll(`[name="${CSS.escape(name)}"]`);
        fields.forEach((field) => {
          if (field.type === "checkbox" || field.type === "radio") {
            if (Array.isArray(value) ? value.includes(field.value) : field.value === value) {
              field.checked = true;
            }
          } else if (field.type !== "file") {
            field.value = value;
          }
        });
      });
    } catch (e) { /* dados corrompidos - ignora */ }
  },

  clearStorage() {
    localStorage.removeItem(FORM_STORAGE_KEY);
  },

  bindPromoChips() {
    $all(".chip", this.form).forEach((chip) => {
      chip.addEventListener("click", () => {
        const isOutline = chip.classList.contains("chip-outline");
        $("#nome_promocao").value = isOutline ? "" : chip.textContent.trim();
        $("#nome_promocao").focus();
        $all(".chip", this.form).forEach((c) => c.classList.remove("selected"));
        chip.classList.add("selected");
        this.saveToStorage();
      });
    });
  },

  bindUpload() {
    const input = $("#upload_arquivos");
    if (!input) return;
    const preview = $("#upload-preview");
    const MAX_SIZE = 20 * 1024 * 1024; // 20MB

    input.addEventListener("change", () => {
      preview.innerHTML = "";
      Array.from(input.files).forEach((file) => {
        if (file.size > MAX_SIZE) {
          const warn = document.createElement("span");
          warn.className = "file-chip";
          warn.textContent = `${file.name} — arquivo maior que 20MB`;
          preview.appendChild(warn);
          return;
        }
        if (file.type.startsWith("image/")) {
          const img = document.createElement("img");
          img.src = URL.createObjectURL(file);
          img.alt = file.name;
          preview.appendChild(img);
        } else {
          const chip = document.createElement("span");
          chip.className = "file-chip";
          chip.textContent = file.name;
          preview.appendChild(chip);
        }
      });
    });
  },

  serializeForm(includeFiles) {
    const data = {};
    Array.from(this.form.elements).forEach((field) => {
      if (!field.name) return;
      if (field.type === "file") {
        if (includeFiles) data[field.name] = Array.from(field.files || []).map((f) => f.name);
        return;
      }
      if (field.type === "checkbox") {
        data[field.name] = field.checked;
        return;
      }
      if (field.type === "radio") {
        if (field.checked) data[field.name] = field.value;
        return;
      }
      data[field.name] = field.value;
    });
    return data;
  },

  bindSubmit() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  },

  // Monta um resumo legível do cadastro para enviar pelo WhatsApp.
  buildWhatsAppSummary(payload) {
    const linhas = [
      "Novo cadastro — Clube do Buteco",
      "",
      `Estabelecimento: ${payload.nome_estabelecimento || "-"}`,
      `Tipo: ${payload.tipo_estabelecimento || "-"}`,
      `Proprietário: ${payload.nome_proprietario || "-"}`,
      `Responsável pelo cadastro: ${payload.nome_responsavel || "-"}`,
      `WhatsApp: ${payload.whatsapp || "-"}`,
      `E-mail: ${payload.email || "-"}`,
      `Instagram: ${payload.instagram || "-"}`,
      `Endereço: ${payload.endereco || "-"}, ${payload.bairro || "-"}, ${payload.cidade || "-"}`,
      "",
      `Status da promoção: ${payload.status_promocao || "-"}`,
      `Promoção: ${payload.nome_promocao || "-"}`,
      `Descrição: ${payload.descricao_promocao || "-"}`,
      "",
      "Enviado pelo formulário do site."
    ];
    return linhas.join("\n");
  },

  // Abre o WhatsApp com o resumo do cadastro pronto para envio.
  openWhatsAppWithSummary(payload) {
    const number = CONFIG.WHATSAPP_NUMBER.replace(/\D/g, "");
    if (!number) return;
    const text = this.buildWhatsAppSummary(payload);
    const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  },

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateStep(5)) return;

    // Prevenção de envio duplicado
    if (sessionStorage.getItem(FORM_SENT_KEY) === "true") {
      this.showSuccess();
      return;
    }

    const submitBtn = $("#btn-submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    const payload = {
      ...this.serializeForm(true),
      utms: getUTMParams(),
      enviado_em: new Date().toISOString(),
      pagina: window.location.href
    };

    try {
      let salvouEmAlgumLugar = false;

      if (CONFIG.GOOGLE_FORM_ACTION_URL) {
        await submitToGoogleForm(payload);
        salvouEmAlgumLugar = true;
      }

      if (CONFIG.WEBHOOK_URL) {
        await fetch(CONFIG.WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        salvouEmAlgumLugar = true;
      }

      if (!salvouEmAlgumLugar) {
        // MODO DEMONSTRAÇÃO — sem Google Forms nem webhook configurados
        console.log("Clube do Buteco — modo demonstração. JSON do cadastro:", payload);
      }

      if (CONFIG.SEND_TO_WHATSAPP_ON_SUBMIT && CONFIG.WHATSAPP_NUMBER) {
        this.openWhatsAppWithSummary(payload);
      }

      sessionStorage.setItem(FORM_SENT_KEY, "true");
      this.clearStorage();
      this.showSuccess();
    } catch (err) {
      console.error("Erro ao enviar cadastro:", err);
      submitBtn.disabled = false;
      submitBtn.textContent = "Quero fazer parte do Clube do Buteco";
      alert("Não foi possível enviar o cadastro agora. Tente novamente em instantes ou fale conosco pelo WhatsApp.");
    }
  },

  showSuccess() {
    this.form.hidden = true;
    $("#form-progress").hidden = true;
    $("#success-panel").hidden = false;

    const note = $("#whatsapp-redirect-note");
    if (note) {
      note.hidden = !(CONFIG.SEND_TO_WHATSAPP_ON_SUBMIT && CONFIG.WHATSAPP_NUMBER);
    }

    $("#success-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

/* ============================================================
   7. CRIADOR DE PROMOÇÃO (ferramenta interativa)
   ============================================================ */
const PromoBuilder = {
  objetivo: null,
  vantagem: null,

  suggestions: {
    "Aumentar o movimento": ["Boteco Aberto", "Hora do Balcão", "Conta Amiga"],
    "Divulgar um prato": ["Capricho da Cozinha", "Dobradinha", "Belisco da Casa"],
    "Atrair grupos": ["Mesa Marcada", "Casa Cheia", "Dupla de Ataque"],
    "Movimentar horário específico": ["Hora do Balcão", "Boteco Aberto", "Primeiro Brinde"],
    "Aumentar o ticket médio": ["Balde no Gelo", "Mesa Marcada", "Fechou a Conta"],
    "Conquistar novos clientes": ["Primeiro Brinde", "Vale o Brinde", "Belisco da Casa"],
    "Incentivar o retorno": ["Cliente da Casa", "Conta Amiga", "Destaque do Balcão"],
    "Divulgar drinks ou bebidas": ["Brinde do Barman", "Balde no Gelo", "Dupla de Ataque"]
  },

  init() {
    const builder = $("#promo-builder");
    if (!builder) return;

    $all(".chip-group", builder).forEach((group) => {
      $all(".chip", group).forEach((chip) => {
        chip.addEventListener("click", () => {
          $all(".chip", group).forEach((c) => c.classList.remove("selected"));
          chip.classList.add("selected");
          const field = group.dataset.field;
          this[field] = chip.textContent.trim();
          this.renderResult();
        });
      });
    });

    $("#btn-promo-help").addEventListener("click", () => {
      const radio = $('input[name="status_promocao"][value="Preciso de ajuda"]');
      const formSection = $("#formulario");
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
      if (radio) {
        setTimeout(() => {
          radio.checked = true;
          FormWizard.goToStep(3);
        }, 400);
      }
    });
  },

  renderResult() {
    const resultBox = $("#builder-result");
    const list = $("#builder-suggestions");
    if (!this.objetivo) return;

    const base = this.suggestions[this.objetivo] || [];
    list.innerHTML = "";
    base.forEach((name) => {
      const li = document.createElement("li");
      li.textContent = name;
      list.appendChild(li);
    });
    resultBox.hidden = false;
  }
};

/* ============================================================
   8. ACCORDION (FAQ)
   ============================================================ */
function initAccordion() {
  $all(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const panel = trigger.closest(".accordion-item").querySelector(".accordion-panel");
      trigger.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
    });
  });
}

/* ============================================================
   9. INICIALIZAÇÃO GERAL
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initIcons();
  initMasks();
  initAccordion();
  PromoBuilder.init();
  FormWizard.init();
  getUTMParams(); // captura e persiste UTMs assim que a página carrega
});
