// URL do Google Apps Script configurado
const URL_WEB_APP_GSHEETS = "https://script.google.com/a/macros/seduc.ce.gov.br/s/AKfycbwrVxpNEN6GGRojHVvm2FCSvYk3AgUoOK_SeOqWIScIv5LVyMsA3LdXNmKPCGBWgRK9/exec";

/**
 * Envia os dados da rescisão para a planilha via Google Apps Script
 * @param {Object} payload Dados do cálculo (crede, matricula, nome, rubrica, tipoLancamento, valorTotal, observacao)
 */
function enviarRescisaoPlanilha(payload) {
    if (!URL_WEB_APP_GSHEETS || URL_WEB_APP_GSHEETS.includes("COLE_AQUI")) {
        alert("Erro: A URL do Apps Script não foi configurada corretamente.");
        return;
    }

    // Feedback visual simples ao clicar
    const botaoClicado = document.activeElement;
    let textoOriginal = "";
    if (botaoClicado && botaoClicado.tagName === "BUTTON") {
        textoOriginal = botaoClicado.innerHTML;
        botaoClicado.innerText = "Enviando...";
        botaoClicado.disabled = true;
    }

    fetch(URL_WEB_APP_GSHEETS, {
        method: "POST",
        mode: "no-cors", // Necessário para evitar bloqueios de CORS do Google Apps Script
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert(`Dados da Rubrica ${payload.rubrica} enviados para a planilha com sucesso!`);
    })
    .catch(error => {
        console.error("Erro ao enviar dados para a planilha:", error);
        alert("Ocorreu um erro ao tentar enviar os dados para a planilha.");
    })
    .finally(() => {
        if (botaoClicado && botaoClicado.tagName === "BUTTON") {
            botaoClicado.innerHTML = textoOriginal;
            botaoClicado.disabled = false;
        }
    });
}

/**
 * Utilitário para copiar texto de um elemento pelo ID
 * @param {string} containerId ID do elemento contendo o texto
 */
function copiarTexto(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const texto = el.innerText || el.textContent;

    navigator.clipboard.writeText(texto).then(() => {
        alert("Texto copiado para a área de transferência!");
    }).catch(err => {
        console.error("Erro ao copiar texto: ", err);
        // Fallback para navegadores mais antigos
        const areaTexto = document.createElement("textarea");
        areaTexto.value = texto;
        document.body.appendChild(areaTexto);
        areaTexto.select();
        document.execCommand("copy");
        document.body.removeChild(areaTexto);
        alert("Texto copiado para a área de transferência!");
    });
}

/**
 * Formata um número como moeda brasileira (R$)
 * @param {number} valor 
 * @returns {string} Valor formatado (ex: R$ 1.234,56)
 */
function formatarMoeda(valor) {
    return (valor || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

/**
 * Converte string de data no formato DD/MM/AAAA para objeto Date
 * @param {string} dataStr 
 * @returns {Date|null}
 */
function parseDataBR(dataStr) {
    if (!dataStr) return null;
    const partes = dataStr.split('/');
    if (partes.length !== 3) return null;

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Mês no JS vai de 0 a 11
    const ano = parseInt(partes[2], 10);

    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return null;

    return new Date(ano, mes, dia);
}