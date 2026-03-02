
const fortuneButton = document.getElementById('fortune-button');
const fortuneCard = document.getElementById('fortune-card');
const fortuneTitle = document.getElementById('fortune-title');
const fortuneText = document.getElementById('fortune-text');
const luckyNumberDisplay = document.getElementById('lucky-number');
const luckyColorDisplay = document.getElementById('lucky-color');
const streakBadge = document.getElementById('streak-badge');
const shareButton = document.getElementById('share-button');

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// --- Fortune Data ---
const fortunes = [
  { text: "오늘은 새로운 인연을 만날 수 있는 좋은 날입니다.", color: "핑크", number: 7 },
  { text: "생각지도 못한 행운이 찾아올 것입니다.", color: "골드", number: 1 },
  { text: "작은 노력이 큰 결실을 맺을 것입니다.", color: "그린", number: 3 },
  { text: "휴식이 필요한 시기입니다. 잠시 쉬어가세요.", color: "스카이블루", number: 0 },
  { text: "도전적인 일이 있겠지만, 결국 성공할 것입니다.", color: "레드", number: 9 },
  { text: "주변 사람들에게 친절을 베풀면 좋은 일이 생길 것입니다.", color: "옐로우", number: 5 },
  { text: "금전운이 좋은 날입니다. 작은 투자를 고려해보세요.", color: "퍼플", number: 8 },
  { text: "오랫동안 고민했던 문제가 해결될 것입니다.", color: "화이트", number: 4 },
  { text: "새로운 것을 배우기에 좋은 날입니다.", color: "네이비", number: 2 },
  { text: "오후 늦게 기쁜 소식이 들려올 것입니다.", color: "오렌지", number: 6 }
];

// --- Streak & Daily Limit Logic ---
function updateStreakDisplay() {
  const streak = localStorage.getItem('streak') || 0;
  streakBadge.textContent = `🔥 연속 ${streak}일째 도전 중!`;
}

function checkDailyStatus() {
  const lastPlayedDate = localStorage.getItem('lastPlayedDate');
  const today = new Date().toDateString();

  if (lastPlayedDate === today) {
    // Already played today
    const savedFortuneIndex = localStorage.getItem('savedFortuneIndex');
    if (savedFortuneIndex !== null) {
      showFortuneCard(fortunes[savedFortuneIndex], false);
    }
    fortuneButton.disabled = true;
    fortuneButton.textContent = "내일 또 오세요!";
  } else {
    // New day
    fortuneButton.disabled = false;
    fortuneButton.textContent = "운세 보기";
    fortuneCard.style.display = 'none';
  }
  updateStreakDisplay();
}

function handleFortuneClick() {
  const today = new Date().toDateString();
  const lastPlayedDate = localStorage.getItem('lastPlayedDate');
  
  // Streak Logic
  if (lastPlayedDate !== today) {
    let streak = parseInt(localStorage.getItem('streak') || 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastPlayedDate === yesterday.toDateString()) {
      streak++;
    } else {
      streak = 1; // Reset streak if missed a day
    }
    
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastPlayedDate', today);
    updateStreakDisplay();

    // Pick Random Fortune
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    localStorage.setItem('savedFortuneIndex', randomIndex);
    
    showFortuneCard(fortunes[randomIndex], true);
    
    // Disable Button
    fortuneButton.disabled = true;
    fortuneButton.textContent = "내일 또 오세요!";
  }
}

function showFortuneCard(data, isNew) {
  fortuneText.textContent = data.text;
  luckyNumberDisplay.textContent = data.number;
  luckyColorDisplay.textContent = data.color;
  fortuneCard.style.display = 'block';

  if (isNew) {
    // Trigger Confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// --- Share Logic ---
shareButton.addEventListener('click', () => {
  const shareData = {
    title: '오늘의 운세',
    text: `[오늘의 운세]\n"${fortuneText.textContent}"\n🍀 행운의 숫자: ${luckyNumberDisplay.textContent}\n🎨 행운의 색: ${luckyColorDisplay.textContent}\n\n당신의 운세도 확인해보세요!`,
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(console.error);
  } else {
    // Fallback for desktop
    navigator.clipboard.writeText(shareData.text + "\n" + shareData.url);
    alert('운세 결과가 클립보드에 복사되었습니다!');
  }
});

// Initialize
checkDailyStatus();
fortuneButton.addEventListener('click', handleFortuneClick);


// --- Theme Logic ---
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

// Handle Contact Form Submission
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-button');
const fileInput = document.getElementById('attachment');
const fileNameDisplay = document.getElementById('file-name');
const imagePreviewList = document.getElementById('image-preview-list');

let selectedFiles = []; // Array to store up to 5 files

// Handle File Input Change
fileInput.addEventListener('change', (e) => {
  let newFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
  const remainingSlots = 5 - selectedFiles.length;

  if (newFiles.length > remainingSlots) {
    alert(`최대 5장까지 첨부 가능합니다. 선택하신 사진 중 ${remainingSlots}장만 추가되었습니다.`);
    newFiles = newFiles.slice(0, remainingSlots);
  }

  // Assign a unique ID to each file for stable rendering
  newFiles.forEach(file => {
    file.uid = Math.random().toString(36).substr(2, 9) + Date.now();
    selectedFiles.push(file);
  });

  renderPreviews();
  fileInput.value = ''; // Reset input so same file can be selected again
});

function renderPreviews() {
  const currentUids = selectedFiles.map(f => f.uid);

  // 1. Remove DOM elements that are no longer in selectedFiles
  const existingItems = Array.from(imagePreviewList.querySelectorAll('.preview-item'));
  existingItems.forEach(item => {
    if (!currentUids.includes(item.dataset.uid)) {
      item.remove();
    }
  });

  // 2. Update status text
  if (selectedFiles.length === 0) {
    fileNameDisplay.textContent = '선택된 파일 없음';
    fileNameDisplay.style.color = 'var(--subtext-color)';
    return;
  }

  fileNameDisplay.textContent = `선택된 파일: ${selectedFiles.length}장`;
  fileNameDisplay.style.color = 'var(--button-bg)';

  // 3. Add only NEW preview items
  selectedFiles.forEach((file) => {
    const existing = imagePreviewList.querySelector(`[data-uid="${file.uid}"]`);
    if (existing) return; // Skip already rendered items

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewItem = document.createElement('div');
      previewItem.className = 'preview-item';
      previewItem.dataset.uid = file.uid; // Store UID for tracking
      
      const img = document.createElement('img');
      img.src = e.target.result;
      
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-photo-btn';
      removeBtn.innerHTML = '✕';
      removeBtn.onclick = (event) => {
        const item = event.target.closest('.preview-item');
        
        // CSS 애니메이션만 실행되도록 단순하게 클래스 추가
        item.classList.add('removing');

        // 400ms (CSS transition 시간) 대기 후 배열에서 삭제
        setTimeout(() => removeFileByUid(file.uid), 400);
      };

      previewItem.appendChild(img);
      previewItem.appendChild(removeBtn);
      imagePreviewList.appendChild(previewItem);
    };
    reader.readAsDataURL(file);
  });
}

function removeFileByUid(uid) {
  selectedFiles = selectedFiles.filter(f => f.uid !== uid);
  renderPreviews();
}

function resetFileInput() {
  selectedFiles = [];
  renderPreviews();
}

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
  
  // Remove the automatic 'attachment' from FormData and replace with our array
  formData.delete('attachment');
  selectedFiles.forEach((file) => {
    formData.append('attachment', file);
  });
  
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
      resetFileInput(); // Clear preview and file state
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
