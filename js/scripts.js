const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(element => observer.observe(element));
} else {
  reveals.forEach(element => element.classList.add('visible'));
}

document.querySelectorAll('.acord-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.acord-item');
    const body = item.querySelector('.acord-body');
    const isOpen = item.classList.contains('acord-open');

    document.querySelectorAll('.acord-item').forEach(element => {
      element.classList.remove('acord-open');
      const elementBody = element.querySelector('.acord-body');
      if (elementBody) elementBody.style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('acord-open');
      body.style.maxHeight = `${body.scrollHeight}px`;
    }
  });
});

const firstAcord = document.querySelector('.acord-item');
if (firstAcord) {
  firstAcord.classList.add('acord-open');
  const firstBody = firstAcord.querySelector('.acord-body');
  if (firstBody) firstBody.style.maxHeight = `${firstBody.scrollHeight}px`;
}

// ===== TEST ORIENTATIVO DE RIESGO DE ANEMIA =====
const anemiaTest = document.querySelector('[data-anemia-test]');

if (anemiaTest) {
  const profileButtons = Array.from(anemiaTest.querySelectorAll('[data-profile]'));
  const form = anemiaTest.querySelector('[data-test-form]');
  const scoreOutput = anemiaTest.querySelector('[data-test-score]');
  const progressOutput = anemiaTest.querySelector('[data-test-progress]');
  const progressLabel = anemiaTest.querySelector('[data-test-progress-label]');
  const resultBox = anemiaTest.querySelector('[data-test-result]');
  const resultMeter = anemiaTest.querySelector('[data-result-meter]');
  const resultLabel = anemiaTest.querySelector('[data-result-label]');
  const resultTitle = anemiaTest.querySelector('[data-result-title]');
  const resultText = anemiaTest.querySelector('[data-result-text]');
  let currentProfile = '';
  let currentQuestions = [];

  const questionBank = {
    adolescente: [
      ['¿Sientes cansancio, sueño o debilidad durante clases o actividades?', ['Casi nunca', 0], ['Algunas veces', 1], ['Frecuentemente', 2]],
      ['¿Te cuesta concentrarte o mantener energia durante el dia?', ['No', 0], ['A veces', 1], ['Frecuentemente', 2]],
      ['¿Tu alimentacion suele ser baja en carnes, menestras, huevo o alimentos ricos en hierro?', ['No', 0], ['Algunas semanas', 1], ['Si, con frecuencia', 2]],
      ['¿Consumes te, cafe o gaseosas cerca de las comidas principales?', ['Casi nunca', 0], ['Algunas veces', 1], ['Casi siempre', 2]],
      ['¿Has notado palidez en labios, encias, rostro o parpados?', ['No', 0], ['Un poco', 1], ['Si, notoria', 2]],
      ['¿Has tenido crecimiento rapido, deporte intenso o infecciones recientes?', ['No', 0], ['Uno de ellos', 1], ['Varios o repetidos', 2]]
    ],
    hombre: [
      ['¿Sientes cansancio o falta de aire al hacer esfuerzos habituales?', ['No', 0], ['A veces', 1], ['Frecuentemente', 2]],
      ['¿Has notado palidez, mareos o dolor de cabeza frecuente?', ['No', 0], ['A veces', 1], ['Frecuentemente', 2]],
      ['¿Tu dieta es baja en carnes, pescado, menestras o alimentos fortificados?', ['No', 0], ['Algunas semanas', 1], ['Si, con frecuencia', 2]],
      ['¿Has tenido sangrados, heces oscuras o perdida de sangre reciente?', ['No', 0], ['No estoy seguro', 1], ['Si', 2]],
      ['¿Tienes problemas digestivos persistentes o infecciones frecuentes?', ['No', 0], ['A veces', 1], ['Si, repetidos', 2]],
      ['¿Consumes alcohol en exceso o tienes una enfermedad cronica sin control?', ['No', 0], ['A veces o una condicion leve', 1], ['Si', 2]]
    ],
    mujer: [
      ['¿Tu menstruacion suele ser abundante o durar muchos dias?', ['No', 0], ['A veces', 1], ['Si, frecuentemente', 2]],
      ['¿Sientes cansancio, debilidad, mareos o falta de aire?', ['No', 0], ['A veces', 1], ['Frecuentemente', 2]],
      ['¿Has notado palidez o caida de cabello mas de lo habitual?', ['No', 0], ['Un poco', 1], ['Si, notorio', 2]],
      ['¿Tu dieta es baja en hierro o comes pocas menestras/carnes?', ['No', 0], ['Algunas semanas', 1], ['Si, con frecuencia', 2]],
      ['¿Tomas te, cafe o gaseosas junto con comidas principales?', ['Casi nunca', 0], ['Algunas veces', 1], ['Casi siempre', 2]],
      ['¿Has estado embarazada recientemente o estas lactando?', ['No', 0], ['Hace mas de un año', 1], ['Si o recientemente', 2]]
    ],
    gestante: [
      ['¿Estas embarazada o en periodo de lactancia?', ['Lactancia sin sintomas', 1], ['Embarazo sin sintomas', 1], ['Embarazo/lactancia con sintomas', 2]],
      ['¿Sientes cansancio intenso, mareos o falta de aire?', ['No', 0], ['A veces', 1], ['Frecuentemente', 2]],
      ['¿Has recibido indicacion de suplementos de hierro y no los tomas con regularidad?', ['Los tomo como indicaron', 0], ['A veces olvido', 1], ['No los tomo', 2]],
      ['¿Tu alimentacion tiene pocas fuentes de hierro?', ['No', 0], ['Algunas semanas', 1], ['Si, con frecuencia', 2]],
      ['¿Has tenido vomitos frecuentes, poco apetito o perdida de peso?', ['No', 0], ['A veces', 1], ['Frecuentemente', 2]],
      ['¿Has presentado sangrado o te han dicho que tu hemoglobina esta baja?', ['No', 0], ['No estoy segura', 1], ['Si', 2]]
    ],
    'adulto-mayor': [
      ['¿Sientes cansancio, debilidad o falta de aire al caminar poco?', ['No', 0], ['A veces', 1], ['Frecuentemente', 2]],
      ['¿Has perdido apetito, peso o energia en los ultimos meses?', ['No', 0], ['Un poco', 1], ['Si, notorio', 2]],
      ['¿Tienes enfermedades cronicas o tomas varios medicamentos?', ['No', 0], ['Una condicion controlada', 1], ['Varias o sin control', 2]],
      ['¿Has tenido sangrados, heces oscuras o problemas digestivos persistentes?', ['No', 0], ['No estoy seguro', 1], ['Si', 2]],
      ['¿Tu alimentacion es baja en proteinas, menestras o alimentos ricos en hierro?', ['No', 0], ['Algunas semanas', 1], ['Si, con frecuencia', 2]],
      ['¿Has tenido infecciones frecuentes o recuperacion lenta?', ['No', 0], ['A veces', 1], ['Frecuentemente', 2]]
    ]
  };

  function getAnsweredInputs() {
    return Array.from(form.querySelectorAll('.test-question'))
      .map(question => question.querySelector('input:checked'))
      .filter(Boolean);
  }

  function getScore() {
    return getAnsweredInputs().reduce((total, input) => total + Number(input.value), 0);
  }

  function getRisk(score) {
    if (score <= 3) {
      return {
        level: 'Riesgo bajo',
        title: 'Probabilidad baja segun tus respuestas',
        text: 'Tus respuestas muestran pocas senales asociadas a anemia. Mantener una alimentacion variada, vitamina C con comidas ricas en hierro y controles regulares sigue siendo importante.',
        className: 'low'
      };
    }

    if (score <= 7) {
      return {
        level: 'Riesgo moderado',
        title: 'Hay senales que conviene revisar',
        text: 'Tus respuestas muestran algunos sintomas o factores relacionados con anemia. Este resultado no confirma anemia, pero seria recomendable buscar orientacion en un centro de salud.',
        className: 'mid'
      };
    }

    return {
      level: 'Riesgo alto',
      title: 'Mayor probabilidad de riesgo',
      text: 'Tus respuestas muestran varias senales asociadas a anemia. No es un diagnostico, pero si una razon para acudir a una evaluacion medica y solicitar analisis si el profesional lo indica.',
      className: 'high'
    };
  }

  function renderQuestions(profile) {
    currentProfile = profile;
    currentQuestions = questionBank[profile] || [];

    form.innerHTML = currentQuestions.map((question, questionIndex) => {
      const [text, ...answers] = question;
      return `
        <fieldset class="test-question">
          <legend>${questionIndex + 1}. ${text}</legend>
          ${answers.map(([label, value], answerIndex) => `
            <label>
              <input type="radio" name="q${questionIndex + 1}" value="${value}">
              ${label}
            </label>
          `).join('')}
        </fieldset>
      `;
    }).join('') + `
      <div class="test-actions">
        <button class="test-button" type="submit">Ver resultado</button>
        <button class="test-button secondary" type="button" data-test-reset>Reiniciar</button>
      </div>
    `;

    profileButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.profile === profile);
    });

    resetResult();
    updateProgress();
    form.classList.add('test-loaded');
  }

  function updateProgress() {
    if (!currentQuestions.length) {
      scoreOutput.textContent = '0';
      progressOutput.style.width = '0%';
      progressLabel.textContent = 'Elige un perfil';
      return;
    }

    const questions = Array.from(form.querySelectorAll('.test-question'));
    const answered = getAnsweredInputs().length;
    const score = getScore();
    const progress = Math.round((answered / questions.length) * 100);

    scoreOutput.textContent = score;
    progressOutput.style.width = `${progress}%`;
    progressLabel.textContent = `${answered} de ${questions.length} preguntas`;

    questions.forEach(question => {
      question.classList.toggle('answered', Boolean(question.querySelector('input:checked')));
    });
  }

  function showResult() {
    if (!currentQuestions.length) {
      resultBox.className = 'test-result incomplete show';
      resultLabel.textContent = 'Perfil pendiente';
      resultTitle.textContent = 'Selecciona un tipo de persona';
      resultText.textContent = 'El test necesita un perfil para cargar preguntas adecuadas.';
      return;
    }

    const questions = Array.from(form.querySelectorAll('.test-question'));
    const answered = getAnsweredInputs().length;

    if (answered < questions.length) {
      resultBox.className = 'test-result incomplete show';
      resultMeter.style.width = `${Math.round((answered / questions.length) * 100)}%`;
      resultLabel.textContent = 'Test incompleto';
      resultTitle.textContent = 'Faltan preguntas por responder';
      resultText.textContent = 'Completa todas las preguntas para calcular un resultado orientativo mas claro.';
      return;
    }

    const score = getScore();
    const risk = getRisk(score);
    const maxScore = currentQuestions.length * 2;
    const meterWidth = Math.max(12, Math.round((score / maxScore) * 100));

    resultBox.className = `test-result ${risk.className} show`;
    resultMeter.style.width = `${meterWidth}%`;
    resultLabel.textContent = `${risk.level} · ${score} de ${maxScore} puntos`;
    resultTitle.textContent = risk.title;
    resultText.textContent = risk.text;
  }

  function resetResult() {
    resultBox.className = 'test-result';
    resultMeter.style.width = '0%';
    resultLabel.textContent = 'Completa el test para ver tu resultado.';
    resultTitle.textContent = 'Resultado pendiente';
    resultText.textContent = 'Tu resultado aparecera aqui al responder todas las preguntas.';
  }

  profileButtons.forEach(button => {
    button.addEventListener('click', () => renderQuestions(button.dataset.profile));
  });

  form.addEventListener('change', updateProgress);

  form.addEventListener('submit', event => {
    event.preventDefault();
    updateProgress();
    showResult();
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  form.addEventListener('click', event => {
    if (!event.target.matches('[data-test-reset]')) return;
    form.reset();
    resetResult();
    updateProgress();
  });

  updateProgress();
}
