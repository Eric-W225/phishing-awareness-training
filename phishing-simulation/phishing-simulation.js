/**
 * ============================================================================
 * PHISHING SIMULATION — EDUCATIONAL USE ONLY
 * ============================================================================
 *
 * Simulates a fake IRS phishing email inside a mock email client for
 * cybersecurity awareness training. No form data is stored or transmitted.
 *
 * TO MODIFY THE SCAM SCENARIO:
 *   Edit the SCENARIO object below.
 *
 * TO SEND TO A REAL INBOX (authorized training only):
 *   Use "Send to Email" in the header. Prefer EmailJS for one-click send,
 *   or download a .eml file and send from your mail app.
 * ============================================================================
 */

(function () {
  'use strict';

  const EMAILJS_STORAGE_KEY = 'phishing-sim-emailjs-config';

  // --------------------------------------------------------------------------
  // SCENARIO CONFIG — modify this block to create different scam simulations
  // --------------------------------------------------------------------------

  const SCENARIO = {
    inbox: {
      senderName: 'IRS Tax Refund Dept.',
      subject: 'URGENT: Your Tax Refund of $847.00 Is Pending — Action Required Within 48 Hours',
      preview: 'Dear Taxpayer, We have determined that you are eligible for an unclaimed refund...',
      date: 'Today, 6:42 AM',
    },

    header: {
      senderDisplayName: 'IRS Tax Refund Department',
      // Suspicious look-alike domain — NOT a real IRS address (red flag)
      senderEmail: 'refunds-notice@irs-refunds-example.com',
      recipient: 'you@example.com',
      date: 'Friday, July 31, 2026 at 6:42 AM',
      subject: 'URGENT: Your Tax Refund of $847.00 Is Pending — Action Required Within 48 Hours',
    },

    cta: {
      label: 'Claim Your Refund Now',
      href: 'https://irs-refunds-example.com/verify-account',
    },

    secondaryLink: {
      label: 'verify your account immediately',
      href: 'https://irs-refunds-example.com/account-update',
    },

    warningSigns: [
      {
        title: 'Sense of urgency',
        detail: 'The subject line and body demand action "within 48 hours" to pressure you into clicking without thinking.',
      },
      {
        title: 'Suspicious sender address',
        detail: 'The email comes from "irs-refunds-example.com" — not the official "@irs.gov" domain.',
      },
      {
        title: 'Unsolicited refund claim',
        detail: 'The IRS does not email taxpayers about unexpected refunds. Real refund status is checked at irs.gov.',
      },
      {
        title: 'Threat of account suspension',
        detail: 'Scammers threaten penalties or account closure to create fear and bypass your judgment.',
      },
      {
        title: 'Request for personal information',
        detail: 'The message asks you to "verify" your Social Security number and banking details via a link.',
      },
      {
        title: 'Awkward or unnatural wording',
        detail: 'Phrases like "Dear Taxpayer" and "failure to comply will result in permanent suspension" are generic and overly formal.',
      },
      {
        title: 'Fake call-to-action button',
        detail: 'The "Claim Your Refund Now" button leads to a fraudulent site designed to steal your credentials.',
      },
      {
        title: 'Fraudulent data collection form',
        detail: 'The fake verification page asked for your SSN, bank account, and personal details — information the real IRS never requests via email links.',
      },
    ],
  };

  // --------------------------------------------------------------------------
  // Email body builders
  // --------------------------------------------------------------------------

  function buildEmailBodyHTML(options) {
    const opts = options || {};
    const ctaHref = opts.ctaHref || SCENARIO.cta.href;
    const secondaryHref = opts.secondaryHref || SCENARIO.secondaryLink.href;
    const privacyHref = opts.privacyHref || 'https://irs-refunds-example.com/privacy';
    const interactive = opts.interactive !== false;
    const triggerAttr = interactive ? ' data-phish-trigger="true"' : '';
    const { cta, secondaryLink } = SCENARIO;

    return `
      <div class="phish-banner" style="background:#1e3a5f;color:#fff;padding:14px 18px;border-radius:8px;margin-bottom:20px;text-align:center;">
        <h2 style="margin:0;font-size:1.1rem;">Internal Revenue Service — Refund Notification</h2>
      </div>

      <p>Dear Taxpayer,</p>

      <p>
        We have reviewed your tax records and have determined that you are eligible
        for an <strong>unclaimed tax refund of $847.00</strong>. This refund has been
        pending in our system and requires your immediate attention to be processed.
      </p>

      <div class="urgency-box" style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;margin:18px 0;font-weight:600;color:#92400e;">
        ⚠️ URGENT: Your tax account has been flagged for verification. You must
        complete the verification process within <strong>48 hours</strong> or your
        account will be suspended and your refund forfeited.
      </div>

      <p>
        Due to recent updates to our security protocols, all taxpayers must
        re-confirm their identity before any refund can be issued. This is a
        one-time verification required by federal regulation.
      </p>

      <p>
        To claim your refund, please click the button below and provide the following
        information for verification purposes:
      </p>

      <ul>
        <li>Full legal name and date of birth</li>
        <li>Social Security Number (last 4 digits minimum)</li>
        <li>Current mailing address</li>
        <li>Bank account or debit card number for direct deposit</li>
      </ul>

      <p style="text-align: center;">
        <a
          class="phish-cta"
          href="${ctaHref}"
          ${triggerAttr}
          role="button"
          style="display:inline-block;margin:20px 0;padding:14px 32px;font-size:1rem;font-weight:700;color:#fff;background:#1d4ed8;border-radius:6px;text-decoration:none;"
        >${cta.label}</a>
      </p>

      <p>
        If you do not ${secondaryLink.label} by the deadline, your tax account
        will be permanently suspended and you may face additional penalties
        including delayed future refunds and possible audit review.
      </p>

      <p class="typo-note">
        Please do not reply to this email as this mailbox is not monitored.
        For assitance, contact our refund processing center through the link above.
      </p>

      <p>
        Thank you for your prompt cooperation,<br>
        <strong>IRS Refund Processing Unit</strong><br>
        U.S. Department of the Treasury
      </p>

      <div class="phish-footer" style="margin-top:28px;padding-top:16px;border-top:1px solid #d1d5db;font-size:0.78rem;color:#6b7280;">
        <p>
          This message was sent to you because your email address is associated
          with a taxpayer account. Reference ID: IRS-RFD-2026-${Math.floor(Math.random() * 90000 + 10000)}.
          <br>
          © 2026 Internal Revenue Service. All rights reserved.
          <br>
          <a class="phish-link" href="${secondaryHref}"${triggerAttr}>Unsubscribe</a> |
          <a class="phish-link" href="${privacyHref}"${triggerAttr}>Privacy Policy</a>
        </p>
      </div>
    `;
  }

  /** HTML email for real inboxes — links open the training page verification step */
  function buildOutboundEmailHTML(simulationUrl) {
    const entryUrl = appendQuery(simulationUrl, 'entry', 'email');
    return `
      <div style="font-family:Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;max-width:600px;margin:0 auto;">
        ${buildEmailBodyHTML({
          ctaHref: entryUrl,
          secondaryHref: entryUrl,
          privacyHref: entryUrl,
          interactive: false,
        })}
      </div>
    `;
  }

  function appendQuery(url, key, value) {
    try {
      const parsed = new URL(url, window.location.href);
      parsed.searchParams.set(key, value);
      return parsed.toString();
    } catch (error) {
      const joiner = url.includes('?') ? '&' : '?';
      return `${url}${joiner}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
  }

  // --------------------------------------------------------------------------
  // DOM references
  // --------------------------------------------------------------------------

  const elements = {
    inboxList: document.getElementById('inboxList'),
    emailSubject: document.getElementById('emailSubject'),
    senderDisplay: document.getElementById('senderDisplay'),
    senderEmail: document.getElementById('senderEmail'),
    recipientDisplay: document.getElementById('recipientDisplay'),
    emailDate: document.getElementById('emailDate'),
    emailBody: document.getElementById('emailBody'),
    verificationOverlay: document.getElementById('verificationOverlay'),
    verificationForm: document.getElementById('verificationForm'),
    educationOverlay: document.getElementById('educationOverlay'),
    warningSignsList: document.getElementById('warningSignsList'),
    tryAgainBtn: document.getElementById('tryAgainBtn'),
    trainingApp: document.getElementById('trainingApp'),
    sendToggleBtn: document.getElementById('sendToggleBtn'),
    sendPanel: document.getElementById('sendPanel'),
    sendTrainingForm: document.getElementById('sendTrainingForm'),
    recipientEmail: document.getElementById('recipientEmail'),
    simulationLink: document.getElementById('simulationLink'),
    consentCheck: document.getElementById('consentCheck'),
    emailjsPublicKey: document.getElementById('emailjsPublicKey'),
    emailjsServiceId: document.getElementById('emailjsServiceId'),
    emailjsTemplateId: document.getElementById('emailjsTemplateId'),
    downloadEmlBtn: document.getElementById('downloadEmlBtn'),
    sendStatus: document.getElementById('sendStatus'),
    sendEmailBtn: document.getElementById('sendEmailBtn'),
  };

  // --------------------------------------------------------------------------
  // Render functions
  // --------------------------------------------------------------------------

  function renderInbox() {
    const { inbox } = SCENARIO;
    elements.inboxList.innerHTML = `
      <li class="inbox-item active" role="listitem">
        <div class="inbox-item-sender">${inbox.senderName}</div>
        <div class="inbox-item-subject">${inbox.subject}</div>
        <div class="inbox-item-preview">${inbox.preview}</div>
        <div class="inbox-item-date">${inbox.date}</div>
      </li>
    `;
  }

  function renderEmail() {
    const { header } = SCENARIO;

    elements.emailSubject.textContent = header.subject;
    elements.senderDisplay.textContent = header.senderDisplayName;
    elements.senderEmail.textContent = `<${header.senderEmail}>`;
    elements.recipientDisplay.textContent = header.recipient;
    elements.emailDate.textContent = header.date;
    elements.emailBody.innerHTML = buildEmailBodyHTML();
  }

  function renderWarningSigns() {
    elements.warningSignsList.innerHTML = SCENARIO.warningSigns
      .map((sign) => `<li><strong>${sign.title}:</strong> ${sign.detail}</li>`)
      .join('');
  }

  // --------------------------------------------------------------------------
  // Simulation interaction handlers
  // --------------------------------------------------------------------------

  function showVerificationForm() {
    elements.verificationOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    elements.verificationForm.querySelector('input')?.focus();
  }

  function hideVerificationForm() {
    elements.verificationOverlay.hidden = true;
    elements.verificationForm.reset();
  }

  function showEducationOverlay() {
    hideVerificationForm();
    elements.educationOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    elements.tryAgainBtn.focus();
  }

  function resetSimulation() {
    elements.educationOverlay.hidden = true;
    hideVerificationForm();
    document.body.style.overflow = '';
    renderEmail();
    attachPhishTriggers();
  }

  function attachPhishTriggers() {
    const triggers = elements.emailBody.querySelectorAll('[data-phish-trigger]');
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', handlePhishClick);
    });
  }

  function handlePhishClick(event) {
    event.preventDefault();
    event.stopPropagation();
    showVerificationForm();
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    // Data is discarded immediately — this is a training exercise only
    showEducationOverlay();
  }

  // --------------------------------------------------------------------------
  // Send-to-email (authorized training only)
  // --------------------------------------------------------------------------

  function defaultSimulationLink() {
    const url = new URL(window.location.href);
    url.hash = '';
    url.search = '';
    return url.toString();
  }

  function setSendStatus(message, type) {
    elements.sendStatus.textContent = message;
    elements.sendStatus.className = 'send-status' + (type ? ` is-${type}` : '');
  }

  function getEmailjsConfigFromForm() {
    return {
      publicKey: elements.emailjsPublicKey.value.trim(),
      serviceId: elements.emailjsServiceId.value.trim(),
      templateId: elements.emailjsTemplateId.value.trim(),
    };
  }

  function loadEmailjsConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem(EMAILJS_STORAGE_KEY) || '{}');
      if (saved.publicKey) elements.emailjsPublicKey.value = saved.publicKey;
      if (saved.serviceId) elements.emailjsServiceId.value = saved.serviceId;
      if (saved.templateId) elements.emailjsTemplateId.value = saved.templateId;
    } catch (error) {
      // Ignore corrupt localStorage
    }
  }

  function saveEmailjsConfig(config) {
    localStorage.setItem(EMAILJS_STORAGE_KEY, JSON.stringify(config));
  }

  function validateSendForm() {
    const recipient = elements.recipientEmail.value.trim();
    const simulationUrl = elements.simulationLink.value.trim();

    if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      setSendStatus('Enter a valid recipient email address.', 'error');
      return null;
    }

    if (!simulationUrl) {
      setSendStatus('Enter the training page link recipients should open.', 'error');
      return null;
    }

    if (!elements.consentCheck.checked) {
      setSendStatus('Confirm recipient consent before sending.', 'error');
      return null;
    }

    return { recipient, simulationUrl };
  }

  function buildEmlContent(recipient, simulationUrl) {
    const subject = SCENARIO.header.subject;
    const html = buildOutboundEmailHTML(simulationUrl);
    const boundary = `bound_${Date.now()}`;

    return [
      `To: ${recipient}`,
      `From: ${SCENARIO.header.senderDisplayName} <training-simulator@localhost>`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      'X-Training-Simulation: educational-phishing-awareness',
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset="utf-8"',
      '',
      'URGENT: Unclaimed tax refund pending. Open the HTML version of this message or visit:',
      appendQuery(simulationUrl, 'entry', 'email'),
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset="utf-8"',
      '',
      html,
      '',
      `--${boundary}--`,
      '',
    ].join('\r\n');
  }

  function downloadEml(recipient, simulationUrl) {
    const eml = buildEmlContent(recipient, simulationUrl);
    const blob = new Blob([eml], { type: 'message/rfc822' });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = 'fake-irs-training-simulation.eml';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  }

  async function sendWithEmailjs(recipient, simulationUrl, config) {
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS library failed to load. Check your network connection.');
    }

    emailjs.init({ publicKey: config.publicKey });

    await emailjs.send(config.serviceId, config.templateId, {
      to_email: recipient,
      subject: SCENARIO.header.subject,
      message_html: buildOutboundEmailHTML(simulationUrl),
      from_name: SCENARIO.header.senderDisplayName,
    });
  }

  async function handleSendTrainingEmail(event) {
    event.preventDefault();

    const payload = validateSendForm();
    if (!payload) return;

    const config = getEmailjsConfigFromForm();
    const hasEmailjs =
      config.publicKey && config.serviceId && config.templateId;

    elements.sendEmailBtn.disabled = true;
    setSendStatus('Sending…', 'info');

    try {
      if (hasEmailjs) {
        saveEmailjsConfig(config);
        await sendWithEmailjs(payload.recipient, payload.simulationUrl, config);
        setSendStatus(
          `Simulation sent to ${payload.recipient}. When they click the button, they will open this training page.`,
          'success'
        );
      } else {
        downloadEml(payload.recipient, payload.simulationUrl);
        setSendStatus(
          `No EmailJS setup found — downloaded an .eml for ${payload.recipient}. Open it in Outlook (or another mail app) and click Send. Or expand “Auto-send with EmailJS” for one-click delivery.`,
          'info'
        );
      }
    } catch (error) {
      console.error(error);
      downloadEml(payload.recipient, payload.simulationUrl);
      setSendStatus(
        `Auto-send failed (${error.message || 'unknown error'}). Downloaded a .eml file instead — open it and send from your mail app.`,
        'error'
      );
    } finally {
      elements.sendEmailBtn.disabled = false;
    }
  }

  function handleDownloadEml() {
    const payload = validateSendForm();
    if (!payload) return;

    downloadEml(payload.recipient, payload.simulationUrl);
    setSendStatus(
      `Downloaded .eml for ${payload.recipient}. Open the file in your mail app and click Send.`,
      'success'
    );
  }

  function toggleSendPanel() {
    const isHidden = elements.sendPanel.hidden;
    elements.sendPanel.hidden = !isHidden;
    if (!elements.sendPanel.hidden) {
      elements.recipientEmail.focus();
    }
  }

  function setupSendPanel() {
    if (!elements.sendPanel) return;

    elements.simulationLink.value = defaultSimulationLink();
    loadEmailjsConfig();

    elements.sendToggleBtn.addEventListener('click', toggleSendPanel);
    elements.sendTrainingForm.addEventListener('submit', handleSendTrainingEmail);
    elements.downloadEmlBtn.addEventListener('click', handleDownloadEml);

    ['emailjsPublicKey', 'emailjsServiceId', 'emailjsTemplateId'].forEach((id) => {
      elements[id].addEventListener('change', () => {
        saveEmailjsConfig(getEmailjsConfigFromForm());
      });
    });
  }

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------

  function isEmailEntry() {
    return new URLSearchParams(window.location.search).get('entry') === 'email';
  }

  function init() {
    renderInbox();
    renderEmail();
    renderWarningSigns();
    attachPhishTriggers();
    setupSendPanel();

    elements.verificationForm.addEventListener('submit', handleFormSubmit);
    elements.tryAgainBtn.addEventListener('click', resetSimulation);

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;

      if (!elements.educationOverlay.hidden) {
        resetSimulation();
      } else if (!elements.verificationOverlay.hidden) {
        hideVerificationForm();
        document.body.style.overflow = '';
      }
    });

    // Recipients who clicked the emailed link land on the fake verification page
    if (isEmailEntry()) {
      document.body.classList.add('trainee-entry');
      showVerificationForm();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
