function gerarCalculo476(data, valorPVR) {
    const dAlt = parseDataBR(data.dtalt);
    const dIni = parseDataBR(data.dtini);

    if (!dAlt) {
        return `<div class="calc-card-item"><h4>RUBRICA 476</h4><div class="error-msg">Data de Alteração (DTALT) inválida.</div></div>`;
    }

    if (valorPVR <= 0) {
        return `
            <div class="calc-card-item">
                <h4>RUBRICA 476 - PVR PROPORCIONAL</h4>
                <div class="calc-details">Esta tabela (${data.sigla.toUpperCase()}) não possui valor de PVR configurado.</div>
            </div>
        `;
    }

    const mesesNomes = [
        "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
        "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
    ];

    const checkboxDiffId = `chk_diff_476_${data.cardId}`;
    const checkDiff = document.getElementById(checkboxDiffId);
    const incluirMesAnterior = checkDiff ? checkDiff.checked : false;

    // Mês Atual (DTALT)
    const diaAlt = dAlt.getDate();
    const anoAlt = dAlt.getFullYear();
    const mesAltIdx = dAlt.getMonth();
    const nomeMesAtual = mesesNomes[mesAltIdx];
    const totalDiasMesAtual = new Date(anoAlt, mesAltIdx + 1, 0).getDate();

    const pvrDiaAtual = valorPVR / totalDiasMesAtual;
    const pvrDiaAtualArred = Math.round(pvrDiaAtual * 100) / 100;
    const totalAtual = Math.round((pvrDiaAtualArred * diaAlt) * 100) / 100;

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
        const pvrDiaAnt = valorPVR / totalDiasMesAnterior;
        const pvrDiaAntArred = Math.round(pvrDiaAnt * 100) / 100;
        const totalAnterior = Math.round((pvrDiaAntArred * diasTrabalhadosMesAnterior) * 100) / 100;

        valorFinal = Math.round((totalAnterior + totalAtual) * 100) / 100;

        detalhesHTML = `
            <strong>Mês Anterior (${nomeMesAnterior}):</strong> ${formatarMoeda(valorPVR)} &divide; ${totalDiasMesAnterior} dias = ${formatarMoeda(pvrDiaAntArred)}/dia &times; ${diasTrabalhadosMesAnterior} dias = ${formatarMoeda(totalAnterior)}<br>
            <strong>Mês Rescisão (${nomeMesAtual}):</strong> ${formatarMoeda(valorPVR)} &divide; ${totalDiasMesAtual} dias = ${formatarMoeda(pvrDiaAtualArred)}/dia &times; ${diaAlt} dias = ${formatarMoeda(totalAtual)}<br>
            <strong>Valor Total Somado (476):</strong> <strong>${formatarMoeda(valorFinal)}</strong>
        `;

        memoriaCalculoStr = `${diasTrabalhadosMesAnterior} DIAS MÊS ANTERIOR (${formatarMoeda(totalAnterior)}) + ${diaAlt} DIAS MÊS RESCISÃO (${formatarMoeda(totalAtual)}) = TOTAL ${formatarMoeda(valorFinal)}`;
        textoJustificativa = `${data.matricula} ${data.nome.toUpperCase()} INCLUSÃO DE PAGAMENTO DE VALORES SOMADOS DO MÊS CORRENTE E ANTERIOR DE DIFERENÇAS REFERENTE A PVR (${memoriaCalculoStr}), DEVIDO RESCISÃO DE CONTRATO EM ${data.dtalt}`;
    } else {
        detalhesHTML = `
            <strong>Mês Rescisão (${nomeMesAtual}):</strong> ${formatarMoeda(valorPVR)} &divide; ${totalDiasMesAtual} dias = ${formatarMoeda(pvrDiaAtualArred)}/dia<br>
            <strong>Valor Total (${diaAlt} dias):</strong> ${formatarMoeda(pvrDiaAtualArred)} &times; ${diaAlt} = <strong>${formatarMoeda(totalAtual)}</strong>
        `;

        memoriaCalculoStr = `${formatarMoeda(valorPVR)} / ${totalDiasMesAtual} DIAS = ${formatarMoeda(pvrDiaAtualArred)} * ${diaAlt} DIAS = ${formatarMoeda(totalAtual)}`;
        textoJustificativa = `${data.matricula} ${data.nome.toUpperCase()} INCLUSÃO DE PAGAMENTO DE DIFERENÇAS REFERENTE A PVR (${memoriaCalculoStr}), DEVIDO RESCISÃO DE CONTRATO EM ${data.dtalt}`;
    }

    const copyTextId = `copy_text_476_${data.cardId}`;

    return `
        <div class="calc-card-item">
            <h4>RUBRICA 476 - PVR PROPORCIONAL</h4>
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