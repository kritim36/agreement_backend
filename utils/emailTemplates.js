function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function applyTemplate(template, vars) {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => escapeHtml(vars[key] ?? ''));
}

export function buildConsentConfirmationEmail({ submission, siteContent, viewUrl }) {
  const { brand, feeStructure, footerTagline, email } = siteContent;

  const milestoneRows = feeStructure.milestones
    .map(
      (m) => `
        <tr>
          <td style="padding:6px 10px;border:1px solid #ddd;">${m.stage}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;">${m.amount}</td>
        </tr>`
    )
    .join('');

  const greetingHtml = applyTemplate(email.greetingText, { fullName: submission.fullName });

  const html = `
    <div style="font-family:Arial,sans-serif;color:#0a1a2f;max-width:600px;margin:0 auto;">
      <h2 style="color:#0a1a2f;">${brand.companyName}</h2>
      <p style="white-space:pre-line;">${greetingHtml}</p>

      <h3 style="margin-bottom:4px;">Submitted Details</h3>
      <table style="border-collapse:collapse;width:100%;margin:10px 0 20px;">
        <tbody>
          <tr>
            <td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold;">Full Name</td>
            <td style="padding:6px 10px;border:1px solid #ddd;">${escapeHtml(submission.fullName)}</td>
          </tr>
          <tr>
            <td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold;">Mobile Number</td>
            <td style="padding:6px 10px;border:1px solid #ddd;">${escapeHtml(submission.mobileNumber)}</td>
          </tr>
          <tr>
            <td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold;">Email</td>
            <td style="padding:6px 10px;border:1px solid #ddd;">${escapeHtml(submission.email)}</td>
          </tr>
          <tr>
            <td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold;">Desired Program</td>
            <td style="padding:6px 10px;border:1px solid #ddd;">${escapeHtml(submission.desiredProgram)}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-bottom:4px;">Agreement Summary</h3>
      <p style="margin-top:0;"><strong>${feeStructure.totalChargeLabel}:</strong> ${feeStructure.totalChargeAmount}</p>
      <table style="border-collapse:collapse;width:100%;margin:10px 0;">
        <thead>
          <tr>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">Installment</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">${feeStructure.milestoneColumnLabel}</th>
          </tr>
        </thead>
        <tbody>${milestoneRows}</tbody>
      </table>
      <p style="font-size:12px;color:#555;">${feeStructure.refundNote}</p>

      <h3 style="margin-bottom:4px;">Video Consent</h3>
      <p style="white-space:pre-line;">${email.videoConsentText}</p>
      <p>
        <a href="${viewUrl}" style="display:inline-block;padding:10px 16px;background:#0a1a2f;color:#fff;text-decoration:none;border-radius:6px;">
          ${email.buttonText}
        </a>
      </p>

      <p style="margin-top:24px;font-size:12px;color:#777;">${footerTagline}</p>
    </div>
  `;

  return { subject: email.subject, html };
}
