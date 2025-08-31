document.addEventListener('DOMContentLoaded', () => {

  const avatarPreview = document.getElementById('avatar-preview');
  const avatarInput = document.getElementById('avatar-input');
  const form = document.querySelector('.ticket-form form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const githubInput = document.getElementById('github');
  const toastContainer = document.querySelector('.toast-container');
  
  // Se o formulário não existir, interrompe a execução para evitar erros.
  if (!form) {
    console.log("Formulário não encontrado. Script de formulário não será executado.");
    return;
  }

  // === CONFIGURAÇÕES DE VALIDAÇÃO ===
  const VALIDATION_MODE = 'below'; // 'below' | 'above' | 'alert' | 'toast'
  const NAME_VALIDATION_MODE = 'full'; // 'first' | 'full'
  const GITHUB_AT_MODE = 'auto'; // 'inclua' (exige @) | 'auto' (adiciona se faltar) | 'normal' (sinônimo de 'auto')

  // === AVATAR UPLOAD ===
  if (avatarInput) {
    avatarInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      const avatarAnchor = document.querySelector('.avatar-box') || avatarInput;
      removeExistingError(avatarAnchor); // Limpa erros anteriores

      if (!file) {
        avatarPreview.src = './assets/images/icon-upload.svg';
        return;
      }
      
      if (file && file.type && file.type.startsWith('image/')) {
        if (file.size > 500 * 1024) {
          event.target.value = '';
          avatarPreview.src = './assets/images/icon-upload.svg';
          showValidation(avatarInput, 'ⓘ File too large. Please upload a photo under 500KB.');
          return;
        }
        avatarPreview.src = URL.createObjectURL(file);
        clearAvatarInfo();
      } else {
        avatarPreview.src = './assets/images/icon-upload.svg';
        showValidation(avatarInput, 'Please, select image files only.');
      }
    });
  }

  // === UTILIDADES DE VALIDAÇÃO ===
  function removeExistingError(element) {
    const parent = element.parentElement;
    if (!parent) return;
    parent.querySelectorAll('.error-text').forEach(err => err.remove());
  }

  function showError(inputEl, message, position) {
    removeExistingError(inputEl);
    const errorDiv = document.createElement('div');
    errorDiv.className = `error-text error-text--${position}`;
    errorDiv.textContent = message;

    if (position === 'above' && inputEl.parentElement) {
      inputEl.parentElement.insertBefore(errorDiv, inputEl);
    } else { // 'below' é o padrão
      inputEl.insertAdjacentElement('afterend', errorDiv);
    }
  }
  
  function showToast(message, isError = true, timeoutMs = 3000) {
    if (!toastContainer) {
      alert(message); // Fallback se o container de toast não existir
      return;
    }
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'toast--error' : ''}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), timeoutMs);
  }

  function showValidation(inputEl, message) {
    if (!message) return;
    switch (VALIDATION_MODE) {
      case 'below':
        showError(inputEl, message, 'below');
        break;
      case 'above':
        showError(inputEl, message, 'above');
        break;
      case 'alert':
        alert(message);
        break;
      case 'toast':
        showToast(message, true);
        break;
      default:
        showError(inputEl, message, 'below');
    }
  }

  // === LÓGICA DE VALIDAÇÃO ESPECÍFICA ===
  function validateName() {
    const name = nameInput.value.trim();
    if (!name) return 'Por favor, informe seu nome.';
    if (NAME_VALIDATION_MODE === 'full' && !name.includes(' ')) {
      return 'Por favor, informe nome e sobrenome.';
    }
    if (NAME_VALIDATION_MODE === 'first' && name.includes(' ')) {
        return 'Por favor, informe apenas o primeiro nome.';
    }
    return ''; // Vazio significa sem erros
  }
  
  function validateEmail() {
      const email = emailInput.value.trim();
      if (!email) return 'Por favor, informe seu e-mail.';
      // Validação simples de e-mail
      if (!email.includes('@') ) {
          return 'Por favor, informe um e-mail válido com ("@").';
      } 
      else if (!email.includes('gmail') ) {
          return 'Por favor, informe um e-mail google ("@gmail").';
      }
      return '';
  }

  function processGithubUsername() {
    let github = githubInput.value.trim();
    if (!github) return { error: 'Por favor, informe seu usuário do GitHub.' };
    
    // Remove múltiplos '@' no início
    while (github.startsWith('@')) {
      github = github.substring(1);
    }
    
    if (GITHUB_AT_MODE === 'inclua' && !githubInput.value.trim().startsWith('@')) {
      return { error: "Por favor, inclua '@' no seu usuário do GitHub." };
    }
    
    return { value: `@${github}` }; // Retorna o valor normalizado
  }

  // === VALIDAÇÃO EM TEMPO REAL (BLUR) ===
  nameInput.addEventListener('blur', () => {
    const error = validateName();
    if (error) showValidation(nameInput, error);
    else removeExistingError(nameInput);
  });
  
  emailInput.addEventListener('blur', () => {
    const error = validateEmail();
    if (error) showValidation(emailInput, error);
    else removeExistingError(emailInput);
  });

  githubInput.addEventListener('blur', () => {
    const result = processGithubUsername();
    if (result.error) {
        showValidation(githubInput, result.error);
    } else {
        githubInput.value = result.value; // Normaliza o valor no campo
        removeExistingError(githubInput);
    }
  });


  // === MANIPULADOR DE SUBMISSÃO DO FORMULÁRIO ===
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpa todos os erros antigos
    removeExistingError(nameInput);
    removeExistingError(emailInput);
    removeExistingError(githubInput);
    removeExistingError(document.querySelector('.avatar-box') || avatarInput);

    // Roda todas as validações
    const nameError = validateName();
    const emailError = validateEmail();
    const githubResult = processGithubUsername();
    const hasAvatar = avatarInput && avatarInput.files.length > 0;

    // Verifica se houve algum erro
    if (nameError) {
      showValidation(nameInput, nameError);
      nameInput.focus();
      return;
    }
    if (emailError) {
      showValidation(emailInput, emailError);
      emailInput.focus();
      return;
    }
    if (githubResult.error) {
      showValidation(githubInput, githubResult.error);
      githubInput.focus();
      return;
    }
    if (!hasAvatar) {
      showValidation(document.querySelector('.avatar-box') || avatarInput, 'Por favor, selecione uma imagem de avatar.');
      return;
    }
    
    // Se tudo estiver OK, processa os dados e redireciona
    const file = avatarInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const ticketData = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          github: githubResult.value,
          avatarDataUrl: reader.result
        };
        sessionStorage.setItem('ticketData', JSON.stringify(ticketData));
        window.location.href = 'ticket.html';
      } catch (err) {
        showToast('Erro ao gerar o ticket. Tente novamente.', true);
      }
    };

    reader.onerror = () => {
      showToast('Não foi possível ler o arquivo de imagem.', true);
    };

    reader.readAsDataURL(file);
  });
});

