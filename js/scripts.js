// Selecciona todos los elementos que tienen la clase .reveal.
// Esos elementos empiezan ocultos y aparecen con animacion al hacer scroll.
const reveals = document.querySelectorAll('.reveal');

// IntersectionObserver permite detectar cuando un elemento entra en la pantalla.
// Si el navegador lo soporta, se usa para activar animaciones solo cuando hacen falta.
if ('IntersectionObserver' in window) {
  // observer observa varios elementos y recibe una lista de "entries" con su estado.
  const observer = new IntersectionObserver((entries) => {
    // Recorre cada elemento observado.
    entries.forEach((entry, index) => {
      // isIntersecting significa que el elemento ya se ve en la pantalla.
      if (entry.isIntersecting) {
        // Agrega la clase visible con un pequeno retraso para crear efecto escalonado.
        setTimeout(() => entry.target.classList.add('visible'), index * 80);

        // Deja de observar ese elemento porque la animacion solo debe ocurrir una vez.
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Inicia la observacion de cada elemento con clase reveal.
  reveals.forEach(element => observer.observe(element));
} else {
  // Si el navegador es antiguo y no soporta IntersectionObserver,
  // se muestran los elementos directamente para no dejar contenido oculto.
  reveals.forEach(element => element.classList.add('visible'));
}

// Busca todos los botones/cabeceras de acordeon.
document.querySelectorAll('.acord-header').forEach(header => {
  // Cuando se hace clic en una cabecera, se abre o cierra su contenido.
  header.addEventListener('click', () => {
    // closest busca el contenedor padre del acordeon.
    const item = header.closest('.acord-item');

    // Dentro del item, .acord-body es el contenido desplegable.
    const body = item.querySelector('.acord-body');

    // Guarda si el item ya estaba abierto antes del clic.
    const isOpen = item.classList.contains('acord-open');

    // Cierra todos los acordeones antes de abrir uno nuevo.
    document.querySelectorAll('.acord-item').forEach(element => {
      element.classList.remove('acord-open');
      const elementBody = element.querySelector('.acord-body');

      // maxHeight en null hace que el contenido vuelva a quedar cerrado.
      if (elementBody) elementBody.style.maxHeight = null;
    });

    // Si el item no estaba abierto, se abre y se ajusta su altura real.
    if (!isOpen) {
      item.classList.add('acord-open');
      body.style.maxHeight = `${body.scrollHeight}px`;
    }
  });
});

// Abre automaticamente el primer acordeon de la pagina, si existe.
const firstAcord = document.querySelector('.acord-item');
if (firstAcord) {
  firstAcord.classList.add('acord-open');
  const firstBody = firstAcord.querySelector('.acord-body');

  // scrollHeight obtiene la altura necesaria para mostrar todo el contenido interno.
  if (firstBody) firstBody.style.maxHeight = `${firstBody.scrollHeight}px`;
}

// ===== TEST ORIENTATIVO DE RIESGO DE ANEMIA =====
// Busca el contenedor del test. Solo existe en diagnostico.html.
const anemiaTest = document.querySelector('[data-anemia-test]');

// Todo el codigo del test se ejecuta solamente si la pagina tiene data-anemia-test.
if (anemiaTest) {
  // Botones para escoger el perfil: adolescente, hombre, mujer, gestante, adulto mayor.
  const profileButtons = Array.from(anemiaTest.querySelectorAll('[data-profile]'));

  // Formulario donde se cargaran las preguntas de forma dinamica.
  const form = anemiaTest.querySelector('[data-test-form]');

  // Elementos visuales donde se muestran puntaje, progreso y resultado.
  const scoreOutput = anemiaTest.querySelector('[data-test-score]');
  const progressOutput = anemiaTest.querySelector('[data-test-progress]');
  const progressLabel = anemiaTest.querySelector('[data-test-progress-label]');
  const resultBox = anemiaTest.querySelector('[data-test-result]');
  const resultMeter = anemiaTest.querySelector('[data-result-meter]');
  const resultLabel = anemiaTest.querySelector('[data-result-label]');
  const resultTitle = anemiaTest.querySelector('[data-result-title]');
  const resultText = anemiaTest.querySelector('[data-result-text]');

  // currentProfile guarda el perfil seleccionado actualmente.
  let currentProfile = '';

  // currentQuestions guarda las preguntas cargadas para ese perfil.
  let currentQuestions = [];

  // Banco de preguntas del test.
  // Cada perfil tiene una lista de preguntas.
  // Cada pregunta tiene el texto y tres respuestas con puntajes 0, 1 o 2.
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

  // Obtiene todas las respuestas seleccionadas dentro del formulario.
  function getAnsweredInputs() {
    return Array.from(form.querySelectorAll('.test-question'))
      .map(question => question.querySelector('input:checked'))
      .filter(Boolean);
  }

  // Calcula el puntaje sumando el valor numerico de cada respuesta marcada.
  function getScore() {
    return getAnsweredInputs().reduce((total, input) => total + Number(input.value), 0);
  }

  // Convierte el puntaje total en un nivel de riesgo orientativo.
  function getRisk(score) {
    // De 0 a 3 puntos se considera riesgo bajo.
    if (score <= 3) {
      return {
        level: 'Riesgo bajo',
        title: 'Probabilidad baja segun tus respuestas',
        text: 'Tus respuestas muestran pocas senales asociadas a anemia. Mantener una alimentacion variada, vitamina C con comidas ricas en hierro y controles regulares sigue siendo importante.',
        className: 'low'
      };
    }

    // De 4 a 7 puntos se considera riesgo moderado.
    if (score <= 7) {
      return {
        level: 'Riesgo moderado',
        title: 'Hay senales que conviene revisar',
        text: 'Tus respuestas muestran algunos sintomas o factores relacionados con anemia. Este resultado no confirma anemia, pero seria recomendable buscar orientacion en un centro de salud.',
        className: 'mid'
      };
    }

    // 8 puntos o mas se considera riesgo alto.
    return {
      level: 'Riesgo alto',
      title: 'Mayor probabilidad de riesgo',
      text: 'Tus respuestas muestran varias senales asociadas a anemia. No es un diagnostico, pero si una razon para acudir a una evaluacion medica y solicitar analisis si el profesional lo indica.',
      className: 'high'
    };
  }

  // Dibuja en pantalla las preguntas correspondientes al perfil elegido.
  function renderQuestions(profile) {
    // Guarda el perfil seleccionado.
    currentProfile = profile;
    // Busca las preguntas para ese perfil. Si no encuentra, usa una lista vacia.
    currentQuestions = questionBank[profile] || [];

    // Crea el HTML de cada pregunta y sus respuestas.
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

    // Marca visualmente el boton del perfil activo.
    profileButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.profile === profile);
    });

    // Limpia cualquier resultado anterior.
    resetResult();
    // Actualiza el progreso desde cero.
    updateProgress();
    // Activa una animacion de entrada en las preguntas.
    form.classList.add('test-loaded');
  }

  // Actualiza la barra de progreso, el puntaje y el estado visual de preguntas respondidas.
  function updateProgress() {
    // Si no hay preguntas cargadas, el usuario todavia no eligio perfil.
    if (!currentQuestions.length) {
      scoreOutput.textContent = '0';
      progressOutput.style.width = '0%';
      progressLabel.textContent = 'Elige un perfil';
      return;
    }

    // Lista de preguntas que ya estan dibujadas en el formulario.
    const questions = Array.from(form.querySelectorAll('.test-question'));
    // Cantidad de preguntas respondidas.
    const answered = getAnsweredInputs().length;
    // Puntaje acumulado hasta el momento.
    const score = getScore();
    // Porcentaje de avance para llenar la barra.
    const progress = Math.round((answered / questions.length) * 100);

    scoreOutput.textContent = score;
    progressOutput.style.width = `${progress}%`;
    progressLabel.textContent = `${answered} de ${questions.length} preguntas`;

    // Resalta las preguntas que ya fueron contestadas.
    questions.forEach(question => {
      question.classList.toggle('answered', Boolean(question.querySelector('input:checked')));
    });
  }

  // Muestra el resultado final del test.
  function showResult() {
    // Si no hay perfil seleccionado, el test no puede calcular nada.
    if (!currentQuestions.length) {
      resultBox.className = 'test-result incomplete show';
      resultLabel.textContent = 'Perfil pendiente';
      resultTitle.textContent = 'Selecciona un tipo de persona';
      resultText.textContent = 'El test necesita un perfil para cargar preguntas adecuadas.';
      return;
    }

    // Vuelve a obtener las preguntas para comprobar si todas fueron respondidas.
    const questions = Array.from(form.querySelectorAll('.test-question'));
    const answered = getAnsweredInputs().length;

    // Si falta alguna respuesta, se muestra un mensaje de test incompleto.
    if (answered < questions.length) {
      resultBox.className = 'test-result incomplete show';
      resultMeter.style.width = `${Math.round((answered / questions.length) * 100)}%`;
      resultLabel.textContent = 'Test incompleto';
      resultTitle.textContent = 'Faltan preguntas por responder';
      resultText.textContent = 'Completa todas las preguntas para calcular un resultado orientativo mas claro.';
      return;
    }

    // Con todas las preguntas respondidas, se calcula el puntaje final.
    const score = getScore();

    // getRisk transforma el puntaje en bajo, moderado o alto.
    const risk = getRisk(score);

    // maxScore es el puntaje maximo posible para el perfil elegido.
    const maxScore = currentQuestions.length * 2;

    // meterWidth controla cuanto se llena la barra del resultado.
    const meterWidth = Math.max(12, Math.round((score / maxScore) * 100));

    // Actualiza el bloque visual del resultado con clase, barra y textos.
    resultBox.className = `test-result ${risk.className} show`;
    resultMeter.style.width = `${meterWidth}%`;
    resultLabel.textContent = `${risk.level} · ${score} de ${maxScore} puntos`;
    resultTitle.textContent = risk.title;
    resultText.textContent = risk.text;
  }

  // Devuelve el bloque de resultado a su estado inicial.
  function resetResult() {
    resultBox.className = 'test-result';
    resultMeter.style.width = '0%';
    resultLabel.textContent = 'Completa el test para ver tu resultado.';
    resultTitle.textContent = 'Resultado pendiente';
    resultText.textContent = 'Tu resultado aparecera aqui al responder todas las preguntas.';
  }

  // Cada boton de perfil carga un grupo distinto de preguntas.
  profileButtons.forEach(button => {
    button.addEventListener('click', () => renderQuestions(button.dataset.profile));
  });

  // Cada vez que cambia una respuesta, se actualiza puntaje y progreso.
  form.addEventListener('change', updateProgress);

  // Cuando se envia el formulario, se evita recargar la pagina y se muestra el resultado.
  form.addEventListener('submit', event => {
    // preventDefault evita el comportamiento normal del formulario.
    event.preventDefault();
    updateProgress();
    showResult();

    // Desplaza suavemente la pagina hacia el resultado.
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Escucha clics dentro del formulario para detectar el boton "Reiniciar".
  form.addEventListener('click', event => {
    // Si el clic no fue en el boton con data-test-reset, no hace nada.
    if (!event.target.matches('[data-test-reset]')) return;

    // Limpia respuestas, resultado y progreso.
    form.reset();
    resetResult();
    updateProgress();
  });

  // Estado inicial del test al cargar la pagina.
  updateProgress();
}
