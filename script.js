document.addEventListener('DOMContentLoaded', function() {
  // ========== CONFIGURAÇÕES GLOBAIS ==========
  const config = {
    breathingDuration: 19000, // 19 segundos para o exercício completo
    timerUpdateInterval: 1000, // 1 segundo
    chartAnimationDelay: 500
  };

  // ========== INICIALIZAÇÃO DE COMPONENTES ==========
  initializeTabs();
  initializeCharts();
  initializeBreathingExercise();
  initializeChecklist();
  initializeMindfulnessTools();
  initializeQuestionnaire();
  initializeSmoothScroll();
  initializeParticles();

  // ========== SISTEMA DE TABS ==========
  function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Remove classe active de todos os botões e conteúdos
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Adiciona classe active ao botão e conteúdo atual
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }

  // ========== GRÁFICOS INTERATIVOS ==========
  function initializeCharts() {
    const bars = document.querySelectorAll('.bar-fill');
    
    setTimeout(() => {
      bars.forEach(bar => {
        const value = bar.getAttribute('data-value');
        bar.style.width = value + '%';
      });
    }, config.chartAnimationDelay);
  }

  // ========== EXERCÍCIO DE RESPIRAÇÃO ==========
  function initializeBreathingExercise() {
    const startBtn = document.getElementById('startBreathing');
    const pauseBtn = document.getElementById('pauseBreathing');
    const breathCircle = document.getElementById('breathCircle');
    const breathCounter = document.getElementById('breathCounter');
    const completedSessions = document.getElementById('completedSessions');
    const totalTime = document.getElementById('totalTime');
    const steps = document.querySelectorAll('.progress-step');

    let breathingInterval;
    let isBreathing = false;
    let sessionCount = 0;
    let totalTimeSeconds = 0;
    let currentStep = 0;

    // Timer para o tempo total
    const timeInterval = setInterval(() => {
      if (isBreathing) {
        totalTimeSeconds++;
        totalTime.textContent = Math.floor(totalTimeSeconds / 60);
      }
    }, 1000);

    startBtn.addEventListener('click', startBreathingExercise);
    pauseBtn.addEventListener('click', pauseBreathingExercise);

    function startBreathingExercise() {
      if (isBreathing) return;
      
      isBreathing = true;
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      sessionCount++;
      completedSessions.textContent = sessionCount;

      // Fase 1: Inspire (4 segundos)
      currentStep = 0;
      updateStep(0);
      breathCircle.textContent = 'INSPIRE';
      breathCounter.textContent = '4';
      breathCircle.style.transform = 'scale(1.3)';
      breathCircle.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';

      let count = 4;
      const countdown = setInterval(() => {
        count--;
        breathCounter.textContent = count;
        if (count === 0) {
          clearInterval(countdown);
          // Fase 2: Segure (7 segundos)
          currentStep = 1;
          updateStep(1);
          breathCircle.textContent = 'SEGURE';
          breathCounter.textContent = '7';
          breathCircle.style.background = 'linear-gradient(135deg, #ff9800, #ffb74d)';

          let holdCount = 7;
          const holdInterval = setInterval(() => {
            holdCount--;
            breathCounter.textContent = holdCount;
            if (holdCount === 0) {
              clearInterval(holdInterval);
              // Fase 3: Expire (8 segundos)
              currentStep = 2;
              updateStep(2);
              breathCircle.textContent = 'EXPIRE';
              breathCounter.textContent = '8';
              breathCircle.style.transform = 'scale(1)';
              breathCircle.style.background = 'linear-gradient(135deg, #2196f3, #64b5f6)';

              let exhaleCount = 8;
              const exhaleInterval = setInterval(() => {
                exhaleCount--;
                breathCounter.textContent = exhaleCount;
                if (exhaleCount === 0) {
                  clearInterval(exhaleInterval);
                  // Final
                  currentStep = 3;
                  updateStep(0); // Reset para o início
                  breathCircle.textContent = 'COMPLETO!';
                  breathCounter.textContent = '✓';
                  breathCircle.style.background = 'var(--gradient)';
                  
                  setTimeout(() => {
                    isBreathing = false;
                    startBtn.disabled = false;
                    pauseBtn.disabled = true;
                    breathCircle.textContent = 'INSPIRE';
                    breathCounter.textContent = '4';
                  }, 2000);
                }
              }, 1000);
            }
          }, 1000);
        }
      }, 1000);
    }

    function pauseBreathingExercise() {
      isBreathing = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      breathCircle.textContent = 'PAUSADO';
      breathCounter.textContent = 'II';
      breathCircle.style.background = 'linear-gradient(135deg, #9e9e9e, #bdbdbd)';
    }

    function updateStep(stepIndex) {
      steps.forEach((step, index) => {
        step.classList.toggle('active', index === stepIndex);
      });
    }
  }

  // ========== CHECKLIST INTERATIVO ==========
  function initializeChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    const progressFill = document.getElementById('checklistProgressFill');
    const progressText = document.getElementById('checklistProgress');
    const resetBtn = document.getElementById('resetChecklist');
    const saveBtn = document.getElementById('saveChecklist');

    // Carregar progresso salvo
    loadChecklistProgress();

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateChecklistProgress);
    });

    resetBtn.addEventListener('click', resetChecklist);
    saveBtn.addEventListener('click', saveChecklistProgress);

    function updateChecklistProgress() {
      const total = checkboxes.length;
      const checked = document.querySelectorAll('.checklist-checkbox:checked').length;
      const progress = (checked / total) * 100;

      progressFill.style.width = progress + '%';
      progressText.textContent = Math.round(progress) + '%';

      // Efeito visual quando completa
      if (progress === 100) {
        progressFill.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
        showCompletionMessage();
      } else {
        progressFill.style.background = 'var(--gradient)';
      }
    }

    function resetChecklist() {
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
      updateChecklistProgress();
      localStorage.removeItem('checklistProgress');
    }

    function saveChecklistProgress() {
      const progress = {};
      checkboxes.forEach((checkbox, index) => {
        progress[`check${index + 1}`] = checkbox.checked;
      });
      localStorage.setItem('checklistProgress', JSON.stringify(progress));
      
      // Feedback visual
      const originalText = saveBtn.innerHTML;
      saveBtn.innerHTML = '<span class="btn-icon">✅</span> Salvo!';
      setTimeout(() => {
        saveBtn.innerHTML = originalText;
      }, 2000);
    }

    function loadChecklistProgress() {
      const saved = localStorage.getItem('checklistProgress');
      if (saved) {
        const progress = JSON.parse(saved);
        checkboxes.forEach((checkbox, index) => {
          const key = `check${index + 1}`;
          if (progress[key]) {
            checkbox.checked = true;
          }
        });
        updateChecklistProgress();
      }
    }

    function showCompletionMessage() {
      const completionMsg = document.createElement('div');
      completionMsg.className = 'resultado success';
      completionMsg.innerHTML = '🎉 Parabéns! Você completou todas as tarefas do dia!';
      completionMsg.style.marginTop = '15px';
      
      const checklistContainer = document.querySelector('.checklist-container');
      const existingMsg = checklistContainer.querySelector('.resultado');
      if (existingMsg) {
        existingMsg.remove();
      }
      
      checklistContainer.appendChild(completionMsg);
      
      setTimeout(() => {
        completionMsg.style.opacity = '0';
        completionMsg.style.transition = 'opacity 0.5s ease';
        setTimeout(() => completionMsg.remove(), 500);
      }, 3000);
    }
  }

  // ========== FERRAMENTAS DE MINDFULNESS ==========
  function initializeMindfulnessTools() {
  initializeStretchingRoutine(); // Substituiu initializeSoundPlayer
  initializeTimer();
  initializeGratitudeJournal();
}
 function initializeStretchingRoutine() {
  const startBtn = document.getElementById('startStretching');
  const exercises = document.querySelectorAll('.stretch-exercise');

  startBtn.addEventListener('click', startStretchingRoutine);

  function startStretchingRoutine() {
    startBtn.disabled = true;
    startBtn.innerHTML = '<span class="btn-icon">⏳</span> Iniciando...';
    
    // Resetar todos os exercícios
    exercises.forEach(exercise => {
      exercise.style.background = '';
      exercise.style.borderColor = '';
    });

    let currentExercise = 0;
    
    function runExercise(index) {
      if (index >= exercises.length) {
        // Rotina completa
        showMessage('🎉 Rotina de alongamento concluída!', 'success');
        startBtn.disabled = false;
        startBtn.innerHTML = '<span class="btn-icon">⏱️</span> Iniciar Rotina (2min)';
        return;
      }

      // Destacar exercício atual
      exercises[index].style.background = 'rgba(76, 175, 80, 0.1)';
      exercises[index].style.borderColor = 'rgba(76, 175, 80, 0.3)';

      // Mostrar contagem regressiva
      const exerciseName = exercises[index].querySelector('strong').textContent;
      showMessage(`💪 ${exerciseName} - 30 segundos`, 'info');

      // Próximo exercício após 30 segundos
      setTimeout(() => {
        exercises[index].style.background = '';
        exercises[index].style.borderColor = '';
        currentExercise++;
        runExercise(currentExercise);
      }, 30000); // 30 segundos por exercício
    }

    // Iniciar primeiro exercício
    runExercise(currentExercise);
  }
}
  function initializeTimer() {
    const timerSelect = document.getElementById('timerSelect');
    const startBtn = document.getElementById('startTimer');
    const timerDisplay = document.getElementById('timerDisplay');
    let timerInterval;
    let timeLeft = 0;

    startBtn.addEventListener('click', startTimer);

    function startTimer() {
      const minutes = parseInt(timerSelect.value);
      if (minutes <= 0) return;

      timeLeft = minutes * 60;
      
      if (timerInterval) {
        clearInterval(timerInterval);
      }

      timerInterval = setInterval(updateTimer, 1000);
      startBtn.disabled = true;
      updateTimerDisplay();

      showMessage(`⏱️ Timer iniciado: ${minutes} minutos`, 'info');
    }

    function updateTimer() {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        startBtn.disabled = false;
        showMessage('🔔 Timer finalizado! Hora de uma pausa!', 'success');
        
        // Notificação visual
        timerDisplay.style.animation = 'pulse 1s infinite';
        setTimeout(() => {
          timerDisplay.style.animation = '';
        }, 3000);
      }
    }

    function updateTimerDisplay() {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      // Mudança de cor quando o tempo está acabando
      if (timeLeft < 60) {
        timerDisplay.style.background = 'linear-gradient(135deg, #ff9800, #ffb74d)';
        timerDisplay.style.webkitBackgroundClip = 'text';
        timerDisplay.style.webkitTextFillColor = 'transparent';
      } else {
        timerDisplay.style.background = 'var(--gradient)';
        timerDisplay.style.webkitBackgroundClip = 'text';
        timerDisplay.style.webkitTextFillColor = 'transparent';
      }
    }
  }

  function initializeGratitudeJournal() {
    const saveBtn = document.getElementById('saveGratitude');
    const textarea = document.getElementById('gratitudeText');

    // Carregar diário salvo
    loadGratitudeJournal();

    saveBtn.addEventListener('click', saveGratitudeJournal);

    function saveGratitudeJournal() {
      const content = textarea.value.trim();
      if (!content) {
        showMessage('Escreva algo no seu diário antes de salvar.', 'warning');
        return;
      }

      localStorage.setItem('gratitudeJournal', content);
      
      // Feedback visual
      const originalText = saveBtn.innerHTML;
      saveBtn.innerHTML = '✅ Salvo!';
      saveBtn.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
      
      setTimeout(() => {
        saveBtn.innerHTML = '💾 Salvar';
        saveBtn.style.background = '';
      }, 2000);

      showMessage('Diário salvo com sucesso! 📖', 'success');
    }

    function loadGratitudeJournal() {
      const saved = localStorage.getItem('gratitudeJournal');
      if (saved) {
        textarea.value = saved;
      }
    }
  }

  // ========== QUESTIONÁRIO GAD-7 ==========
  function initializeQuestionnaire() {
    const formGAD = document.getElementById('formGAD');
    const resetBtn = document.getElementById('resetBtn');
    const resultadoGAD = document.getElementById('resultadoGAD');
    const progressFill = document.getElementById('questionProgress');
    const progressText = document.getElementById('progressText');
    const ratingButtons = document.querySelectorAll('.rating-btn');
    const hiddenInputs = document.querySelectorAll('input[type="hidden"]');

    // Inicializar botões de rating
    ratingButtons.forEach(button => {
      button.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        const questionItem = this.closest('.question-item');
        const hiddenInput = questionItem.querySelector('input[type="hidden"]');
        
        // Remover active de todos os botões desta questão
        const siblingButtons = questionItem.querySelectorAll('.rating-btn');
        siblingButtons.forEach(btn => btn.classList.remove('active'));
        
        // Adicionar active ao botão clicado
        this.classList.add('active');
        
        // Atualizar input hidden
        hiddenInput.value = value;
        
        updateProgress();
      });
    });

    function updateProgress() {
      const inputs = document.querySelectorAll('input[type="hidden"]');
      let answered = 0;
      
      inputs.forEach(input => {
        if (input.value !== '') answered++;
      });
      
      const progress = (answered / inputs.length) * 100;
      progressFill.style.width = `${progress}%`;
      progressText.textContent = `${answered} de ${inputs.length} respondidas`;
    }

    // Calcular resultado do questionário
    formGAD.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let total = 0;
      let allAnswered = true;
      const inputs = document.querySelectorAll('input[type="hidden"]');
      
      inputs.forEach(input => {
        if (input.value === '') {
          allAnswered = false;
          const questionItem = input.closest('.question-item');
          questionItem.style.borderColor = 'var(--danger)';
          questionItem.style.animation = 'shake 0.5s ease';
        } else {
          const questionItem = input.closest('.question-item');
          questionItem.style.borderColor = '';
          questionItem.style.animation = '';
          total += parseInt(input.value);
        }
      });
      
      if (!allAnswered) {
        showMessage('Por favor, responda todas as perguntas.', 'danger', resultadoGAD);
        return;
      }
      
      showResult(total);
    });

    function showResult(total) {
      let message = '';
      let className = '';
      let recommendations = '';
      
      if (total <= 4) {
        message = 'Baixo nível de ansiedade';
        className = 'success';
        recommendations = 'Continue com suas estratégias de autocuidado. Mantenha os hábitos saudáveis.';
      } else if (total <= 9) {
        message = 'Ansiedade leve';
        className = 'warning';
        recommendations = 'Considere implementar mais estratégias de manejo. Pratique os exercícios regularmente.';
      } else if (total <= 14) {
        message = 'Ansiedade moderada';
        className = 'danger';
        recommendations = 'Recomenda-se buscar apoio profissional. Utilize os recursos de ajuda disponíveis.';
      } else {
        message = 'Ansiedade severa';
        className = 'danger';
        recommendations = 'É importante buscar ajuda profissional o quanto antes. Entre em contato com os recursos de emergência.';
      }
      
      resultadoGAD.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 1.5rem; margin-bottom: 10px;">📊 Resultado</div>
          <div style="font-size: 2rem; font-weight: bold; margin-bottom: 15px; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ${total}/21
          </div>
          <div style="font-size: 1.2rem; margin-bottom: 15px; font-weight: 600;">${message}</div>
          <div style="color: var(--text-light); font-size: 0.95rem;">${recommendations}</div>
          ${total >= 10 ? `<div style="margin-top: 15px; padding: 10px; background: rgba(244, 67, 54, 0.1); border-radius: 8px; border-left: 4px solid #f44336;">
            <strong>🚨 Recomendação:</strong> Considere entrar em contato com a Saúde Ocupacional: <strong>(71) 3622-7580</strong>
          </div>` : ''}
        </div>
      `;
      resultadoGAD.className = `resultado ${className}`;
      
      // Scroll suave para o resultado
      resultadoGAD.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Resetar questionário
    resetBtn.addEventListener('click', function() {
      formGAD.reset();
      resultadoGAD.textContent = '';
      resultadoGAD.className = 'resultado';
      
      // Resetar botões de rating
      ratingButtons.forEach(button => {
        button.classList.remove('active');
      });
      
      // Resetar inputs hidden
      hiddenInputs.forEach(input => {
        input.value = '';
      });
      
      updateProgress();
      
      // Resetar estilos das questões
      document.querySelectorAll('.question-item').forEach(item => {
        item.style.borderColor = '';
        item.style.animation = '';
      });
    });

    // Inicializar progresso
    updateProgress();
  }

  // ========== SISTEMA DE FEEDBACK ==========
  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackMsg = document.getElementById('feedbackMsg');

  feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const feedback = formData.get('feedback');
    
    // Simulação de envio
    showMessage('Obrigado pelo seu feedback! Sua resposta foi registrada anonimamente. 📨', 'info', feedbackMsg);
    
    // Limpar formulário após 5 segundos
    setTimeout(() => {
      feedbackForm.reset();
      feedbackMsg.textContent = '';
      feedbackMsg.className = 'resultado';
    }, 5000);
  });

  // ========== SCROLL SUAVE ==========
  function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ========== PARTÍCULAS DECORATIVAS ==========
  function initializeParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    // Criar partículas
    for (let i = 0; i < 15; i++) {
      createParticle(particlesContainer);
    }
  }

  function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Posição aleatória
    const size = Math.random() * 4 + 2;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 10 + 10;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}vw`;
    particle.style.top = `${posY}vh`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    container.appendChild(particle);
  }

  // ========== FUNÇÕES UTILITÁRIAS ==========
  function showMessage(message, type, container = null) {
    const messageElement = container || document.createElement('div');
    if (!container) {
      messageElement.style.position = 'fixed';
      messageElement.style.top = '20px';
      messageElement.style.right = '20px';
      messageElement.style.zIndex = '10000';
      messageElement.style.maxWidth = '300px';
      document.body.appendChild(messageElement);
    }
    
    messageElement.innerHTML = message;
    messageElement.className = `resultado ${type}`;
    messageElement.style.opacity = '1';
    messageElement.style.transition = 'opacity 0.3s ease';
    
    if (!container) {
      setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
          if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
          }
        }, 300);
      }, 4000);
    }
  }

  // ========== ANIMAÇÕES CSS ADICIONAIS ==========
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .question-item {
      transition: all 0.3s ease;
    }
  `;
  document.head.appendChild(style);

  // ========== CARREGAMENTO INICIAL ==========
  setTimeout(() => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
  }, 100);

  console.log('🚀 Sistema de Bem-estar NOC inicializado com sucesso!');
});
