// Calculadora Calórica - Nutri Track
// Função principal para calcular macronutrientes

document.addEventListener("DOMContentLoaded", function () {
  // Event listener para o formulário
  document
    .getElementById("calculatorForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      calcularMacronutrientes();
    });

  // Validação em tempo real
  document.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener("input", function () {
      const valor = parseFloat(this.value);
      if (this.id === "peso" && valor > 0 && valor < 50) {
        this.style.borderColor = "#dc2626";
      } else if (this.id === "altura" && valor > 0 && valor < 100) {
        this.style.borderColor = "#dc2626";
      } else if (this.id === "idade" && valor > 0 && valor < 10) {
        this.style.borderColor = "#dc2626";
      } else {
        this.style.borderColor = "#14532d";
      }
    });
  });
});

function mostrarErro(mensagem) {
  const divErro = document.getElementById("errorMessage");
  divErro.textContent = mensagem;
  divErro.style.display = "block";
  setTimeout(() => {
    divErro.style.display = "none";
  }, 5000);
}

function calcularMacronutrientes() {
  // Coletar dados do formulário
  const idade = parseInt(document.getElementById("idade").value);
  const peso = parseFloat(document.getElementById("peso").value);
  const altura = parseInt(document.getElementById("altura").value);
  const sexo = document.getElementById("sexo").value;
  const atividade = document.getElementById("atividade").value;
  const objetivo = document.getElementById("objetivo").value;

  // Validações
  if (!idade || !peso || !altura || !sexo || !atividade || !objetivo) {
    mostrarErro("Por favor, preencha todos os campos!");
    return;
  }

  if (peso <= 0 || altura <= 0 || idade <= 0) {
    mostrarErro("Por favor, insira valores válidos!");
    return;
  }

  // Calcular TMB (Taxa Metabólica Basal) usando a fórmula de Mifflin-St Jeor
  let tmb;
  if (sexo === "masculino") {
    tmb = 10 * peso + 6.25 * altura - 5 * idade + 5;
  } else {
    tmb = 10 * peso + 6.25 * altura - 5 * idade - 161;
  }

  // Fatores de atividade física
  const fatoresAtividade = {
    sedentario: 1.2,
    leve: 1.375,
    moderado: 1.55,
    ativo: 1.725,
    superativo: 1.9,
  };

  // Calcular TDEE (Total Daily Energy Expenditure)
  const tdee = tmb * fatoresAtividade[atividade];

  // Ajustar calorias baseado no objetivo
  let caloriasFinais;
  let infoCalorias;

  switch (objetivo) {
    case "perder":
      caloriasFinais = tdee - 500; // Déficit de 500 kcal para perder ~0.5kg/semana
      infoCalorias = `Déficit de 500 kcal para perda de peso (~0.5kg/semana)`;
      break;
    case "manter":
      caloriasFinais = tdee;
      infoCalorias = `Manutenção do peso atual`;
      break;
    case "ganhar":
      caloriasFinais = tdee + 500; // Superávit de 500 kcal para ganhar ~0.5kg/semana
      infoCalorias = `Superávit de 500 kcal para ganho de peso (~0.5kg/semana)`;
      break;
  }

  // Calcular macronutrientes
  // Proteínas: 1.6-2.2g por kg de peso corporal (usando 2g para atletas/objetivo de ganho)
  const proteinasPorKg = objetivo === "ganhar" ? 2.2 : 1.8;
  const proteinasGramas = Math.round(peso * proteinasPorKg);
  const proteinasKcal = proteinasGramas * 4;

  // Gorduras: 25-30% das calorias totais (usando 25%)
  const gordurasPercentual = 0.25;
  const gordurasKcal = Math.round(caloriasFinais * gordurasPercentual);
  const gordurasGramas = Math.round(gordurasKcal / 9);

  // Carboidratos: resto das calorias
  const carboidratosKcal = caloriasFinais - proteinasKcal - gordurasKcal;
  const carboidratosGramas = Math.round(carboidratosKcal / 4);

  // Salvar metas do usuário
  const metasUsuario = {
    calorias: Math.round(caloriasFinais),
    proteinas: proteinasGramas,
    carboidratos: carboidratosGramas,
    gorduras: gordurasGramas,
    calculadoEm: new Date().toISOString(),
  };

  // Salvar no localStorage usando a biblioteca de alimentos
  if (typeof NutriTrack !== "undefined") {
    NutriTrack.salvarMetasUsuario(metasUsuario);
  } else {
    localStorage.setItem("nutriTrack_goals", JSON.stringify(metasUsuario));
  }

  // Exibir resultados
  document.getElementById("totalCalories").textContent =
    Math.round(caloriasFinais) + " kcal";
  document.getElementById("calorieInfo").textContent = infoCalorias;

  document.getElementById("proteinas").textContent = proteinasGramas + "g";
  document.getElementById("proteinasKcal").textContent =
    proteinasKcal + " kcal";

  document.getElementById("carboidratos").textContent =
    carboidratosGramas + "g";
  document.getElementById("carboidratosKcal").textContent =
    carboidratosKcal + " kcal";

  document.getElementById("gorduras").textContent = gordurasGramas + "g";
  document.getElementById("gordurasKcal").textContent = gordurasKcal + " kcal";

  // Mostrar resultados
  document.getElementById("results").style.display = "block";
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}
