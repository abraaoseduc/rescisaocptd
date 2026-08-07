function gerarCalculo660(data, valorVencimento) {
    const dAlt = parseDataBR(data.dtalt);

    if (!dAlt) {
        return `<div class="calc-card-item"><h4>RUBRICA 660</h4><div class="error-msg">Data de Alteração (DTALT) inválida.</div></div>`;
    }

    const mesesNomes = [
        "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
        "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
    ];

    const diaAlt = dAlt.getDate();
    const anoAlt = dAlt.getFullYear();
    const mesAltIdx = dAlt.getMonth();
    const nomeMesAtual = mesesNomes[mesAltIdx];
    
    // Total de dias do mês da rescisão
    const totalDiasMes = new Date(anoAlt, mesAltIdx + 1, 0).getDate();

    // Dias a devolver (dias restantes do mês após a DTALT)
    const diasDevolver = totalDiasMes - diaAlt;

    if (diasDevolver <= 0) {
        return `
            <div class="calc-card-item">
                <h4>RUBRICA 660 - DESPESA ANULAR</h4>
                <div class="calc-details">A data de rescisão (${data.dtalt}) corresponde ao último dia do mês. Não há dias a devolver.</div>
            </div>
        `;
    }

    // Vencimento de 1 dia
    const vencimentoDia = valorVencimento / totalDiasMes;
    const vencimentoDiaArred = Math.round(vencimentoDia * 100) / 100;

    // Valor Total a Devolver
    const totalDevolucao = Math.round((vencimentoDiaArred * diasDevolver) * 100) / 100;

    const memoriaCalculoStr = `${formatarMoeda(valorVencimento)} / ${totalDiasMes} DIAS = ${formatarMoeda(vencimentoDiaArred)} * ${diasDevolver} DIAS DEVOLVIDOS = ${formatarMoeda(totalDevolucao)}`;
    const textoJustificativa = `${data.matricula} ${data.nome.toUpperCase()} INCLUSÃO DE DESPESA ANULAR REFERENTE A DEVOLUÇÃO DE ${diasDevolver} DIAS (${memoriaCalculoStr}), DEVIDO RESCISÃO DE CONTRATO EM ${data.dtalt}`;

    const copyTextId = `copy_text_660_${data.cardId}`;

    return `
        <div class="calc-card-item">
            <h4>RUBRICA 660 - DESPESA ANULAR</h4>
            <div class="calc-details">
                <strong>Mês da Rescisão (${nomeMesAtual}):</strong> ${formatarMoeda(valorVencimento)} &divide; ${totalDiasMes} dias = ${formatarMoeda(vencimentoDiaArred)}/dia<br>
                <strong>Dias a Devolver (${diasDevolver} dias):</strong> ${formatarMoeda(vencimentoDiaArred)} &times; ${diasDevolver} = <strong>${formatarMoeda(totalDevolucao)}</strong>
            </div>

            <div class="copy-box-container">
                <div class="copy-box-text" id="${copyTextId}">${textoJustificativa}</div>
                <button class="btn-copy" onclick="copiarTexto('${copyTextId}')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Copiar Texto
                </button>
            </div>
        </div>
    `;
}