const URL_WEB_APP_GSHEETS = "https://script.google.com/a/macros/seduc.ce.gov.br/s/AKfycbyQIiJP3ooupBeaLM12YgKfZsVb4tHDr7pQcPTPC587d3bHRGhfCGJ-cbJNBL-yWLp0/exec";

// Escuta a mensagem de sucesso ou erro enviada pelo iframe/Apps Script
window.addEventListener("message", function(event) {
    if (event.data === 'SUCCESS') {
        alert("✅ Dados salvos na planilha com sucesso!");
    } else if (typeof event.data === 'string' && event.data.startsWith('ERROR:')) {
        alert("❌ Erro ao salvar na planilha: " + event.data);
    }
});

/**
 * Envia os dados da rescisão para a planilha do Google
 * @param {Object} payload Dados do cálculo
 */
function enviarRescisaoPlanilha(payload) {
    if (!URL_WEB_APP_GSHEETS || URL_WEB_APP_GSHEETS.includes("COLE_AQUI")) {
        alert("Erro: A URL do Apps Script não foi configurada corretamente.");
        return;
    }

    // Procura ou cria o iframe oculto no DOM
    let iframe = document.getElementById("hidden_iframe_gsheet");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "hidden_iframe_gsheet";
        iframe.name = "hidden_iframe_gsheet";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
    }

    // Feedback visual no botão que disparou o evento
    const botaoClicado = document.activeElement;
    let textoOriginal = "";
    if (botaoClicado && botaoClicado.tagName === "BUTTON") {
        textoOriginal = botaoClicado.innerHTML;
        botaoClicado.innerText = "Enviando...";
        botaoClicado.disabled = true;

        setTimeout(() => {
            botaoClicado.innerHTML = textoOriginal;
            botaoClicado.disabled = false;
        }, 2000);
    }

    // Cria formulário dinâmico para submeter os dados em stringify
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
    } catch (e) {
        console.error("Erro ao submeter formulário:", e);
        alert("Falha ao tentar enviar os dados para a planilha.");
    } finally {
        document.body.removeChild(form);
    }
}
