// Biblioteca de Alimentos e Sistema de Refeições - Nutri Track

// Armazenamento local para alimentos e refeições
const CHAVE_ARMAZENAMENTO_ALIMENTOS = "nutriTrack_foods";
const CHAVE_ARMAZENAMENTO_REFEICOES = "nutriTrack_meals";
const CHAVE_ARMAZENAMENTO_METAS = "nutriTrack_goals";

// Função para obter alimentos do localStorage
function obterAlimentos() {
  const alimentos = localStorage.getItem(CHAVE_ARMAZENAMENTO_ALIMENTOS);
  return alimentos ? JSON.parse(alimentos) : [];
}

// Função para salvar alimentos no localStorage
function salvarAlimentos(alimentos) {
  localStorage.setItem(
    CHAVE_ARMAZENAMENTO_ALIMENTOS,
    JSON.stringify(alimentos)
  );
}

// Função para obter refeições do localStorage
function obterRefeicoes() {
  const refeicoes = localStorage.getItem(CHAVE_ARMAZENAMENTO_REFEICOES);
  return refeicoes ? JSON.parse(refeicoes) : [];
}

// Função para salvar refeições no localStorage
function salvarRefeicoes(refeicoes) {
  localStorage.setItem(
    CHAVE_ARMAZENAMENTO_REFEICOES,
    JSON.stringify(refeicoes)
  );
}

// Função para obter metas do usuário
function obterMetasUsuario() {
  const metas = localStorage.getItem(CHAVE_ARMAZENAMENTO_METAS);
  return metas ? JSON.parse(metas) : null;
}

// Função para salvar metas do usuário
function salvarMetasUsuario(metas) {
  localStorage.setItem(CHAVE_ARMAZENAMENTO_METAS, JSON.stringify(metas));
}

// Adicionar alimento à biblioteca
function adicionarAlimento(
  nome,
  caloriasPorGrama,
  proteinasPorGrama,
  carboidratosPorGrama,
  gordurasPorGrama
) {
  const alimentos = obterAlimentos();
  const novoAlimento = {
    id: Date.now(),
    nome: nome,
    caloriasPorGrama: parseFloat(caloriasPorGrama),
    proteinasPorGrama: parseFloat(proteinasPorGrama),
    carboidratosPorGrama: parseFloat(carboidratosPorGrama),
    gordurasPorGrama: parseFloat(gordurasPorGrama),
    criadoEm: new Date().toISOString(),
  };

  alimentos.push(novoAlimento);
  salvarAlimentos(alimentos);
  return novoAlimento;
}

// Obter todos os alimentos
function obterTodosAlimentos() {
  return obterAlimentos();
}

// Apagar alimento por ID
function apagarAlimento(id) {
  const alimentos = obterAlimentos();
  const indice = alimentos.findIndex((alimento) => alimento.id === id);

  if (indice === -1) {
    return false; // Alimento não encontrado
  }

  // Remover o alimento
  alimentos.splice(indice, 1);
  salvarAlimentos(alimentos);

  // Também remover refeições que usam este alimento
  const refeicoes = obterRefeicoes();
  const refeicoesFiltradas = refeicoes.filter(
    (refeicao) => refeicao.idAlimento !== id
  );
  salvarRefeicoes(refeicoesFiltradas);

  return true; // Alimento removido com sucesso
}

// Buscar alimento por nome
function buscarAlimento(consulta) {
  const alimentos = obterAlimentos();
  return alimentos.filter((alimento) =>
    alimento.nome.toLowerCase().includes(consulta.toLowerCase())
  );
}

// Adicionar refeição
function adicionarRefeicao(idAlimento, quantidade, tipoRefeicao = "refeição") {
  const alimentos = obterAlimentos();
  const alimento = alimentos.find((a) => a.id === idAlimento);

  if (!alimento) return null;

  const refeicoes = obterRefeicoes();
  const hoje = new Date().toDateString();

  const refeicao = {
    id: Date.now(),
    idAlimento: idAlimento,
    nomeAlimento: alimento.nome,
    quantidade: parseFloat(quantidade),
    tipoRefeicao: tipoRefeicao,
    calorias: alimento.caloriasPorGrama * quantidade,
    proteinas: alimento.proteinasPorGrama * quantidade,
    carboidratos: alimento.carboidratosPorGrama * quantidade,
    gorduras: alimento.gordurasPorGrama * quantidade,
    data: hoje,
    criadoEm: new Date().toISOString(),
  };

  refeicoes.push(refeicao);
  salvarRefeicoes(refeicoes);
  return refeicao;
}

// Obter refeições do dia
function obterRefeicoesHoje() {
  const refeicoes = obterRefeicoes();
  const hoje = new Date().toDateString();
  return refeicoes.filter((refeicao) => refeicao.data === hoje);
}

// Calcular totais do dia
function calcularTotaisHoje() {
  const refeicoesHoje = obterRefeicoesHoje();
  return refeicoesHoje.reduce(
    (totais, refeicao) => {
      totais.calorias += refeicao.calorias;
      totais.proteinas += refeicao.proteinas;
      totais.carboidratos += refeicao.carboidratos;
      totais.gorduras += refeicao.gorduras;
      return totais;
    },
    { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 }
  );
}

// Calcular progresso das metas
function calcularProgresso() {
  const metas = obterMetasUsuario();
  const totaisHoje = calcularTotaisHoje();

  if (!metas) return null;

  return {
    calorias: {
      consumido: totaisHoje.calorias,
      meta: metas.calorias,
      percentual: Math.round((totaisHoje.calorias / metas.calorias) * 100),
    },
    proteinas: {
      consumido: totaisHoje.proteinas,
      meta: metas.proteinas,
      percentual: Math.round((totaisHoje.proteinas / metas.proteinas) * 100),
    },
    carboidratos: {
      consumido: totaisHoje.carboidratos,
      meta: metas.carboidratos,
      percentual: Math.round(
        (totaisHoje.carboidratos / metas.carboidratos) * 100
      ),
    },
    gorduras: {
      consumido: totaisHoje.gorduras,
      meta: metas.gorduras,
      percentual: Math.round((totaisHoje.gorduras / metas.gorduras) * 100),
    },
  };
}

// Inicializar dados de exemplo se não existirem
function inicializarDadosExemplo() {
  if (obterAlimentos().length === 0) {
    const alimentosExemplo = [
      {
        nome: "Arroz Branco",
        caloriasPorGrama: 1.3,
        proteinasPorGrama: 0.025,
        carboidratosPorGrama: 0.28,
        gordurasPorGrama: 0.003,
      },
      {
        nome: "Frango Grelhado",
        caloriasPorGrama: 1.65,
        proteinasPorGrama: 0.31,
        carboidratosPorGrama: 0,
        gordurasPorGrama: 0.036,
      },
      {
        nome: "Batata Doce",
        caloriasPorGrama: 0.86,
        proteinasPorGrama: 0.016,
        carboidratosPorGrama: 0.2,
        gordurasPorGrama: 0.001,
      },
      {
        nome: "Ovo",
        caloriasPorGrama: 1.55,
        proteinasPorGrama: 0.13,
        carboidratosPorGrama: 0.011,
        gordurasPorGrama: 0.11,
      },
      {
        nome: "Aveia",
        caloriasPorGrama: 3.89,
        proteinasPorGrama: 0.17,
        carboidratosPorGrama: 0.66,
        gordurasPorGrama: 0.07,
      },
      {
        nome: "Banana",
        caloriasPorGrama: 0.89,
        proteinasPorGrama: 0.011,
        carboidratosPorGrama: 0.23,
        gordurasPorGrama: 0.003,
      },
      {
        nome: "Leite Desnatado",
        caloriasPorGrama: 0.34,
        proteinasPorGrama: 0.034,
        carboidratosPorGrama: 0.05,
        gordurasPorGrama: 0.001,
      },
      {
        nome: "Pão Integral",
        caloriasPorGrama: 2.47,
        proteinasPorGrama: 0.13,
        carboidratosPorGrama: 0.41,
        gordurasPorGrama: 0.04,
      },
    ];

    alimentosExemplo.forEach((alimento) => {
      adicionarAlimento(
        alimento.nome,
        alimento.caloriasPorGrama,
        alimento.proteinasPorGrama,
        alimento.carboidratosPorGrama,
        alimento.gordurasPorGrama
      );
    });
  }
}

// Exportar funções para uso global
window.NutriTrack = {
  adicionarAlimento,
  obterTodosAlimentos,
  apagarAlimento,
  buscarAlimento,
  adicionarRefeicao,
  obterRefeicoesHoje,
  calcularTotaisHoje,
  calcularProgresso,
  obterMetasUsuario,
  salvarMetasUsuario,
  inicializarDadosExemplo,
};
