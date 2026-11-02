// ===== Navegação horizontal (sem scroll) =====
const track = document.getElementById("track");
const veil = document.getElementById("veil");
const TOTAL = 4;
let current = 0;
let veilTimer = null;
let veilArmed = true; // o aviso volta a aparecer sempre que se sai do chat

function setVeil(on, delay = 0) {
  clearTimeout(veilTimer);
  if (!on) {
    veil.classList.remove("show");
    veil.setAttribute("aria-hidden", "true");
    return;
  }
  veilTimer = setTimeout(() => {
    veil.classList.add("show");
    veil.setAttribute("aria-hidden", "false");
  }, delay);
}

function goTo(i) {
  const prev = current;
  current = Math.max(0, Math.min(TOTAL - 1, i));
  track.style.transform = `translateX(-${current * 100}vw)`;
  if (current === TOTAL - 1) {
    if (veilArmed) setVeil(true, prev === current ? 0 : 620);
  } else {
    veilArmed = true;
    setVeil(false);
  }
}
document.querySelectorAll("[data-next]").forEach((b) => b.addEventListener("click", () => goTo(current + 1)));
document.getElementById("btnInicio").addEventListener("click", () => goTo(0));

// "começar" do aviso: o vidro fosco se dissolve e o chat surge atrás dele
document.getElementById("btnVeil").addEventListener("click", () => {
  veilArmed = false;
  setVeil(false);
  setTimeout(() => input.focus(), 800);
});

// Bloqueia rolagem por mouse, touch e teclado (exceto dentro do chat)
window.addEventListener("wheel", (e) => { if (!e.target.closest(".messages")) e.preventDefault(); }, { passive: false });
window.addEventListener("touchmove", (e) => { if (!e.target.closest(".messages")) e.preventDefault(); }, { passive: false });
window.addEventListener("keydown", (e) => {
  if (["ArrowLeft", "ArrowRight", "PageDown", "PageUp", "Home", "End"].includes(e.key) && e.target.tagName !== "INPUT") e.preventDefault();
  if (e.key === " " && e.target.tagName !== "INPUT") e.preventDefault();
});
window.addEventListener("resize", () => goTo(current));

// ===== Base de informações =====
const INFO = {
  nome: "Felipe Alcaraz",
  idade: 17,
  cidade: "Campinas-SP",
  escola: "Colégio Raphael Di Santo",
  curso: "TI no segundo ano do Ensino Médio",
};

// ===== Respostas por palavras-chave =====
const INTENTS = [
  { k: ["oi", "ola", "eai", "e ai", "bom dia", "boa tarde", "boa noite", "hey", "salve", "opa", "hello"],
    r: ["Olá! 👋 Eu sou o assistente do Felipe. Pode perguntar o que quiser sobre ele: idade, estudos, interesses, objetivos...", "Oi! Que bom ter você aqui. O que gostaria de saber sobre o Felipe?"] },
  { k: ["tudo bem", "como vai", "como voce esta", "beleza", "suave"],
    r: ["Tudo ótimo por aqui! E com você? Fique à vontade para perguntar sobre o Felipe."] },
  { k: ["nome", "chama", "quem e voce", "quem e vc", "quem e o felipe", "se apresenta", "apresente", "apresentacao", "fale sobre voce", "fale sobre vc", "sobre voce", "sobre vc", "sobre mim", "quem e"],
    r: [`Meu nome é Felipe Alcaraz, tenho ${INFO.idade} anos, sou de ${INFO.cidade} e sou apaixonado por tecnologia, principalmente inteligência artificial. Estou cursando ${INFO.curso} no ${INFO.escola}.`] },
  { k: ["idade", "anos", "quantos anos", "velho", "nasceu", "nascimento"],
    r: [`Tenho ${INFO.idade} anos.`, `O Felipe tem ${INFO.idade} anos — jovem, mas com muita vontade de aprender!`] },
  { k: ["cidade", "mora", "onde voce", "de onde", "regiao", "estado", "campinas", "sp", "localizacao", "endereco", "reside"],
    r: [`Sou de ${INFO.cidade}. 📍`, `Moro em ${INFO.cidade}, o que facilita estágios na região de Campinas.`] },
  { k: ["estuda", "estudo", "escola", "colegio", "curso", "cursando", "ensino medio", "serie", "ano", "formacao", "escolaridade", "faculdade", "tecnico", "raphael"],
    r: [`Estou cursando ${INFO.curso}, no ${INFO.escola}.`] },
  { k: ["estagio", "vaga", "emprego", "trabalho", "trabalhar", "contratar", "contrato", "oportunidade", "jovem aprendiz", "procurando", "busca", "buscando"],
    r: ["Estou em busca de uma vaga de estágio na área de TI para aprimorar meus conhecimentos e colocar em prática tudo o que venho aprendendo. Tenho muita disposição, criatividade e vontade de crescer!"] },
  { k: ["por que", "porque", "pq", "motivo", "contratar voce", "contratar vc", "diferencial", "escolher voce", "vantagem"],
    r: ["Porque sou curioso, criativo e aprendo rápido. Tenho paixão real por tecnologia — principalmente IA — e estou sempre buscando evoluir. Encaro desafios como oportunidades de aprender."] },
  { k: ["inteligencia artificial", " ia", "ia ", "ias", "ai", "chatgpt", "gpt", "claude", "openai", "machine learning", "aprendizado de maquina", "llm", "prompt"],
    r: ["A inteligência artificial é a parte da tecnologia que mais me encanta! 🤖 Uso ferramentas como ChatGPT e Claude no dia a dia e acompanho de perto a evolução da área.", "IA é minha maior paixão na tecnologia. Acho incrível como ela está transformando a forma de criar, estudar e trabalhar."] },
  { k: ["programacao", "programar", "programa", "codigo", "code", "linguagem", "html", "css", "javascript", "js", "python", "java", "desenvolvedor", "dev", "front", "back", "site", "web"],
    r: ["Tenho muito interesse em programação! Estou aprendendo no curso de TI e praticando por conta própria — inclusive este site foi feito com HTML, CSS e JavaScript. 💻"] },
  { k: ["jogo", "jogos", "game", "games", "gamer", "joga", "jogar", "online", "videogame"],
    r: ["Curto muito jogos online! 🎮 Além da diversão, eles despertaram minha curiosidade sobre como a tecnologia por trás funciona."] },
  { k: ["design", "designer", "criativo", "criatividade", "arte", "visual", "figma", "photoshop", "ui", "ux", "3d"],
    r: ["Tenho muita criatividade e gosto bastante de design! 🎨 Adoro pensar no visual e na experiência das coisas — como você pode ver neste portfólio."] },
  { k: ["gosta", "gosto", "interesse", "interesses", "hobby", "hobbies", "tempo livre", "lazer", "curte", "paixao", "apaixonado"],
    r: ["Gosto muito de tecnologia: inteligência artificial, programação, jogos online, design e muito mais. A parte que mais me encanta é a IA!"] },
  { k: ["tecnologia", "ti", "informatica", "computador", "computacao", "area"],
    r: ["Sou apaixonado por tecnologia! Me interesso por IA, programação, design e jogos — e quero construir minha carreira em TI."] },
  { k: ["qualidade", "qualidades", "ponto forte", "pontos fortes", "habilidade", "habilidades", "skills", "competencia", "soft skill"],
    r: ["Meus pontos fortes: criatividade, curiosidade, facilidade para aprender coisas novas e paixão por tecnologia. Também sou dedicado e gosto de trabalhar em equipe."] },
  { k: ["defeito", "defeitos", "ponto fraco", "pontos fracos", "melhorar", "dificuldade"],
    r: ["Como ainda estou no começo da carreira, minha experiência profissional é pequena — e é exatamente por isso que busco um estágio: para aprender e evoluir rápido na prática."] },
  { k: ["experiencia", "experiencias", "ja trabalhou", "projetos", "projeto", "portfolio", "fez"],
    r: ["Ainda não tive um emprego formal, mas desenvolvo projetos pessoais e escolares — como este portfólio interativo. Estou pronto para a minha primeira experiência profissional!"] },
  { k: ["objetivo", "objetivos", "futuro", "sonho", "planos", "meta", "metas", "carreira", "daqui", "pretende", "quer ser"],
    r: ["Meu objetivo é crescer na área de TI, me especializar em inteligência artificial e sempre olhar para o futuro. 🚀 O estágio é o primeiro passo dessa jornada."] },
  { k: ["horario", "disponibilidade", "disponivel", "periodo", "turno", "quando pode", "comecar", "inicio"],
    r: ["Tenho disponibilidade no período contrário ao da escola. Podemos conversar sobre os horários ideais para a vaga!"] },
  { k: ["contato", "email", "e-mail", "telefone", "whatsapp", "zap", "linkedin", "instagram", "falar com", "conversar", "entrevista"],
    r: ["Para falar comigo, é só me chamar no WhatsApp: +55 (19) 99860-54766, ou clicar no botão “contato” no canto superior direito! Vou adorar conversar sobre uma oportunidade. 😊"] },
  { k: ["ingles", "idioma", "idiomas", "lingua", "espanhol"],
    r: ["Estou sempre estudando inglês, principalmente porque a maior parte do conteúdo de tecnologia e IA está nesse idioma."] },
  { k: ["equipe", "time", "grupo", "trabalho em equipe", "comunicacao", "comunicativo"],
    r: ["Gosto de trabalhar em equipe! Acredito que trocar ideias deixa qualquer projeto mais criativo e completo."] },
  { k: ["aprender", "aprendizado", "estudar", "aprende"],
    r: ["Aprender é o que eu mais gosto de fazer! Estudo pela escola, por cursos online e testando coisas na prática."] },
  { k: ["salario", "remuneracao", "bolsa", "quanto quer", "pretensao"],
    r: ["Meu foco agora é aprender e ganhar experiência. Estou aberto a conversar sobre a bolsa conforme a política da empresa."] },
  { k: ["obrigado", "obrigada", "valeu", "vlw", "agradeco", "thanks"],
    r: ["Eu que agradeço pelo interesse! 💚 Se tiver mais dúvidas, é só perguntar.", "Por nada! Espero que possamos trabalhar juntos."] },
  { k: ["tchau", "ate mais", "adeus", "falou", "flw", "ate logo"],
    r: ["Até mais! Obrigado pela visita. 👋"] },
];

const FALLBACK = "Desculpe, com isso eu não consigo ajudar. 😅 Tente perguntar sobre minha idade, estudos, interesses, objetivos ou a vaga de estágio.";

function normalize(t) {
  return " " + t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim() + " ";
}

function answer(text) {
  const q = normalize(text);
  let best = null, score = 0;
  for (const intent of INTENTS) {
    let s = 0;
    for (const kw of intent.k) {
      const k = normalize(kw).trim();
      const hit = k.includes(" ") ? q.includes(" " + k + " ") || q.includes(k) : q.includes(" " + k + " ");
      if (hit) s += k.length;
    }
    if (s > score) { score = s; best = intent; }
  }
  if (!best) return FALLBACK;
  return best.r[Math.floor(Math.random() * best.r.length)];
}

// ===== Chat =====
const messages = document.getElementById("messages");
const form = document.getElementById("composer");
const input = document.getElementById("question");

function addMsg(text, who) {
  const el = document.createElement("div");
  el.className = `msg ${who}`;
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
  return el;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addMsg(text, "user");
  input.value = "";
  const typing = document.createElement("div");
  typing.className = "msg bot typing";
  typing.innerHTML = "<span></span><span></span><span></span>";
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;
  setTimeout(() => { typing.remove(); addMsg(answer(text), "bot"); input.focus(); }, 700 + Math.random() * 500);
});

const WHATSAPP = "5519986054766";
const WHATSAPP_LABEL = "+55 (19) 99860-54766";

document.getElementById("btnContato").addEventListener("click", () => {
  addMsg(`Quer falar comigo? É só me chamar no WhatsApp: ${WHATSAPP_LABEL} 📱`, "bot");
  window.open(`https://wa.me/${WHATSAPP}`, "_blank", "noopener");
});

