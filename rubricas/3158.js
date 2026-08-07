function gerarCalculo3158(data, vencimento) {
    const mesesTrabalhados = calcularMesesTrabalhados(data.dtini, data.dtalt);
    const umDozeAvosBruto = vencimento / 12;
    const umDozeAvosArred = Math.round(umDozeAvosBruto * 100) / 100;
    const valorTotal3158 = Math.round((umDozeAvosArred * mesesTrabalhados) * 100) / 100;

    const memoriaCalculoStr = `${formatarMoeda(vencimento)} / 12 = ${formatarMoeda(umDozeAvosArred)} * ${mesesTrabalhados} MESES = ${formatarMoeda(valorTotal3158)}`;
    const copyTextId = `copy_text_3158_${data.cardId}`;

    const textoJustificativa = `${data.matricula} ${data.nome.toUpperCase()} INCLUSÃO DE PAGAMENTO DE 13° SALÁRIO REFERENTE A ${mesesTrabalhados}/12 AVOS CONFORME CÁLCULO (${memoriaCalculoStr}), DEVIDO RESCISÃO DE CONTRATO EM ${data.dtalt}`;

    return `
        <div class="calc-card-item">
            <h4>RUBRICA 3158 - DÉCIMO TERCEIRO (RESCISÃO)</h4>
            <div class="calc-details">
                <strong>Período considerado:</strong> ${data.dtini} a ${data.dtalt}<br>
                <strong>Meses com &ge; 15 dias:</strong> ${mesesTrabalhados} mês(es)<br>
                <strong>1/12 Avos do Vencimento:</strong> ${formatarMoeda(vencimento)} &divide; 12 = ${formatarMoeda(umDozeAvosArred)}<br>
                <strong>Valor Total (3158):</strong> ${formatarMoeda(umDozeAvosArred)} &times; ${mesesTrabalhados} = <strong>${formatarMoeda(valorTotal3158)}</strong>
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