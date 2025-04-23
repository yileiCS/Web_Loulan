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

  // music control functionality
  const musicIcon = document.querySelector('.music-icon');
  const pageAudio = document.getElementById('pageAudio');
  const homeAudio = document.getElementById('homeAudio');

  // get the audio element of the current page
  const currentAudio = pageAudio || homeAudio;

  // check the music state and set it
  function initMusicState() {
    const musicState = localStorage.getItem('musicState');

    if (musicIcon && currentAudio) {
      if (musicState === 'paused') {
        // the music should be paused
        currentAudio.pause();
        musicIcon.classList.add('paused');
      } else {
        // try to play the music
        const playPromise = currentAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(function (error) {
            console.log('自动播放音频失败: ', error);
            musicIcon.classList.add('paused');
            localStorage.setItem('musicState', 'paused');
          });
        }
      }

      // click the music icon to control the audio playback/pause
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

  // initialize the music state when the page loads
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
        // get the current page name
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop().split('.')[0];

        // if the clicked item is the current page, do not navigate
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

    // check if the current page is index.html
    const isIndex = window.location.pathname.endsWith('index.html')
      || window.location.pathname.endsWith('/');

    // build the correct URL based on the current page
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

  // entrance point animation and interaction
  const entrancePoint = document.querySelector('.entrance-point');
  const imageNavigation = document.querySelector('.image-navigation');
  const calligraphyContainer = document.querySelector('.calligraphy-container');

  if (entrancePoint && imageNavigation && calligraphyContainer) {
    entrancePoint.addEventListener('click', function () {
      // hide the entrance point
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