const DURATION = 5 * 60; // 5 Minuten
let timeLeft = DURATION;
let timerInterval = null;

const motivations = [
  "Perfektion ist der Feind von Fortschritt, Christoph! Die 5 Minuten laufen – hol dir den Haken! 🚀",
  "Du musst nicht den ganzen Berg versetzen, sondern nur einen Stein bewegen. 5 Minuten reichen! 💪",
  "Konstanz schlägt Perfektionismus – jedes einzelne Mal. Wieder 5 Minuten für dich! 🔥",
  "Wenn der Kopf grübelt, lass die Hände arbeiten. 5 Minuten volle Konzentration! ⚡",
  "Jeder grüne Haken ist ein Beweis, dass du die Kontrolle zurückholst. Ab geht's! 🎯",
  "Das Schwerste ist das Anfangen – und genau das hast du schon geschafft. Zieh durch! 🙌",
  "Egal wie viel im Dokument landet: Dass du dich hingesetzt hast, ist schon ein Sieg! 🏆",
  "Rückschläge gehören dazu, aber du ziehst deine 5 Minuten trotzdem durch. Stark! 💥",
  "Kleine Schritte jeden Tag addieren sich zu riesigen Veränderungen. Drück durch! 👊",
  "Du zeigst jeden Tag, was in dir steckt. Mach die 5 Minuten voll und schick mir dein ✅!",
  "Fortschritt entsteht nicht durch Perfektion, sondern durch Tun. 5 Minuten jetzt! 🚀",
  "Kein Stress, kein Druck: Nur 5 Minuten Fokus und dann ist der Kopf wieder frei! ✨",
  "Der beste Zeitpunkt anzufangen ist jetzt. 5 Minuten Konzentration, Christoph! 🎯",
  "Mach es nicht perfekt, mach es einfach fertig. 5 Minuten laufen ab jetzt! 💪",
  "Fokus an, Zweifel aus. 5 Minuten gehören heute ganz deiner Zukunft! ⚡",
  "Große Ziele bestehen aus vielen kleinen 5-Minuten-Schritten. Weiter so! 🌟",
  "Lass dich nicht von der Angst vor dem Ergebnis bremsen. Einfach loslegen! 🔥",
  "5 Minuten heute sind 100% mehr als 0 Minuten. Hol dir den Haken! 🏆",
  "Jeder Haken auf deiner Liste stärkt dein Selbstbewusstsein. Zieh es durch! 👊",
  "Der Startknopf ist gedrückt – mehr musst du heute gar nicht leisten. Stark! 🙌",
  "Mach dir keinen Kopf über morgen. Heute zählen nur diese 5 Minuten! ⏳",
  "Erfolg ist die Summe kleiner Anstrengungen. Wieder ein Schritt geschafft! 🚀",
  "Dranbleiben ist eine Superkraft, Christoph. Mach deine 5 Minuten voll! 💪",
  "Erledigt ist besser als perfekt. Nur 5 Minuten Fokus, dann hast du es! ✨",
  "Dein zukünftiges Ich wird dir für diese 5 Minuten danken. Auf geht's! 🎯",
  "Vergleiche dich nicht mit anderen, sondern nur mit dir von gestern. 5 Minuten! ⚡",
  "Ein kleiner Haken heute ist ein großer Schritt für deinen Monat. Zieh durch! 🔥",
  "Gedanken stoppen, Hände bewegen. 5 Minuten durchziehen und Haken setzen! 👊",
  "Du bist stur genug für 5 Minuten Fokus. Hol dir deinen Haken ab! 🏆",
  "30 Tage, 30 Haken: Du baust dir gerade eine echte Gewohnheit auf. Weiter so, Christoph! 🚀"
];

const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const historyGrid = document.getElementById('historyGrid');
const successCountEl = document.getElementById('successCount');

function formatDateKey(date) {
  return date.toISOString().split('T')[0];
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function renderHistory() {
  historyGrid.innerHTML = '';
  const today = new Date();
  let successCount = 0;

  for (let i = 14; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateKey = formatDateKey(d);
    const isDone = localStorage.getItem('done_' + dateKey) === 'true';

    if (isDone) {
      successCount++;
    }

    const dayName = i === 0 ? 'Heute' : d.toLocaleDateString('de-DE', { weekday: 'short' });

    const card = document.createElement('div');
    card.className = 'day-card';
    card.innerHTML = `
      <span class="day-name">${dayName}</span>
      <span class="day-status">${isDone ? '✅' : '❌'}</span>
    `;
    historyGrid.appendChild(card);
  }

  successCountEl.textContent = successCount;

  const todayKey = formatDateKey(today);
  if (localStorage.getItem('done_' + todayKey) === 'true') {
    startBtn.disabled = true;
    startBtn.textContent = 'Heute erledigt! Strong! 🎉';
  }
}

function completeSession() {
  const todayKey = formatDateKey(new Date());
  localStorage.setItem('done_' + todayKey, 'true');
  startBtn.disabled = true;
  startBtn.textContent = 'Heute erledigt! Strong! 🎉';
  renderHistory();
  alert('Stark, Christoph! 5 Minuten geschafft. Haken ist gesetzt! Schick Gustav jetzt dein ✅ auf WhatsApp! 🚀');
}

function getRandomMotivation() {
  return motivations[Math.floor(Math.random() * motivations.length)];
}

startBtn.addEventListener('click', () => {
  if (timerInterval) return;

  startBtn.disabled = true;
  startBtn.textContent = getRandomMotivation();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      completeSession();
    }
  }, 1000);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateTimerDisplay();
  renderHistory();

  // Service Worker registration für PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW registration failed:', err));
  }
});
