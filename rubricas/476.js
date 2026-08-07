function gerarCalculo476(data, valorPVR, tipoLancamento = 'INCLUSÃO', bloqueado = false, numFolha = '', duasDiferencas = false) {
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

    // Mês da alteração
    const diasNoMesAlt = (mesAlt > 0 && anoAlt > 0) ? new Date(anoAlt, mesAlt, 0).getDate() : 30;
    const valorDiaAlt = valorPVR / diasNoMesAlt;
    const totalMesAlt = valorDiaAlt * diaAlt;

    let valorTotalFinal = totalMesAlt;
    let htmlDetalhesCalculo = '';
    let stringCalculosTexto = '';

    // Data Inicial para duas diferenças
    const dtIniStr = data.dtinialt || data.dtini || '';
    const partesIni = dtIniStr.split('/');
    let diaIni = 0;
    let mesIni = 0;
    let anoIni = 0;

    if (partesIni.length === 3) {
        diaIni = parseInt(partesIni[0], 10) || 0;
        mesIni = parseInt(partesIni[1], 10) || 0;
        anoIni = parseInt(partesIni[2], 10) || 0;
    }

    if (duasDiferencas) {
        let mesAnt = mesAlt - 1;
        let anoAnt = anoAlt;
        if (mesAnt === 0) {
            mesAnt = 12;
            anoAnt -= 1;
        }

        const diasNoMesAnt = new Date(anoAnt, mesAnt, 0).getDate();
        const diasTrabalhadosAnt = (diasNoMesAnt - diaIni) + 1;
        const valorDiaAnt = valorPVR / diasNoMesAnt;
        const totalMesAnt = valorDiaAnt * diasTrabalhadosAnt;

        valorTotalFinal = totalMesAnt + totalMesAlt;

        const exprAnt = `(R$ ${valorPVR.toFixed(2).replace('.', ',')} / ${diasNoMesAnt} dias * ${diasTrabalhadosAnt} dias = R$ ${totalMesAnt.toFixed(2).replace('.', ',')})`;
        const exprAlt = `(R$ ${valorPVR.toFixed(2).replace('.', ',')} / ${diasNoMesAlt} dias * ${diaAlt} dias = R$ ${totalMesAlt.toFixed(2).replace('.', ',')})`;

        stringCalculosTexto = `${exprAnt} + ${exprAlt} = R$ ${valorTotalFinal.toFixed(2).replace('.', ',')}`;

        htmlDetalhesCalculo = `
            • <strong>Mês Anterior (${mesAnt.toString().padStart(2, '0')}/${anoAnt}):</strong> R$ ${valorPVR.toFixed(2).replace('.', ',')} / ${diasNoMesAnt} dias * ${diasTrabalhadosAnt} dias = <strong>R$ ${totalMesAnt.toFixed(2).replace('.', ',')}</strong><br>
            • <strong>Mês Atual (${mesAlt.toString().padStart(2, '0')}/${anoAlt}):</strong> R$ ${valorPVR.toFixed(2).replace('.', ',')} / ${diasNoMesAlt} dias * ${diaAlt} dias = <strong>R$ ${totalMesAlt.toFixed(2).replace('.', ',')}</strong><br>
            • <strong>Cálculo Total:</strong> ${stringCalculosTexto}
        `;
    } else {
        stringCalculosTexto = `(R$ ${valorPVR.toFixed(2).replace('.', ',')} / ${diasNoMesAlt} dias * ${diaAlt} dias = R$ ${valorTotalFinal.toFixed(2).replace('.', ',')})`;

        htmlDetalhesCalculo = `
            • <strong>Mês de Referência (${mesAlt.toString().padStart(2, '0')}/${anoAlt}):</strong> ${diasNoMesAlt} dias<br>
            • <strong>PVR Integral:</strong> R$ ${valorPVR.toFixed(2).replace('.', ',')}<br>
            • <strong>Cálculo Proporcional:</strong> R$ ${valorPVR.toFixed(2).replace('.', ',')} / ${diasNoMesAlt} dias * ${diaAlt} dias = <strong>R$ ${valorTotalFinal.toFixed(2).replace('.', ',')}</strong>
        `;
    }

    // Bloqueio
    let complementoBloqueio = '';
    if (bloqueado) {
        complementoBloqueio = numFolha.trim() !== '' 
            ? ` PAGAMENTO BLOQUEADO NA FOLHA ${numFolha.trim()}` 
            : ' PAGAMENTO BLOQUEADO NA FOLHA';
    }

    // Montagem do texto base
    let textoCopia = '';
    if (duasDiferencas) {
        textoCopia = `${matricula} ${nome} ${textoLancamento} DE PAGAMENTO DE VALORES SOMADOS DO MÊS CORRENTE E ANTERIOR DE DIFERENÇAS REFERENTE A PVR (CALCULOS EM ANEXO: ${stringCalculosTexto}), DEVIDO RESCISÃO DE CONTRATO EM ${data.dtalt}${complementoBloqueio}`;
    } else {
        textoCopia = `${matricula} ${nome} ${textoLancamento} DE PAGAMENTO DE DIFERENÇAS REFERENTE A PVR (${stringCalculosTexto}), DEVIDO RESCISÃO DE CONTRATO EM ${data.dtalt}${complementoBloqueio}`;
    }

    return `
        <div class="calc-card-item">
            <h4>RUBRICA 476 - DIFERENÇA DE PVR</h4>

            <div class="diferencas-selector" style="margin-bottom: 0.5rem; background: #f8fafc; padding: 0.4rem; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 0.85rem;">
                <label style="cursor: pointer; font-weight: 600; color: #0f172a; display: inline-flex; align-items: center; gap: 0.4rem;">
                    <input type="checkbox" id="chk_diferencas_476_${data.cardId}" ${duasDiferencas ? 'checked' : ''} onchange="atualizarDiferencas321_476('${data.cardId}', '476')"> DIFERENÇAS (Somar mês corrente + mês anterior)
                </label>
            </div>

            <div class="calc-details">
                ${htmlDetalhesCalculo}
            </div>

            <div class="lancamento-selector" style="margin: 0.75rem 0; font-size: 0.85rem; background: #ffffff; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;">
                <strong style="display:block; margin-bottom: 0.3rem; color: var(--text-dark);">Tipo de Lançamento:</strong>
                <label style="margin-right: 15px; cursor: pointer; font-weight: 500;">
                    <input type="radio" name="tipo_476_${data.cardId}" value="INCLUSÃO" ${tipoLancamento === 'INCLUSÃO' ? 'checked' : ''} onchange="recalcularRubricaEspecifica('${data.cardId}', '476', this.value)"> INCLUSÃO
                </label>
                <label style="cursor: pointer; font-weight: 500;">
                    <input type="radio" name="tipo_476_${data.cardId}" value="ALTERAÇÃO" ${tipoLancamento === 'ALTERAÇÃO' ? 'checked' : ''} onchange="recalcularRubricaEspecifica('${data.cardId}', '476', this.value)"> ALTERAÇÃO
                </label>
            </div>

            <div class="folha-selector" style="margin: 0.75rem 0; font-size: 0.85rem; background: #ffffff; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;">
                <strong style="display:block; margin-bottom: 0.3rem; color: var(--text-dark);">Situação no Folha/Multipag:</strong>
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    <label style="cursor: pointer; font-weight: 500; display: inline-flex; align-items: center; gap: 0.3rem;">
                        <input type="checkbox" id="chk_bloqueio_476_${data.cardId}" ${bloqueado ? 'checked' : ''} onchange="atualizarBloqueioFolha('${data.cardId}', '476')"> BLOQUEIO DE PAGAMENTO REALIZADO NA FOLHA
                    </label>
                    <input type="text" id="num_folha_476_${data.cardId}" placeholder="Nº da folha" value="${numFolha}" style="padding: 0.2rem 0.4rem; font-size: 0.8rem; border: 1px solid #cbd5e1; border-radius: 4px; width: 100px;" oninput="atualizarBloqueioFolha('${data.cardId}', '476')">
                </div>
            </div>

            <div class="copy-box-container">
                <div class="copy-box-text" id="text_476_${data.cardId}">${textoCopia}</div>
                <button class="btn-copy" onclick="copiarTexto('text_476_${data.cardId}')">📋 Copiar Texto</button>
            </div>
        </div>
    `;
}