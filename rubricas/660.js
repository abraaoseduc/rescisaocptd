function gerarCalculo660(data, valorRemuneracao, valorPVR = 0, tipoLancamento = 'INCLUSÃO', bloqueado = false, numFolha = '') {
    const matricula = data.matricula || '';
    const nome = data.nome || '';
    const textoLancamento = tipoLancamento.toUpperCase();

    // Data de Rescisão (DTALT)
    const dtAltStr = data.dtalt || '';
    const partesAlt = dtAltStr.split('/');
    
    let diaAlt = 0;
    let mesAlt = 0;
    let anoAlt = 0;

    if (partesAlt.length === 3) {
        diaAlt = parseInt(partesAlt[0], 10) || 0;
        mesAlt = parseInt(partesAlt[1], 10) || 0;
        anoAlt = parseInt(partesAlt[2], 10) || 0;
    }

    // Dias no mês e dias a devolver (a partir do dia seguinte à rescisão)
    const diasNoMes = (mesAlt > 0 && anoAlt > 0) ? new Date(anoAlt, mesAlt, 0).getDate() : 30;
    const diasDevolver = Math.max(0, diasNoMes - diaAlt);

    // Base de cálculo: Remuneração + PVR (Vencimento)
    const baseCalculo = valorRemuneracao + valorPVR;
    const valorDia = diasNoMes > 0 ? (baseCalculo / diasNoMes) : 0;
    const valorTotalFinal = valorDia * diasDevolver;

    // String detalhada dos cálculos
    const stringCalculosTexto = `(R$ ${baseCalculo.toFixed(2).replace('.', ',')} / ${diasNoMes} dias * ${diasDevolver} dias = R$ ${valorTotalFinal.toFixed(2).replace('.', ',')})`;

    // Detalhamento para a caixa do card
    const detalheBase = valorPVR > 0 
        ? `R$ ${valorRemuneracao.toFixed(2).replace('.', ',')} (Remuneração) + R$ ${valorPVR.toFixed(2).replace('.', ',')} (PVR) = R$ ${baseCalculo.toFixed(2).replace('.', ',')}`
        : `R$ ${valorRemuneracao.toFixed(2).replace('.', ',')} (Remuneração)`;

    const htmlDetalhesCalculo = `
        • <strong>Mês de Referência (${mesAlt.toString().padStart(2, '0')}/${anoAlt}):</strong> ${diasNoMes} dias<br>
        • <strong>Base de Vencimento:</strong> ${detalheBase}<br>
        • <strong>Dias a Devolver:</strong> ${diasDevolver} dias (${diasNoMes} - ${diaAlt})<br>
        • <strong>Cálculo de Anulação:</strong> R$ ${baseCalculo.toFixed(2).replace('.', ',')} / ${diasNoMes} dias * ${diasDevolver} dias = <strong>R$ ${valorTotalFinal.toFixed(2).replace('.', ',')}</strong>
    `;

    // Bloqueio
    let complementoBloqueio = '';
    if (bloqueado) {
        complementoBloqueio = numFolha.trim() !== '' 
            ? ` PAGAMENTO BLOQUEADO NA FOLHA ${numFolha.trim()}` 
            : ' PAGAMENTO BLOQUEADO NA FOLHA';
    }

    // Montagem do texto base para cópia
    const textoCopia = `${matricula} ${nome} ${textoLancamento} DE DESPESA ANULAR REFERENTE A DEVOLUÇÃO DE ${diasDevolver} DIAS DE VENCIMENTO RECEBIDOS INDEVIDAMENTE ${stringCalculosTexto}, DEVIDO RESCISÃO DE CONTRATO EM ${data.dtalt}${complementoBloqueio}`;

    return `
        <div class="calc-card-item">
            <h4>RUBRICA 660 - DESPESA ANULAR</h4>

            <div class="calc-details">
                ${htmlDetalhesCalculo}
            </div>

            <div class="lancamento-selector" style="margin: 0.75rem 0; font-size: 0.85rem; background: #ffffff; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;">
                <strong style="display:block; margin-bottom: 0.3rem; color: var(--text-dark);">Tipo de Lançamento:</strong>
                <label style="margin-right: 15px; cursor: pointer; font-weight: 500;">
                    <input type="radio" name="tipo_660_${data.cardId}" value="INCLUSÃO" ${tipoLancamento === 'INCLUSÃO' ? 'checked' : ''} onchange="recalcularRubricaEspecifica('${data.cardId}', '660', this.value)"> INCLUSÃO
                </label>
                <label style="cursor: pointer; font-weight: 500;">
                    <input type="radio" name="tipo_660_${data.cardId}" value="ALTERAÇÃO" ${tipoLancamento === 'ALTERAÇÃO' ? 'checked' : ''} onchange="recalcularRubricaEspecifica('${data.cardId}', '660', this.value)"> ALTERAÇÃO
                </label>
            </div>

            <div class="folha-selector" style="margin: 0.75rem 0; font-size: 0.85rem; background: #ffffff; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;">
                <strong style="display:block; margin-bottom: 0.3rem; color: var(--text-dark);">Situação no Folha/Multipag:</strong>
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    <label style="cursor: pointer; font-weight: 500; display: inline-flex; align-items: center; gap: 0.3rem;">
                        <input type="checkbox" id="chk_bloqueio_660_${data.cardId}" ${bloqueado ? 'checked' : ''} onchange="atualizarBloqueioFolha('${data.cardId}', '660')"> BLOQUEIO DE PAGAMENTO REALIZADO NA FOLHA
                    </label>
                    <input type="text" id="num_folha_660_${data.cardId}" placeholder="Nº da folha" value="${numFolha}" style="padding: 0.2rem 0.4rem; font-size: 0.8rem; border: 1px solid #cbd5e1; border-radius: 4px; width: 100px;" oninput="atualizarBloqueioFolha('${data.cardId}', '660')">
                </div>
            </div>

            <div class="copy-box-container">
                <div class="copy-box-text" id="text_660_${data.cardId}">${textoCopia}</div>
                <button class="btn-copy" onclick="copiarTexto('text_660_${data.cardId}')">📋 Copiar Texto</button>
            </div>
        </div>
    `;
}