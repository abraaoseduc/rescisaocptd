// Estado global para guardar alterações do Vale Alimentação por card
window.vaState = window.vaState || {};

function renderizarCardVA(cardId, data) {
    const state = window.vaState[cardId];
    if (!state) return;

    const valorDiario = 16.96;
    const diasCalc = state.diasCalculo;
    const totalCalcVal = Math.round((diasCalc * valorDiario) * 100) / 100;
    const memoriaStr = `${diasCalc} DIAS X R$ 16,96 = ${formatarMoeda(totalCalcVal)}`;

    // 1. Atualiza a exibição da multiplicação e resultado
    const totalDisplay = document.getElementById(`total_va_display_${cardId}`);
    if (totalDisplay) {
        totalDisplay.innerText = formatarMoeda(totalCalcVal);
    }

    // 2. Atualiza o valor do input de dias
    const inputDias = document.getElementById(`input_dias_va_${cardId}`);
    if (inputDias && document.activeElement !== inputDias) {
        inputDias.value = diasCalc;
    }

    // 3. Atualiza o texto da justificativa
    const is619 = state.rubrica === '619';
    const tipoOperacao = state.tipoOperacao || 'INCLUSÃO';
    
    let justificativa = '';
    if (is619) {
        justificativa = `${data.matricula} ${data.nome.toUpperCase()} ${tipoOperacao} DE DEVOLUÇÃO DE VALORES REFERENTE AO AUXÍLIO ALIMENTAÇÃO (${memoriaStr}), DEVIDO A RESCISÃO DE CONTRATO EM ${data.dtalt}`;
    } else {
        justificativa = `${data.matricula} ${data.nome.toUpperCase()} ${tipoOperacao} DE VALORES A SEREM PAGOS REFERENTE AO AUXÍLIO ALIMENTAÇÃO (${memoriaStr}), DEVIDO A RESCISÃO DE CONTRATO EM ${data.dtalt}`;
    }

    const copyTextEl = document.getElementById(`copy_text_va_${cardId}`);
    if (copyTextEl) {
        copyTextEl.innerText = justificativa;
    }
}

function toggleDiaVA(cardId, dateStr, element) {
    if (!window.vaState[cardId]) return;

    const idx = window.vaState[cardId].selectedDays.indexOf(dateStr);
    
    if (idx > -1) {
        window.vaState[cardId].selectedDays.splice(idx, 1);
        element.style.background = "#f8fafc";
        element.style.color = "#64748b";
    } else {
        window.vaState[cardId].selectedDays.push(dateStr);
        element.style.background = "#dcfce7";
        element.style.color = "#166534";
    }

    window.vaState[cardId].diasCalculo = window.vaState[cardId].selectedDays.length;

    if (window.vaDataStore && window.vaDataStore[cardId]) {
        renderizarCardVA(cardId, window.vaDataStore[cardId]);
    }
}

function toggleMesInteiroVA(cardId, ano, mesIdx) {
    if (!window.vaState[cardId]) return;

    const totalDiasMes = new Date(ano, mesIdx + 1, 0).getDate();
    const diasUteisMes = [];

    for (let d = 1; d <= totalDiasMes; d++) {
        const dateObj = new Date(ano, mesIdx, d);
        const dow = dateObj.getDay();
        if (dow !== 0 && dow !== 6) {
            const dateStr = `${ano}-${String(mesIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            diasUteisMes.push(dateStr);
        }
    }

    // Verifica se todos os dias úteis deste mês já estão selecionados
    const todosSelecionados = diasUteisMes.every(d => window.vaState[cardId].selectedDays.includes(d));

    const mesContainer = document.getElementById(`cal_mes_${cardId}_${ano}_${mesIdx}`);

    if (todosSelecionados) {
        // Desmarca todos os dias úteis desse mês
        window.vaState[cardId].selectedDays = window.vaState[cardId].selectedDays.filter(d => !diasUteisMes.includes(d));
        
        // Atualiza o estilo visual no DOM
        if (mesContainer) {
            diasUteisMes.forEach(dateStr => {
                const el = mesContainer.querySelector(`[data-date="${dateStr}"]`);
                if (el) {
                    el.style.background = "#f8fafc";
                    el.style.color = "#64748b";
                }
            });
        }
    } else {
        // Marca todos os dias úteis desse mês
        diasUteisMes.forEach(dateStr => {
            if (!window.vaState[cardId].selectedDays.includes(dateStr)) {
                window.vaState[cardId].selectedDays.push(dateStr);
            }
        });

        // Atualiza o estilo visual no DOM
        if (mesContainer) {
            diasUteisMes.forEach(dateStr => {
                const el = mesContainer.querySelector(`[data-date="${dateStr}"]`);
                if (el) {
                    el.style.background = "#dcfce7";
                    el.style.color = "#166534";
                }
            });
        }
    }

    window.vaState[cardId].diasCalculo = window.vaState[cardId].selectedDays.length;

    if (window.vaDataStore && window.vaDataStore[cardId]) {
        renderizarCardVA(cardId, window.vaDataStore[cardId]);
    }
}

function changeRubricaVA(cardId, rubricaVal) {
    if (!window.vaState[cardId]) return;
    window.vaState[cardId].rubrica = rubricaVal;
    if (window.vaDataStore && window.vaDataStore[cardId]) {
        renderizarCardVA(cardId, window.vaDataStore[cardId]);
    }
}

function changeTipoOperacaoVA(cardId, tipoVal) {
    if (!window.vaState[cardId]) return;
    window.vaState[cardId].tipoOperacao = tipoVal;
    if (window.vaDataStore && window.vaDataStore[cardId]) {
        renderizarCardVA(cardId, window.vaDataStore[cardId]);
    }
}

function updateDiasVA(cardId, val) {
    if (!window.vaState[cardId]) return;
    const valInt = parseInt(val, 10);
    window.vaState[cardId].diasCalculo = isNaN(valInt) ? 0 : valInt;

    if (window.vaDataStore && window.vaDataStore[cardId]) {
        renderizarCardVA(cardId, window.vaDataStore[cardId]);
    }
}

function gerarCalendarioHTML(ano, mesIdx, nomeMes, selectedDays, cardId) {
    const totalDiasMes = new Date(ano, mesIdx + 1, 0).getDate();
    const firstDayOfWeek = new Date(ano, mesIdx, 1).getDay();

    let calHTML = `
        <div id="cal_mes_${cardId}_${ano}_${mesIdx}" style="background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:0.6rem; flex:1; min-width:210px;">
            <div onclick="toggleMesInteiroVA('${cardId}', ${ano}, ${mesIdx})" 
                 style="font-weight:bold; font-size:0.85rem; text-align:center; margin-bottom:0.4rem; color:var(--primary); cursor:pointer; background:#f1f5f9; padding:4px; border-radius:4px; user-select:none;"
                 title="Clique para selecionar/desmarcar todos os dias úteis deste mês">
                ${nomeMes} / ${ano} 🖱️
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
        
        const dateStr = `${ano}-${String(mesIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isSelected = selectedDays.includes(dateStr);

        let bg = "#f8fafc";
        let color = "#64748b";
        let cursor = "pointer";

        if (isWeekend) {
            bg = "#e2e8f0";
            color = "#94a3b8";
            cursor = "default";
        } else if (isSelected) {
            bg = "#dcfce7";
            color = "#166534";
        }

        const clickAttr = !isWeekend ? `onclick="toggleDiaVA('${cardId}', '${dateStr}', this)"` : '';

        calHTML += `
            <div ${clickAttr} data-date="${dateStr}" style="background:${bg}; color:${color}; border:1px solid #cbd5e1; border-radius:3px; padding:4px 2px; font-weight:bold; cursor:${cursor}; font-size:0.75rem; user-select:none;" title="${isWeekend ? 'Fim de semana' : (isSelected ? 'Dia útil selecionado' : 'Dia útil desmarcado')}">
                ${d}
            </div>
        `;
    }

    calHTML += `</div></div>`;
    return calHTML;
}

function gerarCalculoValeAlimentacao(data) {
    const cardId = data.cardId;
    const dAlt = parseDataBR(data.dtalt);

    if (!dAlt) {
        return `<div class="calc-card-item"><h4>VALE ALIMENTAÇÃO</h4><div class="error-msg">Data de Alteração (DTALT) inválida.</div></div>`;
    }

    window.vaDataStore = window.vaDataStore || {};
    window.vaDataStore[cardId] = data;

    const mesesNomes = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

    const anoDtAlt = dAlt.getFullYear();
    const mesDtAltIdx = dAlt.getMonth();

    const dtAnterior = new Date(anoDtAlt, mesDtAltIdx - 1, 1);
    const anoAnterior = dtAnterior.getFullYear();
    const mesAnteriorIdx = dtAnterior.getMonth();

    const dtPosterior = new Date(anoDtAlt, mesDtAltIdx + 1, 1);
    const anoPosterior = dtPosterior.getFullYear();
    const mesPosteriorIdx = dtPosterior.getMonth();

    if (!window.vaState[cardId]) {
        const initialSelectedDays = [];

        for (let d = 1; d <= dAlt.getDate(); d++) {
            const dt = new Date(anoDtAlt, mesDtAltIdx, d);
            const dow = dt.getDay();
            if (dow !== 0 && dow !== 6) {
                initialSelectedDays.push(`${anoDtAlt}-${String(mesDtAltIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
            }
        }

        window.vaState[cardId] = {
            selectedDays: initialSelectedDays,
            rubrica: '619',
            tipoOperacao: 'INCLUSÃO',
            diasCalculo: initialSelectedDays.length
        };
    }

    const state = window.vaState[cardId];
    const valorDiario = 16.96;

    const calAnteriorHTML = gerarCalendarioHTML(anoAnterior, mesAnteriorIdx, mesesNomes[mesAnteriorIdx], state.selectedDays, cardId);
    const calDtAltHTML = gerarCalendarioHTML(anoDtAlt, mesDtAltIdx, mesesNomes[mesDtAltIdx], state.selectedDays, cardId);
    const calPosteriorHTML = gerarCalendarioHTML(anoPosterior, mesPosteriorIdx, mesesNomes[mesPosteriorIdx], state.selectedDays, cardId);

    const is619 = state.rubrica === '619';
    const is412 = state.rubrica === '412';

    const isInclusao = (state.tipoOperacao || 'INCLUSÃO') === 'INCLUSÃO';
    const isAlteracao = state.tipoOperacao === 'ALTERAÇÃO';

    const diasCalc = state.diasCalculo;
    const totalCalcVal = Math.round((diasCalc * valorDiario) * 100) / 100;
    const memoriaStr = `${diasCalc} DIAS X R$ 16,96 = ${formatarMoeda(totalCalcVal)}`;

    const tipoOpText = state.tipoOperacao || 'INCLUSÃO';
    let justificativa = '';
    if (is619) {
        justificativa = `${data.matricula} ${data.nome.toUpperCase()} ${tipoOpText} DE DEVOLUÇÃO DE VALORES REFERENTE AO AUXÍLIO ALIMENTAÇÃO (${memoriaStr}), DEVIDO A RESCISÃO DE CONTRATO EM ${data.dtalt}`;
    } else {
        justificativa = `${data.matricula} ${data.nome.toUpperCase()} ${tipoOpText} DE VALORES A SEREM PAGOS REFERENTE AO AUXÍLIO ALIMENTAÇÃO (${memoriaStr}), DEVIDO A RESCISÃO DE CONTRATO EM ${data.dtalt}`;
    }

    const copyTextId = `copy_text_va_${cardId}`;

    return `
        <div class="calc-card-item">
            <h4>VALE ALIMENTAÇÃO (R$ 16,96 / dia)</h4>
            
            <div style="margin-top:0.5rem; margin-bottom:0.5rem; font-size:0.85rem; display:flex; gap:1rem; align-items:center; background:#e2e8f0; padding:0.5rem; border-radius:4px;">
                <strong>Selecione a Rubrica:</strong>
                <label style="cursor:pointer; display:inline-flex; align-items:center; gap:0.2rem;">
                    <input type="radio" name="radio_rubrica_va_${cardId}" value="619" ${is619 ? 'checked' : ''} onchange="changeRubricaVA('${cardId}', '619')">
                    <strong>619</strong> (Devolução)
                </label>
                <label style="cursor:pointer; display:inline-flex; align-items:center; gap:0.2rem;">
                    <input type="radio" name="radio_rubrica_va_${cardId}" value="412" ${is412 ? 'checked' : ''} onchange="changeRubricaVA('${cardId}', '412')">
                    <strong>412</strong> (Pagamento)
                </label>
            </div>

            <div style="font-size:0.75rem; color:#b45309; background:#fffbeb; border:1px solid #fcd34d; padding:0.4rem; border-radius:4px; margin-bottom:0.5rem;">
                ⚠️ <strong>Aviso:</strong> Confira os dias úteis a serem pagos. Clique no nome do mês para selecionar/desmarcar todos os dias úteis.
            </div>

            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                ${calAnteriorHTML}
                ${calDtAltHTML}
                ${calPosteriorHTML}
            </div>

            <div style="margin-top:0.75rem; background:#f0fdf4; border:1px solid #bbf7d0; padding:0.75rem; border-radius:6px;">
                <label style="font-size:0.85rem; font-weight:bold; color:var(--text-main); display:block; margin-bottom:0.3rem;">
                    Quantidade de dias a serem calculados (${is619 ? 'Devolução - Rubrica 619' : 'Pagamento - Rubrica 412'}):
                </label>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <input type="number" id="input_dias_va_${cardId}" value="${diasCalc}" placeholder="0" min="0" max="93" style="width:80px; padding:0.4rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.9rem; font-weight:bold;" oninput="updateDiasVA('${cardId}', this.value)">
                    <span style="font-size:0.85rem; font-weight:bold; color:var(--text-dark);">
                        dias &times; R$ 16,96 = <span id="total_va_display_${cardId}" style="color:var(--primary); font-size:1rem;">${formatarMoeda(totalCalcVal)}</span>
                    </span>
                </div>
            </div>

            <div style="margin-top:0.5rem; font-size:0.85rem; display:flex; gap:1rem; align-items:center; background:#e2e8f0; padding:0.5rem; border-radius:4px;">
                <strong>Tipo de Operação:</strong>
                <label style="cursor:pointer; display:inline-flex; align-items:center; gap:0.2rem;">
                    <input type="radio" name="radio_tipo_op_${cardId}" value="INCLUSÃO" ${isInclusao ? 'checked' : ''} onchange="changeTipoOperacaoVA('${cardId}', 'INCLUSÃO')">
                    <strong>INCLUSÃO</strong>
                </label>
                <label style="cursor:pointer; display:inline-flex; align-items:center; gap:0.2rem;">
                    <input type="radio" name="radio_tipo_op_${cardId}" value="ALTERAÇÃO" ${isAlteracao ? 'checked' : ''} onchange="changeTipoOperacaoVA('${cardId}', 'ALTERAÇÃO')">
                    <strong>ALTERAÇÃO</strong>
                </label>
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