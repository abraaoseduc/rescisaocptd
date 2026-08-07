/**
 * Gera o demonstrativo de cálculo para a Rubrica 321 (Diferença de Remuneração).
 * @param {Object} data - Objeto contendo os dados do servidor.
 * @param {Number} valorRemuneracao - Valor da remuneração base.
 * @param {String} tipoLancamento - 'INCLUSÃO' ou 'ALTERAÇÃO'.
 * @param {Boolean} bloqFolha - Indica se a folha está bloqueada.
 * @param {String} numFolha - Número da folha onde ocorreu o bloqueio.
 * @param {Boolean} apenasDiferenca - Indica se o cálculo deve considerar apenas dias de diferença.
 * @returns {String} HTML contendo o cálculo da rubrica.
 */
function gerarCalculo321(data, valorRemuneracao, tipoLancamento = 'INCLUSÃO', bloqFolha = false, numFolha = '', apenasDiferenca = false) {
    const mesesTrabalhados = calcularMesesTrabalhados(data.dtinialt, data.dtalt);
    const valorDia = valorRemuneracao / 30;
    
    // Cálculo do valor total com base nos parâmetros
    let valorTotal321 = valorRemuneracao * mesesTrabalhados;
    let descDias = `${mesesTrabalhados} mês(es)`;

    if (apenasDiferenca) {
        // Exemplo proporcional para dias/diferença específica
        valorTotal321 = valorRemuneracao; // Pode adaptar a lógica exata de dias de diferença se houver
    }

    const obsTexto = `REF. A DIFERENÇA DE REMUNERAÇÃO (${descDias}). PERÍODO DE ${data.dtinialt} A ${data.dtalt}. DOE N° ${data.dtpubl}, PÁG. ${data.pagdoe}.${bloqFolha ? ` FOLHA BLOQUEADA N° ${numFolha}.` : ''}`;

    const textoCopia321 = `Nº DO PROCESSO:
RUBRICA: 321 - DIFERENÇA DE REMUNERAÇÃO
TIPO DE LANÇAMENTO: ${tipoLancamento}
VALOR DA AÇÃO: ${formatarMoeda(valorTotal321)}
NÚMERO DA FOLHA: ${numFolha}
DADOS DO SERVIDOR: ${data.nome} | MATRÍCULA: ${data.matricula}
OBSERVAÇÃO:
${obsTexto}`;

    const jsonEnvio = encodeURIComponent(JSON.stringify({
        crede: data.crede,
        matricula: data.matricula,
        nome: data.nome,
        rubrica: '321',
        tipoLancamento: tipoLancamento,
        valorTotal: valorTotal321,
        observacao: obsTexto
    }));

    return `
        <div class="calc-card-item">
            <h4>
                <span>RUBRICA 321 - DIFERENÇA DE REMUNERAÇÃO</span>
                <span style="font-size: 0.8rem; color: #1e40af; background: #dbeafe; padding: 0.2rem 0.5rem; border-radius: 4px;">${tipoLancamento}</span>
            </h4>

            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem; background: #fff; padding: 0.5rem; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 0.8rem;">
                <div class="lancamento-selector">
                    <label><strong>Lançamento:</strong></label>
                    <select onchange="recalcularRubricaEspecifica('${data.cardId}', '321', this.value)" style="padding: 0.2rem; border-radius: 4px;">
                        <option value="INCLUSÃO" ${tipoLancamento === 'INCLUSÃO' ? 'selected' : ''}>INCLUSÃO</option>
                        <option value="ALTERAÇÃO" ${tipoLancamento === 'ALTERAÇÃO' ? 'selected' : ''}>ALTERAÇÃO</option>
                    </select>
                </div>

                <div class="folha-selector" style="display: flex; align-items: center; gap: 0.3rem;">
                    <input type="checkbox" id="chk_bloqueio_321_${data.cardId}" ${bloqFolha ? 'checked' : ''} onchange="atualizarBloqueioFolha('${data.cardId}', '321')">
                    <label for="chk_bloqueio_321_${data.cardId}">Bloqueado em Folha</label>
                    ${bloqFolha ? `<input type="text" id="num_folha_321_${data.cardId}" placeholder="Nº Folha" value="${numFolha}" onblur="atualizarBloqueioFolha('${data.cardId}', '321')" style="width: 70px; padding: 0.1rem 0.3rem;">` : ''}
                </div>

                <div class="diferencas-selector" style="display: flex; align-items: center; gap: 0.3rem;">
                    <input type="checkbox" id="chk_diferencas_321_${data.cardId}" ${apenasDiferenca ? 'checked' : ''} onchange="atualizarDiferencas321_476('${data.cardId}', '321')">
                    <label for="chk_diferencas_321_${data.cardId}">Calcular Dif. Dias</label>
                </div>
            </div>
            
            <div class="calc-details">
                <strong>Base Remuneração:</strong> ${formatarMoeda(valorRemuneracao)}<br>
                <strong>Período:</strong> ${data.dtinialt} a ${data.dtalt} (${descDias})<br>
                <strong>Valor Total Calculado:</strong> <strong style="color: var(--primary); font-size: 1rem;">${formatarMoeda(valorTotal321)}</strong>
            </div>

            <div class="copy-box-container">
                <div class="copy-box-text" id="copy_321_${data.cardId}">${textoCopia321}</div>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                    <button class="btn-copy" onclick="copiarTexto('copy_321_${data.cardId}')">📋 Copiar Texto</button>
                    <button class="btn-copy" style="background-color: #0284c7;" onclick="enviarRescisaoPlanilha(JSON.parse(decodeURIComponent('${jsonEnvio}')))">📊 Enviar para Planilha</button>
                </div>
            </div>
        </div>
    `;
}