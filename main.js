
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

// Handle Fortune Button
fortuneButton.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * fortunes.length);
  const randomFortune = fortunes[randomIndex];
  fortuneDisplay.textContent = randomFortune;
  fortuneDisplay.style.animation = 'none';
  void fortuneDisplay.offsetWidth;
  fortuneDisplay.style.animation = ''; 
});

// Handle Contact Form Submission
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-button');
const fileInput = document.getElementById('attachment');
const fileNameDisplay = document.getElementById('file-name');

// File Input Change Listener
fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    fileNameDisplay.textContent = `선택된 파일: ${fileInput.files[0].name}`;
    fileNameDisplay.style.color = 'var(--button-bg)';
  } else {
    fileNameDisplay.textContent = '선택된 파일 없음';
    fileNameDisplay.style.color = 'var(--subtext-color)';
  }
});

// Auto-focus next input on Enter (Enhanced for iOS)
const inputs = contactForm.querySelectorAll('input:not([type="file"]), textarea');
inputs.forEach((input, index) => {
  input.addEventListener('keydown', (e) => {
    // Check both Enter key and its code for broader compatibility
    if ((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey) {
      if (input.tagName !== 'TEXTAREA') {
        e.preventDefault(); // Stop default form submission
        const nextInput = inputs[index + 1];
        if (nextInput) {
          // Blur current input and focus next immediately
          input.blur(); 
          nextInput.focus();
        }
      }
    }
  });
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  
  submitBtn.disabled = true;
  submitBtn.textContent = '보내는 중...';
  formStatus.textContent = '';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      formStatus.textContent = '문의가 성공적으로 전송되었습니다! 곧 답변 드리겠습니다.';
      formStatus.className = 'form-status success';
      contactForm.reset();
    } else {
      const data = await response.json();
      if (Object.hasOwn(data, 'errors')) {
        formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
      } else {
        formStatus.textContent = '죄송합니다. 오류가 발생했습니다.';
      }
      formStatus.className = 'form-status error';
    }
  } catch (error) {
    formStatus.textContent = '네트워크 연결 오류가 발생했습니다. 나중에 다시 시도해 주세요.';
    formStatus.className = 'form-status error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '보내기';
  }
});
