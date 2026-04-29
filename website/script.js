// ============================================================
// TP Kubernetes - Site Web Pédagogique
// Auteur: KHLIFI HOUCEM / FORMATEUR DEVSECOPS & CLOUD
// ============================================================

// ── Password Protection (Correction Page) ───────────────────
// Mot de passe: k8s@formateur
const PASS_HASH = 'azhzQGZvcm1hdGV1cg==';

function checkPassword() {
  const input = document.getElementById('password-input');
  const errorMsg = document.getElementById('password-error');

  if (btoa(input.value) === PASS_HASH) {
    const overlay = document.getElementById('password-overlay');
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      overlay.remove();
      document.querySelector('.correction-content').classList.add('visible');
    }, 500);
  } else {
    input.classList.add('error');
    errorMsg.style.display = 'block';
    setTimeout(() => {
      input.classList.remove('error');
      errorMsg.style.display = 'none';
    }, 2000);
    input.value = '';
    input.focus();
  }
}

// ── Copy to Clipboard ───────────────────────────────────────
function copyCode(btn) {
  const code = btn.closest('pre').querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const original = btn.textContent;
    btn.textContent = '✓ Copié !';
    btn.style.background = 'var(--accent3)';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.style.color = '';
    }, 1500);
  });
}

// ── Add copy buttons to all code blocks ─────────────────────
function initCopyButtons() {
  document.querySelectorAll('pre').forEach(pre => {
    if (pre.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = '📋 Copier';
    btn.onclick = function() { copyCode(this); };
    pre.appendChild(btn);
  });
}

// ── Step Toggle (expand/collapse) ───────────────────────────
function initStepToggles() {
  document.querySelectorAll('.step-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const step = header.closest('.step');
      if (body && body.classList.contains('step-body')) {
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
        step.classList.toggle('collapsed');
      }
    });
  });
}

// ── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCopyButtons();
  initStepToggles();

  // Password: toujours demander le mot de passe à chaque visite
  const passInput = document.getElementById('password-input');
  if (passInput) {
    passInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkPassword();
    });
    passInput.focus();
  }
});
