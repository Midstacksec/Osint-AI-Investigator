let lastReportHtml = "";

async function investigate() {
  const email = document.getElementById("email").value.trim();
  const resultDiv = document.getElementById("result");

  if (!email) {
    resultDiv.innerHTML = `
      <div class="result-card">
        <div class="result-inner">
          <p style="color:#f97373">Por favor, digite um e-mail válido.</p>
        </div>
      </div>`;
    return;
  }

  resultDiv.innerHTML = `
    <div class="result-card">
      <div class="result-inner">
        <p>Investigando <b>${email}</b>...</p>
        <div style="margin-top:8px; display:flex; align-items:center; gap:8px;">
          <div class="spinner"></div>
          <span>Consultando fontes OSINT e gerando relatório...</span>
        </div>
      </div>
    </div>
  `;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/investigate?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      throw new Error(`Erro da API: ${response.status}`);
    }

    const data = await response.json();
    const osint = data.data || {};

    let badgeClass = "badge-low";
    let badgeLabel = "Low Risk";

    if (data.risk_score >= 7) {
      badgeClass = "badge-high";
      badgeLabel = "High Risk";
    } else if (data.risk_score >= 4) {
      badgeClass = "badge-medium";
      badgeLabel = "Medium Risk";
    }

    const html = `
      <div class="result-card" id="report-card">
        <div class="result-inner">
          <h2>Investigation Result</h2>
          <p><strong>Target:</strong> ${data.target}</p>
          <p>
            <strong>Risk Score:</strong> ${data.risk_score}/10
            <span class="badge ${badgeClass}">${badgeLabel}</span>
          </p>

          <h3>Findings</h3>
          <p>Breaches: <b>${osint.breaches}</b></p>
          <p>Gravatar: <b>${osint.gravatar}</b></p>
          <p>Github: <b>${osint.github}</b></p>

          <h3>Report</h3>
          <pre>${data.report}</pre>
        </div>
      </div>
    `;

    resultDiv.innerHTML = html;
    lastReportHtml = html;
  } catch (err) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
      <div class="result-card">
        <div class="result-inner">
          <p style="color:#f97373">Erro ao consultar a API: ${err.message}</p>
        </div>
      </div>
    `;
  }
}

function downloadPDF() {
  if (!lastReportHtml) {
    alert("Faça uma investigação antes de gerar o PDF.");
    return;
  }

  const win = window.open("", "_blank");
  win.document.write(`
    <html>
      <head>
        <title>OSINT Investigation Report</title>
        <style>
          body { font-family: system-ui, sans-serif; background:#111827; color:#e5e7eb; padding:20px; }
          .result-card { background:#020617; border-radius:16px; padding:24px 28px; border:1px solid #1f2937; }
          .result-inner { max-width:720px; margin:0 auto; }
          pre { white-space: pre-wrap; font-family: "JetBrains Mono","Fira Code", monospace; font-size:13px;
                background:#020617; padding:12px 14px; border-radius:12px; border:1px solid #111827; }
        </style>
      </head>
      <body>
        ${lastReportHtml}
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
}
