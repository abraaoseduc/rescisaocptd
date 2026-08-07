function gerarCalculo660(data, valorVencimento, tipoLancamento = 'INCLUSÃO') {
    const matricula = data.matricula || '';
    const nome = data.nome || '';
    const textoLancamento = tipoLancamento.toUpperCase();

    const textoCopia = `${matricula} ${nome} ${textoLancamento} DE DESPESA ANULAR NO VALOR DE R$ ${valorVencimento.toFixed(2).replace('.', ',')} REFERENTE A RESCISÃO DE CONTRATO EM ${data.dtalt}`;

    return `
        <div class="calc-card-item">
            <h4>RUBRICA 660 - DESPESA ANULAR</h4>
            <div class="calc-details">
                • <strong>Valor Total Vencimento:</strong> R$ ${valorVencimento.toFixed(2).replace('.', ',')}<br>
                • <strong>Data de Rescisão:</strong> ${data.dtalt}
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

            <div class="copy-box-container">
                <div class="copy-box-text" id="text_660_${data.cardId}">${textoCopia}</div>
                <button class="btn-copy" onclick="copiarTexto('text_660_${data.cardId}')">📋 Copiar Texto</button>
            </div>
        </div>
    `;
}
