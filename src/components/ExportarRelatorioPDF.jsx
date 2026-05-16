// components/ExportarRelatorioPDF.jsx
import html2pdf from 'html2pdf.js';
import SimsLogo from '../assets/SIMS_logo_branca.png'
import ViicLogo from '../assets/viic_logo_branca.png'

const ExportarRelatorioPDF = () => {
    const gerarRelatorioPDF = () => {
        // Criar um elemento temporário para o relatório
        const relatorioElement = document.createElement('div');

        // Dentro da função gerarRelatorioPDF, use este HTML otimizado para A4:

        relatorioElement.innerHTML = `
        <div style="
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            width: 210mm;
            min-height: auto;
            margin: 0 auto;
            padding: 12mm;
            background: #F4F4FF;
            box-sizing: border-box;
        ">
            <div style="
            text-align: center;
            margin-bottom: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #0A1E3F 0%, #000c1f 100%);
            border-radius: 8px;
            color: white;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            ">
            <img src=${SimsLogo} alt="SIMS Logo" style="height: 50px; width: auto;" />
            
            <div style="flex: 1; text-align: center;">
                <h1 style="
                font-size: 24px;
                margin: 0 0 8px 0;
                font-weight: 700;
                ">
                RELATÓRIO DE OCORRÊNCIAS SIMS
                </h1>
                <p style="
                font-size: 11px;
                margin: 0;
                opacity: 0.9;
                ">
                Sistema Inteligente de Monitoramento e Segurança
                </p>
                <p style="
                font-size: 10px;
                margin: 10px 0 0 0;
                opacity: 0.8;
                ">
                ${new Date().toLocaleDateString('pt-BR')} • ${new Date().toLocaleTimeString('pt-BR')}
                </p>
            </div>
            
            <img src=${ViicLogo} alt="VIIC Logo" style="height: 50px; width: auto;" />
            </div>

            <!-- Cards de Métricas (2 colunas para economizar espaço) -->
            <div style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 20px;
            ">
            <div style="
                background: white;
                padding: 12px;
                border-radius: 6px;
                border-left: 3px solid #0A1E3F;
            ">
                <div style="color: #727376; font-size: 10px; margin-bottom: 4px;">TOTAL HOJE</div>
                <div style="color: #0A1E3F; font-size: 24px; font-weight: bold;">27</div>
            </div>
            
            <div style="
                background: white;
                padding: 12px;
                border-radius: 6px;
                border-left: 3px solid #0A1E3F;
            ">
                <div style="color: #727376; font-size: 10px; margin-bottom: 4px;">TAXA DE CONFORMIDADE</div>
                <div style="color: #0A1E3F; font-size: 24px; font-weight: bold;">91.23%</div>
            </div>
            
            <div style="
                background: white;
                padding: 12px;
                border-radius: 6px;
                border-left: 3px solid #0A1E3F;
            ">
                <div style="color: #727376; font-size: 10px; margin-bottom: 4px;">CÂMERA CRÍTICA</div>
                <div style="color: #0A1E3F; font-size: 24px; font-weight: bold;">CAM03</div>
            </div>
            
            <div style="
                background: white;
                padding: 12px;
                border-radius: 6px;
                border-left: 3px solid #0A1E3F;
            ">
                <div style="color: #727376; font-size: 10px; margin-bottom: 4px;">FALSOS POSITIVOS</div>
                <div style="color: #0A1E3F; font-size: 24px; font-weight: bold;">4</div>
            </div>
            </div>

            <!-- Distribuição por Câmera e Ocorrências por Tipo (lado a lado) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
            <!-- Distribuição por Câmera -->
            <div style="background: white; padding: 12px; border-radius: 6px;">
                <h3 style="color: #0A1E3F; font-size: 13px; margin: 0 0 10px 0; font-weight: 600;">
                Distribuição por Câmera
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
                <thead>
                    <tr style="background: #D4DBED;">
                    <th style="padding: 6px; text-align: left; color: #0A1E3F;">Câmera</th>
                    <th style="padding: 6px; text-align: center; color: #0A1E3F;">Ocorr.</th>
                    <th style="padding: 6px; text-align: right; color: #0A1E3F;">%</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid #D4DBED;">
                    <td style="padding: 5px; color: #727376;">CAM01</td>
                    <td style="padding: 5px; text-align: center; color: #727376;">3</td>
                    <td style="padding: 5px; text-align: right; color: #727376;">15%</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #D4DBED;">
                    <td style="padding: 5px; color: #727376;">CAM02</td>
                    <td style="padding: 5px; text-align: center; color: #727376;">6</td>
                    <td style="padding: 5px; text-align: right; color: #727376;">30%</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #D4DBED;">
                    <td style="padding: 5px; color: #727376;">CAM03</td>
                    <td style="padding: 5px; text-align: center; color: #727376;">7</td>
                    <td style="padding: 5px; text-align: right; color: #727376;">35%</td>
                    </tr>
                    <tr>
                    <td style="padding: 5px; color: #727376;">CAM04</td>
                    <td style="padding: 5px; text-align: center; color: #727376;">4</td>
                    <td style="padding: 5px; text-align: right; color: #727376;">20%</td>
                    </tr>
                </tbody>
                </table>
            </div>

            <!-- Ocorrências por Tipo -->
            <div style="background: white; padding: 12px; border-radius: 6px;">
                <h3 style="color: #0A1E3F; font-size: 13px; margin: 0 0 10px 0; font-weight: 600;">
                Ocorrências por Tipo de EPI
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
                <thead>
                    <tr style="background: #D4DBED;">
                    <th style="padding: 6px; text-align: left; color: #0A1E3F;">Tipo de EPI</th>
                    <th style="padding: 6px; text-align: center; color: #0A1E3F;">Quant.</th>
                    <th style="padding: 6px; text-align: right; color: #0A1E3F;">%</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid #D4DBED;">
                    <td style="padding: 5px; color: #727376;">Capacete</td>
                    <td style="padding: 5px; text-align: center; color: #727376;">3</td>
                    <td style="padding: 5px; text-align: right; color: #727376;">12%</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #D4DBED;">
                    <td style="padding: 5px; color: #727376;">Óculos</td>
                    <td style="padding: 5px; text-align: center; color: #727376;">12</td>
                    <td style="padding: 5px; text-align: right; color: #727376;">48%</td>
                    </tr>
                    <tr>
                    <td style="padding: 5px; color: #727376;">Luvas</td>
                    <td style="padding: 5px; text-align: center; color: #727376;">10</td>
                    <td style="padding: 5px; text-align: right; color: #727376;">40%</td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>

            <!-- Ocorrências por Horário -->
            <div style="background: white; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #0A1E3F; font-size: 13px; margin: 0 0 10px 0; font-weight: 600;">
                Ocorrências por Horário
            </h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 9px;">
                <thead>
                <tr style="background: #D4DBED;">
                    <th style="padding: 6px; text-align: center; color: #0A1E3F;">07:00</th>
                    <th style="padding: 6px; text-align: center; color: #0A1E3F;">08:00</th>
                    <th style="padding: 6px; text-align: center; color: #0A1E3F;">09:00</th>
                    <th style="padding: 6px; text-align: center; color: #0A1E3F;">10:00</th>
                    <th style="padding: 6px; text-align: center; color: #0A1E3F;">11:00</th>
                    <th style="padding: 6px; text-align: center; color: #0A1E3F;">12:00</th>
                    <th style="padding: 6px; text-align: center; color: #0A1E3F;">13:00</th>
                    <th style="padding: 6px; text-align: center; color: #0A1E3F;">14:00</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td style="padding: 6px; text-align: center; background: #0A1E3F; color: white; font-weight: bold;">3</td>
                    <td style="padding: 6px; text-align: center; background: #D4DBED; color: #0A1E3F;">0</td>
                    <td style="padding: 6px; text-align: center; background: #D4DBED; color: #0A1E3F;">2</td>
                    <td style="padding: 6px; text-align: center; background: #0A1E3F; color: white; font-weight: bold;">4</td>
                    <td style="padding: 6px; text-align: center; background: #D4DBED; color: #0A1E3F;">0</td>
                    <td style="padding: 6px; text-align: center; background: #D4DBED; color: #0A1E3F;">1</td>
                    <td style="padding: 6px; text-align: center; background: #D4DBED; color: #0A1E3F;">1</td>
                    <td style="padding: 6px; text-align: center; background: #D4DBED; color: #0A1E3F;">3</td>
                </tr>
                </tbody>
            </table>
            <p style="margin: 8px 0 0 0; font-size: 9px; color: #727376; text-align: center;">
                Horário de pico: 10:00 (4 ocorrências)
            </p>
            </div>

            <!-- Análise Estatística em grid compacta -->
            <div style="background: white; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #0A1E3F; font-size: 13px; margin: 0 0 10px 0; font-weight: 600;">
                Análise Estatística
            </h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <div>
                <div style="color: #727376; font-size: 9px;">Média diária</div>
                <div style="color: #0A1E3F; font-size: 14px; font-weight: 600;">17</div>
                </div>
                <div>
                <div style="color: #727376; font-size: 9px;">Total esta semana</div>
                <div style="color: #0A1E3F; font-size: 14px; font-weight: 600;">29</div>
                </div>
                <div>
                <div style="color: #727376; font-size: 9px;">Média semanal</div>
                <div style="color: #0A1E3F; font-size: 14px; font-weight: 600;">23</div>
                </div>
                <div>
                <div style="color: #727376; font-size: 9px;">Tempo médio sem EPI</div>
                <div style="color: #0A1E3F; font-size: 14px; font-weight: 600;">2m23s</div>
                </div>
                <div>
                <div style="color: #727376; font-size: 9px;">EPI mais crítico</div>
                <div style="color: #0A1E3F; font-size: 14px; font-weight: 600;">Óculos</div>
                </div>
                <div>
                <div style="color: #727376; font-size: 9px;">Câmera crítica</div>
                <div style="color: #0A1E3F; font-size: 14px; font-weight: 600;">CAM03</div>
                </div>
            </div>
            </div>

            <!-- Últimas Ocorrências (limitado a 5 para caber na página) -->
            <div style="background: white; padding: 12px; border-radius: 6px;">
            <h3 style="color: #0A1E3F; font-size: 13px; margin: 0 0 10px 0; font-weight: 600;">
                Últimas Ocorrências
            </h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 9px;">
                <thead>
                <tr style="background: #D4DBED;">
                    <th style="padding: 6px; text-align: left; color: #0A1E3F;">Data/Hora</th>
                    <th style="padding: 6px; text-align: left; color: #0A1E3F;">Câmera</th>
                    <th style="padding: 6px; text-align: left; color: #0A1E3F;">EPI</th>
                </tr>
                </thead>
                <tbody>
                <tr style="border-bottom: 1px solid #D4DBED;">
                    <td style="padding: 5px; color: #727376;">24/02 10:33</td>
                    <td style="padding: 5px; color: #727376;">CAM03</td>
                    <td style="padding: 5px; color: #727376;">Capacete</td>
                </tr>
                <tr style="border-bottom: 1px solid #D4DBED;">
                    <td style="padding: 5px; color: #727376;">24/02 10:40</td>
                    <td style="padding: 5px; color: #727376;">CAM02</td>
                    <td style="padding: 5px; color: #727376;">Luvas</td>
                </tr>
                <tr style="border-bottom: 1px solid #D4DBED;">
                    <td style="padding: 5px; color: #727376;">24/02 11:02</td>
                    <td style="padding: 5px; color: #727376;">CAM01</td>
                    <td style="padding: 5px; color: #727376;">Óculos</td>
                </tr>
                <tr style="border-bottom: 1px solid #D4DBED;">
                    <td style="padding: 5px; color: #727376;">24/02 14:22</td>
                    <td style="padding: 5px; color: #727376;">CAM01</td>
                    <td style="padding: 5px; color: #727376;">Capacete</td>
                </tr>
                <tr>
                    <td style="padding: 5px; color: #727376;">24/02 15:10</td>
                    <td style="padding: 5px; color: #727376;">CAM02</td>
                    <td style="padding: 5px; color: #727376;">Óculos</td>
                </tr>
                </tbody>
            </table>
            </div>

            <!-- Rodapé -->
            <div style="
            text-align: center;
            padding: 12px;
            margin-top: 10px;
            border-top: 1px solid #D4DBED;
            color: #727376;
            font-size: 8px;
            page-break-inside: avoid;
            ">
            <p>Relatório gerado automaticamente pelo Sistema de Detecção de EPIs</p>
            </div>
        `;

        // Adicionar ao body temporariamente
        document.body.appendChild(relatorioElement);

        // Configurações do PDF
        const opt = {
            margin: [0.0, 0.0, 0.0, 0.0],
            filename: `relatorio_vendas_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                letterRendering: true,
                useCORS: true,
                logging: false
            },
            jsPDF: {
                unit: 'in',
                format: 'a4',
                orientation: 'portrait'
            }
        };

        // Gerar PDF
        html2pdf().set(opt).from(relatorioElement).save().then(() => {
            // Remover elemento temporário após gerar
            document.body.removeChild(relatorioElement);
        });
    };

    return (
        <button
            onClick={gerarRelatorioPDF}
        >
            Exportar Relatório PDF
        </button>
    );
};

export default ExportarRelatorioPDF;