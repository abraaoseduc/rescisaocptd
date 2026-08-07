// Substitua a string abaixo pela NOVA URL obtida na implantação do Apps Script
const URL_WEB_APP_GSHEETS = "https://script.google.com/a/macros/seduc.ce.gov.br/s/AKfycbyQIiJP3ooupBeaLM12YgKfZsVb4tHDr7pQcPTPC587d3bHRGhfCGJ-cbJNBL-yWLp0/exec";

/**
 * Envia os dados da rescisão para a planilha do Google via formulário em iframe oculto.
 * @param {Object} payload Objeto com os dados a serem gravados
 */
function enviarRescisaoPlanilha(payload) {
    if (!URL_WEB_APP_GSHEETS || URL_WEB_APP_GSHEETS.includes("COLE_AQUI")) {
        alert("Erro: A URL do Apps Script não foi configurada no arquivo util.js.");
        return;
    }

    // Garante a existência do iframe invisível na página
    let iframe = document.getElementById("hidden_iframe_gsheet");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "hidden_iframe_gsheet";
        iframe.name = "hidden_iframe_gsheet";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
    }

    // Feedback visual para o botão ativo
    const botaoClicado = document.activeElement;
    let textoOriginal = "";
    if (botaoClicado && botaoClicado.tagName === "BUTTON") {
        textoOriginal = botaoClicado.innerHTML;
        botaoClicado.innerText = "Enviando...";
        botaoClicado.disabled = true;
    }

    // Monta o formulário de envio assíncrono direcionado ao iframe
    const form = document.createElement("form");
    form.method = "POST";
    form.action = URL_WEB_APP_GSHEETS;
    form.target = "hidden_iframe_gsheet";

    const inputData = document.createElement("input");
    inputData.type = "hidden";
    inputData.name = "postData";
    inputData.value = JSON.stringify(payload);
    form.appendChild(inputData);

    document.body.appendChild(form);

    try {
        form.submit();
        setTimeout(() => {
            alert(`Dados da Rubrica ${payload.rubrica || ''} enviados para a planilha!`);
            if (botaoClicado && botaoClicado.tagName === "BUTTON") {
                botaoClicado.innerHTML = textoOriginal;
                botaoClicado.disabled = false;
            }
        }, 1200);
    } catch (e) {
        console.error("Erro ao submeter dados:", e);
        alert("Falha ao tentar enviar os dados para a planilha.");
        if (botaoClicado && botaoClicado.tagName === "BUTTON") {
            botaoClicado.innerHTML = textoOriginal;
            botaoClicado.disabled = false;
        }
    } finally {
        document.body.removeChild(form);
    }
}

/**
 * Copia o texto contido em um elemento HTML para a área de transferência
 * @param {string} containerId ID do elemento que contém o texto
 */
function copiarTexto(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const texto = el.innerText || el.textContent;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(() => {
            alert("Texto copiado com sucesso!");
        }).catch(err => {
            fallbackCopiarTexto(texto);
        });
    } else {
        fallbackCopiarTexto(texto);
    }
}

function fallbackCopiarTexto(texto) {
    const areaTexto = document.createElement("textarea");
    areaTexto.value = texto;
    document.body.appendChild(areaTexto);
    areaTexto.select();
    document.execCommand("copy");
    document.body.removeChild(areaTexto);
    alert("Texto copiado com sucesso!");
}

/**
 * Formata um valor numérico para Moeda Brasileira (BRL)
 * @param {number} valor 
 * @returns {string} Valor formatado (ex: R$ 1.500,00)
 */
function formatarMoeda(valor) {
    return (valor || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

/**
 * Converte data em texto (DD/MM/AAAA) para objeto Date
 * @param {string} dataStr 
 * @returns {Date|null}
 */
function parseDataBR(dataStr) {
    if (!dataStr) return null;
    const partes = dataStr.split('/');
    if (partes.length !== 3) return null;

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const ano = parseInt(partes[2], 10);

    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return null;

    return new Date(ano, mes, dia);
}
