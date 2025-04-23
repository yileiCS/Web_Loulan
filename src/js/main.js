document.addEventListener('DOMContentLoaded', function () {
  // Language switching functionality
  const htmlElement = document.documentElement;
  const langButtons = document.querySelectorAll('.lang-btn');

  // Set default language to Chinese
  htmlElement.setAttribute('lang', 'zh-CN');

  // Check if there's a stored language preference
  const storedLang = localStorage.getItem('preferredLanguage');
  if (storedLang) {
    if (storedLang === 'zh-CN') {
      htmlElement.setAttribute('lang', 'zh-CN');
      setActiveButton('zh');
    } else {
      htmlElement.setAttribute('lang', 'en');
      setActiveButton('en');
    }
  }

  langButtons.forEach(button => {
    button.addEventListener('click', function () {
      const lang = this.getAttribute('data-lang');

      // Update HTML lang attribute
      if (lang === 'zh') {
        htmlElement.setAttribute('lang', 'zh-CN');
        localStorage.setItem('preferredLanguage', 'zh-CN');
      } else {
        htmlElement.setAttribute('lang', 'en');
        localStorage.setItem('preferredLanguage', 'en');
      }

      // Update active button
      setActiveButton(lang);
    });
  });

  function setActiveButton(lang) {
    langButtons.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // 音乐控制功能
  const musicIcon = document.querySelector('.music-icon');
  const pageAudio = document.getElementById('pageAudio');
  const homeAudio = document.getElementById('homeAudio');

  // 获取当前页面的音频元素
  const currentAudio = pageAudio || homeAudio;

  // 检查音乐状态并设置
  function initMusicState() {
    const musicState = localStorage.getItem('musicState');

    if (musicIcon && currentAudio) {
      if (musicState === 'paused') {
        // 音乐应该是暂停状态
        currentAudio.pause();
        musicIcon.classList.add('paused');
      } else {
        // 尝试播放音乐
        const playPromise = currentAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(function (error) {
            console.log('自动播放音频失败: ', error);
            musicIcon.classList.add('paused');
            localStorage.setItem('musicState', 'paused');
          });
        }
      }

      // 点击音乐图标控制音频播放/暂停
      musicIcon.addEventListener('click', function () {
        if (currentAudio.paused) {
          currentAudio.play();
          musicIcon.classList.remove('paused');
          localStorage.setItem('musicState', 'playing');
        } else {
          currentAudio.pause();
          musicIcon.classList.add('paused');
          localStorage.setItem('musicState', 'paused');
        }
      });
    }
  }

  // 页面加载时初始化音乐状态
  initMusicState();

  document.addEventListener('click', function enableAudio() {
    if (currentAudio && localStorage.getItem('musicState') !== 'paused') {
      currentAudio.play().catch(error => console.log('播放失败:', error));
    }
    document.removeEventListener('click', enableAudio);
  }, { once: true });

  // Navigation functionality - for all pages
  const navItems = document.querySelectorAll('.nav-item');

  if (navItems.length > 0) {
    navItems.forEach(item => {
      item.addEventListener('click', function () {
        const page = this.getAttribute('data-page');
        // 获取当前页面名称
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop().split('.')[0];

        // 如果点击的是当前页面，不进行跳转
        if (page === currentPage) {
          return;
        }

        navigateToPage(page);
      });
    });
  }

  function navigateToPage(page) {
    if (currentAudio && !currentAudio.paused) {
      localStorage.setItem('musicState', 'playing');
    } else {
      localStorage.setItem('musicState', 'paused');
    }

    // 判断当前是否在index.html
    const isIndex = window.location.pathname.endsWith('index.html')
      || window.location.pathname.endsWith('/');

    // 根据当前页面构建正确的URL
    const prefix = isIndex ? 'pages/' : '';
    window.location.href = `${prefix}${page}.html`;
  }

  // Add a simple animation for the hero text if on home page
  const videoOverlay = document.querySelector('.video-overlay');
  if (videoOverlay) {
    setTimeout(() => {
      videoOverlay.style.opacity = 0;
      videoOverlay.style.transition = 'opacity 0.8s ease';

      setTimeout(() => {
        videoOverlay.style.opacity = 1;
      }, 100);
    }, 500);
  }

  // 入口点动画和交互
  const entrancePoint = document.querySelector('.entrance-point');
  const imageNavigation = document.querySelector('.image-navigation');
  const calligraphyContainer = document.querySelector('.calligraphy-container');

  if (entrancePoint && imageNavigation && calligraphyContainer) {
    entrancePoint.addEventListener('click', function () {
      // 隐藏入口点
      entrancePoint.style.opacity = '0';

      calligraphyContainer.querySelectorAll('.calligraphy-character').forEach(char => {
        const rect = char.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        char.style.transformOrigin = `${centerX}px ${centerY}px`;

        char.classList.add('zoom-fade');
      });

      setTimeout(() => {
        calligraphyContainer.style.display = 'none';
        imageNavigation.classList.remove('hidden');

        imageNavigation.style.animation = 'fadeIn 1s forwards';
      }, 1500);
    });
  }
}); 