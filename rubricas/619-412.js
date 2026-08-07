// Estado global para guardar alterações do Vale Alimentação por card
window.vaState = window.vaState || {};

function toggleFeriadoVA(cardId, dia, encodedData) {
    if (!window.vaState[cardId]) return;
    const idx = window.vaState[cardId].holidays.indexOf(dia);
    if (idx > -1) {
        window.vaState[cardId].holidays.splice(idx, 1);
    } else {
        window.vaState[cardId].holidays.push(dia);
    }
    recalcularCard(encodedData);
}

function changeRubricaVA(cardId, rubricaVal, encodedData) {
    if (!window.vaState[cardId]) return;
    window.vaState[cardId].rubrica = rubricaVal;
    recalcularCard(encodedData);
}

function updateDiasVA(cardId, val, encodedData) {
    if (!window.vaState[cardId]) return;
    window.vaState[cardId].diasCalculo = parseInt(val, 10) || 0;
    recalcularCard(encodedData);
}

function gerarCalculoValeAlimentacao(data) {
    const cardId = data.cardId;
    const dAlt = parseDataBR(data.dtalt);

    if (!dAlt) {
        return `<div class="calc-card-item"><h4>VALE ALIMENTAÇÃO</h4><div class="error-msg">Data de Alteração (DTALT) inválida.</div></div>`;
    }

    const ano = dAlt.getFullYear();
    const mesIdx = dAlt.getMonth();
    const mesesNomes = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
    const nomeMes = mesesNomes[mesIdx];
    const totalDiasMes = new Date(ano, mesIdx + 1, 0).getDate();

    if (!window.vaState[cardId]) {
        window.vaState[cardId] = {
            holidays: [],
            rubrica: '619',
            diasCalculo: 0
        };
    }

    const state = window.vaState[cardId];

    let diasUteisStd = 0;
    for (let d = 1; d <= totalDiasMes; d++) {
        const dateObj = new Date(ano, mesIdx, d);
        const dayOfWeek = dateObj.getDay();
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        const isHoliday = state.holidays.includes(d);

        if (!isWeekend && !isHoliday) {
            diasUteisStd++;
        }
    }

    const valorDiario = 16.96;
    const valorTotalMes = Math.round((diasUteisStd * valorDiario) * 100) / 100;

    const firstDayOfWeek = new Date(ano, mesIdx, 1).getDay();
    let calHTML = `
        <div style="background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:0.75rem; margin-top:0.5rem;">
            <div style="font-weight:bold; font-size:0.85rem; text-align:center; margin-bottom:0.4rem; color:var(--text-main);">
                CALENDÁRIO: ${nomeMes} / ${ano}
            </div>
            <div style="font-size:0.75rem; color:#b45309; background:#fffbeb; border:1px solid #fcd34d; padding:0.4rem; border-radius:4px; margin-bottom:0.5rem;">
                ⚠️ <strong>Aviso:</strong> Clique nos dias da semana (Seg-Sex) para marcar/desmarcar feriados que não estejam marcados.
            </div>
            <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:2px; text-align:center; font-size:0.75rem;">
                <div style="font-weight:bold; background:#e2e8f0; padding:2px;">DOM</div>
                <div style="font-weight:bold; background:#e2e8f0; padding:2px;">SEG</div>
                <div style="font-weight:bold; background:#e2e8f0; padding:2px;">TER</div>
                <div style="font-weight:bold; background:#e2e8f0; padding:2px;">QUA</div>
                <div style="font-weight:bold; background:#e2e8f0; padding:2px;">QUI</div>
                <div style="font-weight:bold; background:#e2e8f0; padding:2px;">SEX</div>
                <div style="font-weight:bold; background:#e2e8f0; padding:2px;">SÁB</div>
    `;

    for (let i = 0; i < firstDayOfWeek; i++) {
        calHTML += `<div style="padding:4px;"></div>`;
    }

    for (let d = 1; d <= totalDiasMes; d++) {
        const dateObj = new Date(ano, mesIdx, d);
        const dow = dateObj.getDay();
        const isWeekend = (dow === 0 || dow === 6);
        const isHoliday = state.holidays.includes(d);

        let bg = "#dcfce7";
        let color = "#166534";
        let cursor = "pointer";

        if (isWeekend) {
            bg = "#e2e8f0";
            color = "#94a3b8";
            cursor = "default";
        } else if (isHoliday) {
            bg = "#fecaca";
            color = "#991b1b";
        }

        const clickAttr = !isWeekend ? `onclick="toggleFeriadoVA('${cardId}', ${d}, '${encodeURIComponent(JSON.stringify(data))}')"` : '';

        calHTML += `
            <div ${clickAttr} style="background:${bg}; color:${color}; border:1px solid #cbd5e1; border-radius:3px; padding:4px 2px; font-weight:bold; cursor:${cursor}; font-size:0.75rem;" title="${isWeekend ? 'Fim de semana' : (isHoliday ? 'Feriado/Não útil' : 'Dia útil')}">
                ${d}
            </div>
        `;
    }

    calHTML += `</div>`;

    calHTML += `
        <div style="margin-top:0.6rem; font-size:0.8rem; line-height:1.4; background:#f8fafc; padding:0.5rem; border-radius:4px; border:1px solid #e2e8f0;">
            • <strong>Dias Úteis no Mês:</strong> ${diasUteisStd} dias<br>
            • <strong>Valor Total Mensal (Integral):</strong> R$ 16,96 &times; ${diasUteisStd} = <strong>${formatarMoeda(valorTotalMes)}</strong>
        </div>
    </div>`;

    const is619 = state.rubrica === '619';
    const is412 = state.rubrica === '412';

    const diasCalc = state.diasCalculo || 0;
    const totalCalcVal = Math.round((diasCalc * valorDiario) * 100) / 100;
    const memoriaStr = `${diasCalc} DIAS X R$ 16,96 = ${formatarMoeda(totalCalcVal)}`;

    let justificativa = '';
    if (is619) {
        justificativa = `${data.matricula} ${data.nome.toUpperCase()} INCLUSÃO DE DEVOLUÇÃO DE VALORES REFERENTE AO AUXÍLIO ALIMENTAÇÃO (${memoriaStr}), DEVIDO A RESCISÃO DE CONTRATO EM ${data.dtalt}`;
    } else {
        justificativa = `${data.matricula} ${data.nome.toUpperCase()} INCLUSÃO DE VALORES A SEREM PAGOS REFERENTE AO AUXÍLIO ALIMENTAÇÃO (${memoriaStr}), DEVIDO A RESCISÃO DE CONTRATO EM ${data.dtalt}`;
    }

    const copyTextId = `copy_text_va_${cardId}`;

    return `
        <div class="calc-card-item">
            <h4>VALE ALIMENTAÇÃO (R$ 16,96 / dia)</h4>
            
            <div style="margin-top:0.5rem; margin-bottom:0.5rem; font-size:0.85rem; display:flex; gap:1rem; align-items:center; background:#e2e8f0; padding:0.5rem; border-radius:4px;">
                <strong>Selecione a Rubrica:</strong>
                <label style="cursor:pointer; display:inline-flex; align-items:center; gap:0.2rem;">
                    <input type="radio" name="radio_rubrica_va_${cardId}" value="619" ${is619 ? 'checked' : ''} onchange="changeRubricaVA('${cardId}', '619', '${encodeURIComponent(JSON.stringify(data))}')">
                    <strong>619</strong> (Devolução)
                </label>
                <label style="cursor:pointer; display:inline-flex; align-items:center; gap:0.2rem;">
                    <input type="radio" name="radio_rubrica_va_${cardId}" value="412" ${is412 ? 'checked' : ''} onchange="changeRubricaVA('${cardId}', '412', '${encodeURIComponent(JSON.stringify(data))}')">
                    <strong>412</strong> (Pagamento)
                </label>
            </div>

            ${calHTML}

            <div style="margin-top:0.75rem; background:#f0fdf4; border:1px solid #bbf7d0; padding:0.75rem; border-radius:6px;">
                <label style="font-size:0.85rem; font-weight:bold; color:var(--text-main); display:block; margin-bottom:0.3rem;">
                    Quantidade de dias a serem calculados (${is619 ? 'Devolução - Rubrica 619' : 'Pagamento - Rubrica 412'}):
                </label>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <input type="number" id="input_dias_va_${cardId}" value="${diasCalc || ''}" placeholder="0" min="0" max="31" style="width:80px; padding:0.4rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.9rem; font-weight:bold;" oninput="updateDiasVA('${cardId}', this.value, '${encodeURIComponent(JSON.stringify(data))}')">
                    <span style="font-size:0.85rem; font-weight:bold; color:var(--text-dark);">
                        dias &times; R$ 16,96 = <span style="color:var(--primary); font-size:1rem;">${formatarMoeda(totalCalcVal)}</span>
                    </span>
                </div>
            </div>

            <div class="copy-box-container" style="margin-top:0.75rem;">
                <div class="copy-box-text" id="${copyTextId}">${justificativa}</div>
                <button class="btn-copy" onclick="copiarTexto('${copyTextId}')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Copiar Texto
                </button>
            </div>
        </div>
    `;
}