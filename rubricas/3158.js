/**
 * Gera o demonstrativo de cálculo para a Rubrica 3158 (13º Salário / Gratificação Natalina).
 * @param {Object} data - Objeto contendo os dados do servidor.
 * @param {Number} valorVencimento - Valor base do vencimento (Remuneração + PVR, se houver).
 * @returns {String} HTML contendo o cálculo da rubrica.
 */
function gerarCalculo3158(data, valorVencimento) {
    const mesesTrabalhados = calcularMesesTrabalhados(data.dtinialt, data.dtalt);
    const valorMes = valorVencimento / 12;
    const valorTotal3158 = valorMes * mesesTrabalhados;

    const textoCopia3158 = `Nº DO PROCESSO:
RUBRICA: 3158 - 13º SALÁRIO
TIPO DE LANÇAMENTO: INCLUSÃO
VALOR DA AÇÃO: ${formatarMoeda(valorTotal3158)}
NÚMERO DA FOLHA:
DADOS DO SERVIDOR: ${data.nome} | MATRÍCULA: ${data.matricula}
OBSERVAÇÃO:
REF. A PROPORCIONAL DE 13° SALÁRIO (${mesesTrabalhados}/12 AVOS). PERÍODO DE TRABALHO DE ${data.dtinialt} A ${data.dtalt}. DOE N° ${data.dtpubl}, PÁG. ${data.pagdoe}. TOTAL DE MESES CÔMPUTO DO CONTRATO DE TRABALHO ${mesesTrabalhados} MESES.`;

    const jsonEnvio = encodeURIComponent(JSON.stringify({
        crede: data.crede,
        matricula: data.matricula,
        nome: data.nome,
        rubrica: '3158',
        tipoLancamento: 'INCLUSÃO',
        valorTotal: valorTotal3158,
        observacao: `REF. A PROPORCIONAL DE 13° SALÁRIO (${mesesTrabalhados}/12 AVOS). PERÍODO DE TRABALHO DE ${data.dtinialt} A ${data.dtalt}.`
    }));

    return `
        <div class="calc-card-item">
            <h4>
                <span>RUBRICA 3158 - DÉCIMO TERCEIRO</span>
                <span style="font-size: 0.8rem; color: #166534; background: #dcfce7; padding: 0.2rem 0.5rem; border-radius: 4px;">INCLUSÃO</span>
            </h4>
            
            <div class="calc-details">
                <strong>Período considerado:</strong> ${data.dtinialt} a ${data.dtalt}<br>
                <strong>Avos de direito:</strong> ${mesesTrabalhados}/12 avos<br>
                <strong>Fórmula:</strong> (${formatarMoeda(valorVencimento)} ÷ 12) × ${mesesTrabalhados}<br>
                <strong>Valor Proporcional do Mês (1/12):</strong> ${formatarMoeda(valorMes)}<br>
                <strong>Valor Total Calculado:</strong> <strong style="color: var(--primary); font-size: 1rem;">${formatarMoeda(valorTotal3158)}</strong>
            </div>

            <div class="copy-box-container">
                <div class="copy-box-text" id="copy_3158_${data.cardId}">${textoCopia3158}</div>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                    <button class="btn-copy" onclick="copiarTexto('copy_3158_${data.cardId}')">📋 Copiar Texto</button>
                    <button class="btn-copy" style="background-color: #0284c7;" onclick="enviarRescisaoPlanilha(JSON.parse(decodeURIComponent('${jsonEnvio}')))">📊 Enviar para Planilha</button>
                </div>
            </div>
        </div>
    `;
}