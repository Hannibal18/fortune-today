
const fortuneButton = document.getElementById('fortune-button');
const fortuneDisplay = document.getElementById('fortune-display');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
  body.setAttribute('data-theme', 'dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const isDark = body.getAttribute('data-theme') === 'dark';
  if (isDark) {
    body.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  } else {
    body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  }
});

const fortunes = [
  "오늘은 새로운 인연을 만날 수 있는 좋은 날입니다.",
  "생각지도 못한 행운이 찾아올 것입니다.",
  "작은 노력이 큰 결실을 맺을 것입니다.",
  "휴식이 필요한 시기입니다. 잠시 쉬어가세요.",
  "도전적인 일이 있겠지만, 결국 성공할 것입니다.",
  "주변 사람들에게 친절을 베풀면 좋은 일이 생길 것입니다.",
  "금전운이 좋은 날입니다. 작은 투자를 고려해보세요.",
  "오랫동안 고민했던 문제가 해결될 것입니다.",
  "새로운 것을 배우기에 좋은 날입니다.",
  "행운의 색은 파란색입니다."
];

fortuneButton.addEventListener('click', () => {
  // Display a random fortune
  const randomIndex = Math.floor(Math.random() * fortunes.length);
  const randomFortune = fortunes[randomIndex];
  fortuneDisplay.textContent = randomFortune;

  // To re-trigger the animation, we can remove and re-add the element or a class.
  fortuneDisplay.style.animation = 'none';
  void fortuneDisplay.offsetWidth; // Trigger a reflow
  fortuneDisplay.style.animation = ''; 
});
