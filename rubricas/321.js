function gerarCalculo321(data, valorRemuneracao) {
    const dAlt = parseDataBR(data.dtalt);
    const dIni = parseDataBR(data.dtini);

    if (!dAlt) {
        return `<div class="calc-card-item"><h4>RUBRICA 321</h4><div class="error-msg">Data de Alteração (DTALT) inválida.</div></div>`;
    }

    const mesesNomes = [
        "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
        "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
    ];

    const checkboxDiffId = `chk_diff_321_${data.cardId}`;
    const checkDiff = document.getElementById(checkboxDiffId);
    const incluirMesAnterior = checkDiff ? checkDiff.checked : false;

    // Mês Atual (DTALT)
    const diaAlt = dAlt.getDate();
    const anoAlt = dAlt.getFullYear();
    const mesAltIdx = dAlt.getMonth();
    const nomeMesAtual = mesesNomes[mesAltIdx];
    const totalDiasMesAtual = new Date(anoAlt, mesAltIdx + 1, 0).getDate();

    const remDiaAtual = valorRemuneracao / totalDiasMesAtual;
    const remDiaAtualArred = Math.round(remDiaAtual * 100) / 100;
    const totalAtual = Math.round((remDiaAtualArred * diaAlt) * 100) / 100;

    let valorFinal = totalAtual;
    let detalhesHTML = '';
    let memoriaCalculoStr = '';
    let textoJustificativa = '';

    if (incluirMesAnterior) {
        // Mês Anterior
        const dMesAnteriorFim = new Date(anoAlt, mesAltIdx, 0);
        const totalDiasMesAnterior = dMesAnteriorFim.getDate();
        const nomeMesAnterior = mesesNomes[dMesAnteriorFim.getMonth()];

        let diaInicioMesAnterior = 1;
        if (dIni && dIni.getFullYear() === dMesAnteriorFim.getFullYear() && dIni.getMonth() === dMesAnteriorFim.getMonth()) {
            diaInicioMesAnterior = dIni.getDate();
        }

        const diasTrabalhadosMesAnterior = (totalDiasMesAnterior - diaInicioMesAnterior) + 1;
        const remDiaAnt = valorRemuneracao / totalDiasMesAnterior;
        const remDiaAntArred = Math.round(remDiaAnt * 100) / 100;
        const totalAnterior = Math.round((remDiaAntArred * diasTrabalhadosMesAnterior) * 100) / 100;

        valorFinal = Math.round((totalAnterior + totalAtual) * 100) / 100;

        detalhesHTML = `
            <strong>Mês Anterior (${nomeMesAnterior}):</strong> ${formatarMoeda(valorRemuneracao)} &divide; ${totalDiasMesAnterior} dias = ${formatarMoeda(remDiaAntArred)}/dia &times; ${diasTrabalhadosMesAnterior} dias = ${formatarMoeda(totalAnterior)}<br>
            <strong>Mês Rescisão (${nomeMesAtual}):</strong> ${formatarMoeda(valorRemuneracao)} &divide; ${totalDiasMesAtual} dias = ${formatarMoeda(remDiaAtualArred)}/dia &times; ${diaAlt} dias = ${formatarMoeda(totalAtual)}<br>
            <strong>Valor Total Somado (321):</strong> <strong>${formatarMoeda(valorFinal)}</strong>
        `;

        memoriaCalculoStr = `${diasTrabalhadosMesAnterior} DIAS MÊS ANTERIOR (${formatarMoeda(totalAnterior)}) + ${diaAlt} DIAS MÊS RESCISÃO (${formatarMoeda(totalAtual)}) = TOTAL ${formatarMoeda(valorFinal)}`;
        textoJustificativa = `${data.matricula} ${data.nome.toUpperCase()} INCLUSÃO DE PAGAMENTO DE VALORES SOMADOS DO MÊS CORRENTE E ANTERIOR DE DIFERENÇAS REFERENTE A REMUNERAÇÃO (${memoriaCalculoStr}), DEVIDO RESCISÃO DE CONTRATO EM ${data.dtalt}`;
    } else {
        detalhesHTML = `
            <strong>Mês Rescisão (${nomeMesAtual}):</strong> ${formatarMoeda(valorRemuneracao)} &divide; ${totalDiasMesAtual} dias = ${formatarMoeda(remDiaAtualArred)}/dia<br>
            <strong>Valor Total (${diaAlt} dias):</strong> ${formatarMoeda(remDiaAtualArred)} &times; ${diaAlt} = <strong>${formatarMoeda(totalAtual)}</strong>
        `;

        memoriaCalculoStr = `${formatarMoeda(valorRemuneracao)} / ${totalDiasMesAtual} DIAS = ${formatarMoeda(remDiaAtualArred)} * ${diaAlt} DIAS = ${formatarMoeda(totalAtual)}`;
        textoJustificativa = `${data.matricula} ${data.nome.toUpperCase()} INCLUSÃO DE PAGAMENTO DE DIFERENÇAS REFERENTE A REMUNERAÇÃO (${memoriaCalculoStr}), DEVIDO RESCISÃO DE CONTRATO EM ${data.dtalt}`;
    }

    const copyTextId = `copy_text_321_${data.cardId}`;

    return `
        <div class="calc-card-item">
            <h4>RUBRICA 321 - REMUNERAÇÃO PROPORCIONAL</h4>
            <div style="margin-bottom: 0.5rem;">
                <label style="font-size: 0.8rem; cursor: pointer; font-weight: normal; display: inline-flex; align-items: center; gap: 0.3rem;">
                    <input type="checkbox" id="${checkboxDiffId}" ${incluirMesAnterior ? 'checked' : ''} onchange="recalcularCard('${encodeURIComponent(JSON.stringify(data))}')">
                    PAGAMENTO DE DIFERENÇAS DO MÊS ANTERIOR
                </label>
            </div>
            <div class="calc-details">
                ${detalhesHTML}
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