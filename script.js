document.addEventListener('DOMContentLoaded', function() {
  // Questionário GAD-7
  const formGAD = document.getElementById('formGAD');
  const resetBtn = document.getElementById('resetBtn');
  const resultadoGAD = document.getElementById('resultadoGAD');
  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackMsg = document.getElementById('feedbackMsg');
  const progressFill = document.getElementById('questionProgress');
  const progressText = document.getElementById('progressText');
  const inputs = formGAD.querySelectorAll('input[type="number"]');
  
  // Exercício de respiração
  const startBreathingBtn = document.getElementById('startBreathing');
  const breathCircle = document.getElementById('breathCircle');
  
  // Atualizar barra de progresso do questionário
  function updateProgress() {
    let answered = 0;
    inputs.forEach(input => {
      if (input.value !== '') answered++;
    });
    
    const progress = (answered / inputs.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${answered} de ${inputs.length} respondidas`;
  }
  
  // Adicionar evento para atualizar progresso
  inputs.forEach(input => {
    input.addEventListener('input', updateProgress);
    
    // Validação em tempo real
    input.addEventListener('change', function() {
      if (this.value < 0) this.value = 0;
      if (this.value > 3) this.value = 3;
    });
  });
  
  // Calcular resultado do questionário
  formGAD.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let total = 0;
    let allAnswered = true;
    
    inputs.forEach(input => {
      if (input.value === '') {
        allAnswered = false;
        input.style.borderColor = 'var(--danger)';
      } else {
        input.style.borderColor = '';
        total += parseInt(input.value);
      }
    });
    
    if (!allAnswered) {
      resultadoGAD.textContent = 'Por favor, responda todas as perguntas.';
      resultadoGAD.className = 'resultado danger';
      return;
    }
    
    let message = '';
    let className = '';
    
    if (total <= 4) {
      message = 'Baixo nível de ansiedade. Continue com suas estratégias de autocuidado.';
      className = 'success';
    } else if (total <= 9) {
      message = 'Ansiedade leve. Considere implementar mais estratégias de manejo.';
      className = 'warning';
    } else if (total <= 14) {
      message = 'Ansiedade moderada. Recomenda-se buscar apoio profissional.';
      className = 'danger';
    } else {
      message = 'Ansiedade severa. É importante buscar ajuda profissional o quanto antes.';
      className = 'danger';
    }
    
    resultadoGAD.innerHTML = `
      <strong>Pontuação: ${total}/21</strong><br>
      ${message}
    `;
    resultadoGAD.className = `resultado ${className}`;
    
    // Scroll suave para o resultado
    resultadoGAD.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  
  // Resetar questionário
  resetBtn.addEventListener('click', function() {
    formGAD.reset();
    resultadoGAD.textContent = '';
    resultadoGAD.className = 'resultado';
    updateProgress();
    
    // Resetar bordas dos inputs
    inputs.forEach(input => {
      input.style.borderColor = '';
    });
  });
  
  // Exercício de respiração
  startBreathingBtn.addEventListener('click', function() {
    const btn = this;
    btn.disabled = true;
    btn.textContent = 'Exercício em andamento...';
    
    // Fase 1: Inspire (4 segundos)
    breathCircle.textContent = 'INSPIRE... 4';
    breathCircle.style.background = '#4caf50';
    breathCircle.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
      // Fase 2: Segure (7 segundos)
      breathCircle.textContent = 'SEGURE... 7';
      breathCircle.style.background = '#ff9800';
      
      setTimeout(() => {
        // Fase 3: Expire (8 segundos)
        breathCircle.textContent = 'EXPIRE... 8';
        breathCircle.style.background = '#2196f3';
        breathCircle.style.transform = 'scale(1)';
        
        setTimeout(() => {
          // Final
          breathCircle.textContent = 'COMPLETO!';
          breathCircle.style.background = 'var(--accent)';
          btn.disabled = false;
          btn.textContent = 'Iniciar Exercício';
        }, 8000);
      }, 7000);
    }, 4000);
  });
  
  // Enviar feedback
  feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const feedback = formData.get('feedback');
    
    // Simulação de envio
    feedbackMsg.textContent = 'Obrigado pelo seu feedback! Sua resposta foi registrada anonimamente.';
    feedbackMsg.className = 'resultado info';
    
    // Limpar formulário após 5 segundos
    setTimeout(() => {
      feedbackForm.reset();
      feedbackMsg.textContent = '';
      feedbackMsg.className = 'resultado';
    }, 5000);
  });
  
  // Smooth scroll para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Inicializar barra de progresso
  updateProgress();
});