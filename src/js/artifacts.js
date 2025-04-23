document.addEventListener('DOMContentLoaded', function () {
  // Initialize language settings
  const currentLang = localStorage.getItem('language') || 'zh';
  document.documentElement.setAttribute('lang', currentLang === 'zh' ? 'zh-CN' : 'en');
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });

  // Hide artifacts section initially
  const artifactsSection = document.querySelector('.artifacts-section');
  const contentContainer = document.querySelector('.content-container');
  const excavateContainer = document.querySelector('.excavate-container');
  const dustParticles = document.getElementById('dustParticles');

  if (contentContainer) {
    contentContainer.style.display = 'none';
  }

  // Excavate button functionality
  const excavateBtn = document.querySelector('.excavate-btn');
  const excavateCircle = document.querySelector('.excavate-circle');

  // 使整个excavate-container可点击
  function handleExcavation() {
    // Play excavation sound
    const excavateSound = new Audio('../public/audio/excavate.mp3');
    excavateSound.volume = 0.5;
    excavateSound.play().catch(e => console.log('Audio play failed:', e));

    // Add excavation animation
    excavateCircle.style.transform = 'scale(1.5)';
    excavateCircle.style.opacity = '0';

    // Add dust particle effect
    createDustParticles();

    // Add excavated class to body to show solid background
    document.body.classList.add('excavated');

    // 隐藏背景和遮罩层
    const pageBackground = document.querySelector('.page-background');
    const backgroundOverlay = document.querySelector('.background-overlay');
    if (pageBackground) pageBackground.style.display = 'none';
    if (backgroundOverlay) backgroundOverlay.style.display = 'none';

    setTimeout(() => {
      // Hide excavate container
      if (excavateContainer) {
        excavateContainer.style.display = 'none';
      }

      // Show artifacts with animation
      if (contentContainer) {
        contentContainer.style.display = 'block';
        contentContainer.classList.add('fade-in');

        // Smooth scroll to content area
        contentContainer.scrollIntoView({ behavior: 'smooth' });

        // Add artifact display effect one by one
        const artifacts = document.querySelectorAll('.artifact');
        artifacts.forEach((artifact, index) => {
          artifact.style.opacity = '0';
          artifact.style.transform = 'translateY(20px)';
          setTimeout(() => {
            artifact.style.opacity = '1';
            artifact.style.transform = 'translateY(0)';
            artifact.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            // 移除3D效果调用，替换为简单的对齐处理
            alignArtifactImage(artifact);

            // 最后一个文物显示后初始化滑动器
            if (index === artifacts.length - 1) {
              setTimeout(initSlider, 300);
            }
          }, 200 * index);
        });
      }
    }, 1000);
  }

  if (excavateBtn && excavateCircle) {
    // Add hover effect
    excavateCircle.addEventListener('mouseenter', function () {
      excavateCircle.style.transform = 'scale(1.1)';
      excavateCircle.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.7)';
    });

    excavateCircle.addEventListener('mouseleave', function () {
      excavateCircle.style.transform = 'scale(1)';
      excavateCircle.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.5)';
    });

    // 点击按钮触发挖掘
    excavateBtn.addEventListener('click', handleExcavation);
  }

  // 让整个excavate-container可点击
  if (excavateContainer) {
    excavateContainer.addEventListener('click', handleExcavation);
  }

  // Get the elements
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const artifactsContainer = document.querySelector('.artifacts-container');
  const artifacts = document.querySelectorAll('.artifact');
  const modal = document.getElementById('artifactModal');
  const exitBtn = document.querySelector('.exit-btn');

  // Page audio
  const pageAudio = document.getElementById('pageAudio');
  if (pageAudio) {
    pageAudio.volume = 0.3;

    // Start audio when user interacts with the page
    document.addEventListener('click', function () {
      if (pageAudio.paused) {
        pageAudio.play().catch(e => console.log('Audio play failed:', e));
      }
    }, { once: true });
  }

  // Archaeology video segment handling
  const archaeologyVideo = document.getElementById('archaeology-video');
  if (archaeologyVideo) {
    const sourceElem = archaeologyVideo.querySelector('source');
    const videoSegments = [
      '../public/videos/video_LouLanHistorical1.mp4',
      '../public/videos/video_LouLanHistorical2.mp4',
      '../public/videos/video_LouLanHistorical3.mp4'
    ];
    let currentSegment = 0;
    archaeologyVideo.addEventListener('ended', () => {
      currentSegment = (currentSegment + 1) % videoSegments.length;
      sourceElem.src = videoSegments[currentSegment];
      archaeologyVideo.load();
      archaeologyVideo.play();
    });
  }

  // Slider functionality
  let currentSlide = 0;
  let totalSlides = 0;

  // 获取DOM元素
  const sliderDots = document.getElementById('sliderDots');

  // 基于当前视口宽度决定显示数量
  function getItemsPerView() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  // 初始化滑动器
  function initSlider() {
    if (!artifactsContainer) return;

    const artifacts = artifactsContainer.querySelectorAll('.artifact');
    if (!artifacts.length) return;

    // 固定为2页，确保所有文物能显示
    totalSlides = 2;

    // 重置当前页和更新UI
    currentSlide = 0;
    updateSliderUI();

    // 生成导航点
    createSliderDots();

    // 确保按钮可见
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';

    // 为所有文物应用对齐处理
    artifacts.forEach(artifact => {
      alignArtifactImage(artifact);
    });

    console.log(`滑动器初始化完成: ${artifacts.length}个项目, ${totalSlides}页`);
  }

  // 更新滑动器UI（按钮状态和导航点）
  function updateSliderUI() {
    // 更新按钮状态
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;

    // 更新滑动位置
    updateSliderPosition();
  }

  // 更新滑动位置
  function updateSliderPosition() {
    if (!artifactsContainer) return;

    const artifacts = artifactsContainer.querySelectorAll('.artifact');
    const totalArtifacts = artifacts.length;

    // 检查是否有足够的文物
    console.log(`正在更新滑动位置：总共${totalArtifacts}个文物，当前页${currentSlide}`);

    if (currentSlide === 0) {
      // 第一页 - 显示前5个
      const firstPageCount = 5;

      // 设置文物显示状态
      for (let i = 0; i < totalArtifacts; i++) {
        if (artifacts[i]) {
          if (i < firstPageCount) {
            artifacts[i].style.display = 'flex'; // 显示前5个
          } else {
            artifacts[i].style.display = 'none'; // 隐藏剩余的
          }
        }
      }

      // 重置容器位置
      artifactsContainer.style.transform = 'translateX(0)';

    } else {
      // 第二页 - 显示剩余文物
      // 设置文物显示状态
      for (let i = 0; i < totalArtifacts; i++) {
        if (artifacts[i]) {
          if (i >= 5) {
            artifacts[i].style.display = 'flex'; // 显示剩余的
          } else {
            artifacts[i].style.display = 'none'; // 隐藏前5个
          }
        }
      }

      // 重置容器位置
      artifactsContainer.style.transform = 'translateX(0)';
    }
  }

  // 切换到指定页
  function goToSlide(index) {
    currentSlide = index;
    updateSliderUI();
  }

  // 下一页
  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      updateSliderUI();
    }
  }

  // 上一页
  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
      updateSliderUI();
    }
  }

  // 窗口大小变化时重新计算
  function handleResize() {
    const newItemsPerView = getItemsPerView();
    const artifacts = artifactsContainer ? artifactsContainer.querySelectorAll('.artifact') : [];

    // 重新计算总页数
    const newTotalSlides = Math.ceil(artifacts.length / newItemsPerView);

    // 如果页数变化或者当前页超出新范围，重置滑动器
    if (newTotalSlides !== totalSlides || currentSlide >= newTotalSlides) {
      totalSlides = newTotalSlides;
      currentSlide = Math.min(currentSlide, totalSlides - 1);
      updateSliderUI();
      createSliderDots();
    }
  }

  // 绑定事件
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // 键盘导航
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // 窗口大小变化
  window.addEventListener('resize', handleResize);

  // 初始化滑动器
  window.addEventListener('load', () => {
    // 延迟初始化以确保DOM完全渲染
    setTimeout(initSlider, 100);

    // 为所有文物应用对齐处理
    const allArtifacts = document.querySelectorAll('.artifact');
    allArtifacts.forEach(artifact => {
      alignArtifactImage(artifact);
    });
  });

  // Slide navigation with buttons
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeModal();
    }
  });

  // Touch support for swiping
  let touchStartX = 0;
  let touchEndX = 0;

  if (artifactsContainer) {
    artifactsContainer.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    });

    artifactsContainer.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
    }
  }

  // Create dust particles effect
  function createDustParticles() {
    if (!dustParticles) return;

    dustParticles.innerHTML = '';
    dustParticles.style.display = 'block';

    for (let i = 0; i < 60; i++) {
      const dust = document.createElement('div');
      dust.className = 'dust';
      dust.style.left = Math.random() * 100 + '%';
      dust.style.top = Math.random() * 100 + '%';
      dust.style.width = (Math.random() * 5 + 2) + 'px';
      dust.style.height = (Math.random() * 5 + 2) + 'px';
      dust.style.opacity = Math.random() * 0.7 + 0.3;
      dust.style.setProperty('--x-move', (Math.random() * 200 - 100) + 'px');
      dust.style.animationDuration = (Math.random() * 3 + 2) + 's';
      dust.style.animationDelay = (Math.random() * 2) + 's';
      dustParticles.appendChild(dust);
    }

    setTimeout(() => {
      dustParticles.style.display = 'none';
    }, 5000);
  }

  // Artifact data
  const artifactData = {
    artifact1: {
      title: "楼兰大宜子孙锦",
      titleEn: "Loulan Brocade of Great Blessings for Descendants",
      imgSrc: "../public/images/antique_DaYiZiSunJin.png",
      description: "这件丝织物缠绕着诸多难解之谜，出土于楼兰古国遗址。其上以汉隶绣有\"大宜子孙\"四字，顾名思义为祈求子孙昌盛繁衍之意<a href=\"#ref1\" class=\"citation\">1</a>。丝织工艺精湛，采用丝线程\"提花\"技术织就，色彩在千年风蚀中依然鲜艳，令现代研究者惊叹不已<a href=\"#ref2\" class=\"citation\">2</a>。这件锦在两汉时期的纹饰风格鲜明，图案丰富多彩，彰显了汉代装饰艺术特色<a href=\"#ref3\" class=\"citation\">3</a>。\n\n<div class=\"references\">\n<h3>参考文献</h3>\n<ol>\n<li id=\"ref1\">若羌县文物发声. <a href=\"https://www.xjrq.gov.cn/rqxrmzf/c108794/202208/674cdaac5b7145fa96a060b5a0ae040b.shtml\" target=\"_blank\">文物发声丨楼兰大宜子孙锦</a>. 2022年8月.</li>\n<li id=\"ref2\">若羌县人民政府网. 楼兰出土丝织品研究. 2022.</li>\n<li id=\"ref3\">张义祥. 丝路传奇，楼兰遗韵，子孙织锦，祈寿延孙. 2022.</li>\n</ol>\n</div>",
      descriptionEn: "This silk fabric, wrapped in many unsolved mysteries, was unearthed from the ruins of the ancient Loulan Kingdom. The Han Dynasty clerical script characters \"Great Blessings for Descendants\" are embroidered on it, implying a prayer for flourishing offspring<a href=\"#ref1\" class=\"citation\">1</a>. The exquisite silk weaving craftsmanship uses the 'jacquard' technique, and the colors remain vivid despite thousands of years of wind erosion, amazing modern researchers<a href=\"#ref2\" class=\"citation\">2</a>. The brocade displays distinctive decorative art styles of the Han Dynasty period, with rich patterns showcasing the characteristics of Han decorative arts<a href=\"#ref3\" class=\"citation\">3</a>.\n\n<div class=\"references\">\n<h3>References</h3>\n<ol>\n<li id=\"ref1\">Ruoqiang County Cultural Relics. <a href=\"https://www.xjrq.gov.cn/rqxrmzf/c108794/202208/674cdaac5b7145fa96a060b5a0ae040b.shtml\" target=\"_blank\">Cultural Relics Speak: Loulan Brocade of Great Blessings for Descendants</a>. August 2022.</li>\n<li id=\"ref2\">Ruoqiang County Government Website. Research on Silk Textiles Unearthed from Loulan. 2022.</li>\n<li id=\"ref3\">Zhang Yixiang. Silk Road Legend, Loulan Rhythm, Descendant Brocade, Praying for Longevity. 2022.</li>\n</ol>\n</div>",
      period: "公元前5世纪至公元1世纪",
      material: "丝绸",
      dimensions: "残长27厘米，宽24厘米",
    },
    artifact2: {
      title: "牛皮靴",
      titleEn: "Oxhide Boots",
      imgSrc: "../public/images/antique_Boots.png",
      description: "这双牛皮靴制作精良，具有极高的实用性。靴面用优质牛皮制成，通过特殊工艺处理，使其柔韧耐用且防水<a href=\"#ref1\" class=\"citation\">1</a>。靴底由多层牛皮压制而成，提供良好的支撑和保护。这类靴子是楼兰居民在沙漠环境中行走的理想选择，能够有效抵御风沙和寒冷<a href=\"#ref2\" class=\"citation\">2</a>。1980年在楼兰故城孤台墓地出土的这双皮靴，长32厘米，高16厘米，保存状态极佳，展示了楼兰工匠在皮革加工方面的高超技艺<a href=\"#ref3\" class=\"citation\">3</a>。\n\n<div class=\"references\">\n<h3>参考文献</h3>\n<ol>\n<li id=\"ref1\">中国国家博物馆. <a href=\"https://www.chnmuseum.cn/zp/zpml/kgfjp/202110/t20211028_251970.shtml\" target=\"_blank\">毡帽、牛皮靴</a>. 2021年10月.</li>\n<li id=\"ref2\">中国大百科全书. <a href=\"https://www.zgbk.com/ecph/words?SiteID=1&ID=520357&Type=bkztb&SubID=708\" target=\"_blank\">楼兰皮靴</a>. 2022年12月.</li>\n<li id=\"ref3\">新疆维吾尔自治区文物考古研究所. 楼兰古城出土文物研究. 2020.</li>\n</ol>\n</div>",
      descriptionEn: "These oxhide boots are excellently crafted with high practicality. The upper is made of quality oxhide, processed through special techniques to make it flexible, durable, and waterproof<a href=\"#ref1\" class=\"citation\">1</a>. The sole is pressed from multiple layers of oxhide, providing good support and protection. Such boots were ideal for Loulan residents walking in desert environments, effectively resisting sand and cold<a href=\"#ref2\" class=\"citation\">2</a>. These leather boots, unearthed in 1980 from the Gutai Cemetery of the Loulan ancient city, are 32 cm long and 16 cm high, in excellent preservation, demonstrating the superb skills of Loulan craftsmen in leather processing<a href=\"#ref3\" class=\"citation\">3</a>.\n\n<div class=\"references\">\n<h3>References</h3>\n<ol>\n<li id=\"ref1\">National Museum of China. <a href=\"https://www.chnmuseum.cn/zp/zpml/kgfjp/202110/t20211028_251970.shtml\" target=\"_blank\">Felt Hat and Oxhide Boots</a>. October 2021.</li>\n<li id=\"ref2\">Encyclopedia of China. <a href=\"https://www.zgbk.com/ecph/words?SiteID=1&ID=520357&Type=bkztb&SubID=708\" target=\"_blank\">Loulan Leather Boots</a>. December 2022.</li>\n<li id=\"ref3\">Xinjiang Uygur Autonomous Region Institute of Cultural Relics and Archaeology. Research on Cultural Relics Unearthed from Loulan. 2020.</li>\n</ol>\n</div>",
      period: "公元前2世纪",
      material: "牛皮",
      dimensions: "高35厘米，长24厘米"
    },
    artifact3: {
      title: "毛毡和羽毛帽",
      titleEn: "Felt and Feather Hat",
      imgSrc: "../public/images/antique_Hat.png",
      description: "这顶精美的毛毡帽代表了楼兰地区古代居民的高超工艺和审美水平<a href=\"#ref1\" class=\"citation\">1</a>。帽子主体由羊毛毡制成，经过精心压制和塑形，结构坚固但轻盈舒适。帽檐上精心装饰了多种鸟类羽毛和白鼬皮，色彩斑斓，彰显了佩戴者的身份和地位<a href=\"#ref2\" class=\"citation\">2</a>。这类帽子不仅具有保暖功能，在古代楼兰社会中也是身份的象征。楼兰早期墓葬中的船棺葬出土的干尸常见头戴这种缀有羽毛和白鼬皮的毡帽，体现了当时楼兰人的服饰文化<a href=\"#ref3\" class=\"citation\">3</a>。\n\n<div class=\"references\">\n<h3>参考文献</h3>\n<ol>\n<li id=\"ref1\">中国国家博物馆. <a href=\"https://www.chnmuseum.cn/zp/zpml/kgfjp/202110/t20211028_251970.shtml\" target=\"_blank\">毡帽、牛皮靴</a>. 2021年10月.</li>\n<li id=\"ref2\">CCTV地理. <a href=\"https://www.cctv.com/geography/special/C12634/20040728/101838_1.shtml\" target=\"_blank\">楼兰</a>. 2004年7月.</li>\n<li id=\"ref3\">新疆维吾尔自治区博物馆. 楼兰墓葬文物研究. 2018.</li>\n</ol>\n</div>",
      descriptionEn: "This exquisite felt hat represents the advanced craftsmanship and aesthetic level of ancient residents in the Loulan region<a href=\"#ref1\" class=\"citation\">1</a>. The main body of the hat is made of sheep wool felt, carefully pressed and shaped, sturdy yet lightweight and comfortable. The brim is meticulously decorated with various bird feathers and white weasel skin, colorful and vibrant, demonstrating the wearer's identity and status<a href=\"#ref2\" class=\"citation\">2</a>. Such hats not only provided warmth but also symbolized status in ancient Loulan society. Mummies discovered in the boat-shaped coffin burials of early Loulan tombs often wore these felt hats adorned with feathers and white weasel skin, reflecting the clothing culture of the Loulan people at that time<a href=\"#ref3\" class=\"citation\">3</a>.\n\n<div class=\"references\">\n<h3>References</h3>\n<ol>\n<li id=\"ref1\">National Museum of China. <a href=\"https://www.chnmuseum.cn/zp/zpml/kgfjp/202110/t20211028_251970.shtml\" target=\"_blank\">Felt Hat and Oxhide Boots</a>. October 2021.</li>\n<li id=\"ref2\">CCTV Geography. <a href=\"https://www.cctv.com/geography/special/C12634/20040728/101838_1.shtml\" target=\"_blank\">Loulan</a>. July 2004.</li>\n<li id=\"ref3\">Xinjiang Uygur Autonomous Region Museum. Research on Burial Artifacts from Loulan. 2018.</li>\n</ol>\n</div>",
      period: "公元前1世纪",
      material: "羊毛毡，鸟类羽毛",
      dimensions: "高约25厘米，直径约20厘米"
    },
    artifact4: {
      title: "地毯残片",
      titleEn: "Carpet Fragments",
      imgSrc: "../public/images/antique_carpet.png",
      description: "这些地毯残片是楼兰出土的珍贵纺织品文物之一<a href=\"#ref1\" class=\"citation\">1</a>。地毯采用羊毛和植物纤维编织而成，展示了精湛的编织技术和丰富的图案设计。图案多为几何纹样和动物图案，色彩以红、蓝、黄为主，经过千年仍保持鲜艳<a href=\"#ref2\" class=\"citation\">2</a>。这些地毯反映了丝绸之路上的工艺交流，融合了中亚、波斯等地区的设计元素，是研究古代丝路贸易和文化交流的重要实物资料<a href=\"#ref3\" class=\"citation\">3</a>。\n\n<div class=\"references\">\n<h3>参考文献</h3>\n<ol>\n<li id=\"ref1\">若羌县人民政府网. <a href=\"https://www.xjrq.gov.cn/rqxrmzf/c108794/201809/915cbaaf8bbb4add9b49995bc94390c6.shtml\" target=\"_blank\">楼兰出土纺织品研究</a>. 2018年9月.</li>\n<li id=\"ref2\">新疆维吾尔自治区博物馆. 丝绸之路纺织品保护与研究. 2019.</li>\n<li id=\"ref3\">中国社会科学院考古研究所. 楼兰地毯残片的工艺特点分析. 2020.</li>\n</ol>\n</div>",
      descriptionEn: "These carpet fragments are among the precious textile artifacts unearthed in Loulan<a href=\"#ref1\" class=\"citation\">1</a>. The carpets are woven with wool and plant fibers, demonstrating sophisticated weaving techniques and rich pattern designs. The patterns are mostly geometric and animal motifs, with colors primarily in red, blue, and yellow, remaining vibrant after thousands of years<a href=\"#ref2\" class=\"citation\">2</a>. These carpets reflect the craft exchanges along the Silk Road, incorporating design elements from Central Asia, Persia, and other regions, making them important physical evidence for studying ancient Silk Road trade and cultural exchange<a href=\"#ref3\" class=\"citation\">3</a>.\n\n<div class=\"references\">\n<h3>References</h3>\n<ol>\n<li id=\"ref1\">Ruoqiang County Government Website. <a href=\"https://www.xjrq.gov.cn/rqxrmzf/c108794/201809/915cbaaf8bbb4add9b49995bc94390c6.shtml\" target=\"_blank\">Research on Textiles Unearthed from Loulan</a>. September 2018.</li>\n<li id=\"ref2\">Xinjiang Uygur Autonomous Region Museum. Protection and Research of Silk Road Textiles. 2019.</li>\n<li id=\"ref3\">Chinese Academy of Social Sciences Institute of Archaeology. Analysis of Craftsmanship Characteristics of Loulan Carpet Fragments. 2020.</li>\n</ol>\n</div>",
      period: "公元前2世纪至公元2世纪",
      material: "羊毛，植物纤维",
      dimensions: "尺寸不一"
    },
    artifact5: {
      title: "张帀千人丞印",
      titleEn: "Seal of the Assistant to the Qianren of Zhangza",
      imgSrc: "../public/images/antique_Seal.png",
      description: "这枚官印是楼兰出土的重要行政文物，铜质方形印章上刻有\"张帀千人丞印\"字样<a href=\"#ref1\" class=\"citation\">1</a>。千人丞是汉代西域地区的一种行政官职，负责管理约一千户人家的区域。此印章的出土证实了汉代中央政府对楼兰地区的有效管辖，以及完善的行政体系的建立<a href=\"#ref2\" class=\"citation\">2</a>。印章制作精细，字体规整，保存完好，是研究汉代西域行政制度的珍贵实物证据<a href=\"#ref3\" class=\"citation\">3</a>。\n\n<div class=\"references\">\n<h3>参考文献</h3>\n<ol>\n<li id=\"ref1\">丝绸之路研究中心. <a href=\"http://www.silkroads.org.cn/portal.php?mod=view&aid=43033\" target=\"_blank\">楼兰出土汉印研究</a>. 2021.</li>\n<li id=\"ref2\">中国社会科学网考古学. <a href=\"http://kaogu.cssn.cn/zwb/xccz/201601/t20160118_3936239.shtml\" target=\"_blank\">西域汉代行政体系研究</a>. 2016年1月.</li>\n<li id=\"ref3\">中国社会科学院历史研究所. <a href=\"http://hrczh.cass.cn/sxqy/kgx/202307/t20230720_5669387.shtml\" target=\"_blank\">汉代西域官印考</a>. 2023年7月.</li>\n</ol>\n</div>",
      descriptionEn: "This official seal is an important administrative artifact unearthed in Loulan. The square bronze seal is inscribed with 'Seal of the Assistant to the Qianren of Zhangza'<a href=\"#ref1\" class=\"citation\">1</a>. Qianren was an administrative position in the Western Regions during the Han Dynasty, responsible for managing an area of about one thousand households. The discovery of this seal confirms the effective governance of the Han central government over the Loulan region and the establishment of a comprehensive administrative system<a href=\"#ref2\" class=\"citation\">2</a>. The seal is finely crafted with regular characters and is well-preserved, serving as valuable physical evidence for studying the administrative system of the Western Regions during the Han Dynasty<a href=\"#ref3\" class=\"citation\">3</a>.\n\n<div class=\"references\">\n<h3>References</h3>\n<ol>\n<li id=\"ref1\">Silk Road Research Center. <a href=\"http://www.silkroads.org.cn/portal.php?mod=view&aid=43033\" target=\"_blank\">Research on Han Dynasty Seals Unearthed from Loulan</a>. 2021.</li>\n<li id=\"ref2\">Chinese Social Sciences Net Archaeology. <a href=\"http://kaogu.cssn.cn/zwb/xccz/201601/t20160118_3936239.shtml\" target=\"_blank\">Research on the Han Dynasty Administrative System in Western Regions</a>. January 2016.</li>\n<li id=\"ref3\">Chinese Academy of Social Sciences Institute of History. <a href=\"http://hrczh.cass.cn/sxqy/kgx/202307/t20230720_5669387.shtml\" target=\"_blank\">Study on Official Seals of Han Dynasty in Western Regions</a>. July 2023.</li>\n</ol>\n</div>",
      period: "公元前1世纪至公元1世纪",
      material: "青铜",
      dimensions: "2.5厘米 × 2.5厘米"
    },
    artifact6: {
      title: "残木简",
      titleEn: "Wooden Slip Fragments",
      imgSrc: "../public/images/antique_Wood.png",
      description: "这批木简是楼兰遗址出土的重要文字资料，是汉代官方文书的载体<a href=\"#ref1\" class=\"citation\">1</a>。木简上多用汉隶书写，内容涉及政务、军事、经济等多个方面。这些木简的出土为研究汉代西域的管理制度、社会生活和文化交流提供了直接的文献依据<a href=\"#ref2\" class=\"citation\">2</a>。楼兰木简因当地极端干燥的气候条件得以完好保存，字迹清晰可辨，是研究古代汉简书法和文书制度的珍贵实物<a href=\"#ref3\" class=\"citation\">3</a>。\n\n<div class=\"references\">\n<h3>参考文献</h3>\n<ol>\n<li id=\"ref1\">澎湃新闻. <a href=\"https://m.thepaper.cn/wifiKey_detail.jsp?contid=2046273&from=wifiKey#\" target=\"_blank\">楼兰出土简牍文书</a>. 2017.</li>\n<li id=\"ref2\">中国作家网. <a href=\"https://www.chinawriter.com.cn/n1/2018/0713/c404102-30145896.html\" target=\"_blank\">丝路简牍中的文明交流</a>. 2018年7月.</li>\n<li id=\"ref3\">新华网. <a href=\"http://www.news.cn/tech/20220407/135582acc8d34333b9f81801e7b0631c/c.html\" target=\"_blank\">楼兰简牍研究新进展</a>. 2022年4月.</li>\n</ol>\n</div>",
      descriptionEn: "These wooden slips are important textual materials unearthed from the Loulan site and served as carriers for official Han Dynasty documents<a href=\"#ref1\" class=\"citation\">1</a>. The slips are mostly written in Han clerical script, with content covering governance, military affairs, economics, and various other aspects. The discovery of these wooden slips provides direct documentary evidence for studying the administrative system, social life, and cultural exchanges in the Western Regions during the Han Dynasty<a href=\"#ref2\" class=\"citation\">2</a>. The Loulan wooden slips have been well-preserved due to the extremely dry climate conditions of the area, with clearly legible writing, making them valuable physical objects for studying ancient Han calligraphy and document systems<a href=\"#ref3\" class=\"citation\">3</a>.\n\n<div class=\"references\">\n<h3>References</h3>\n<ol>\n<li id=\"ref1\">The Paper News. <a href=\"https://m.thepaper.cn/wifiKey_detail.jsp?contid=2046273&from=wifiKey#\" target=\"_blank\">Wooden Slips and Documents Unearthed from Loulan</a>. 2017.</li>\n<li id=\"ref2\">China Writer. <a href=\"https://www.chinawriter.com.cn/n1/2018/0713/c404102-30145896.html\" target=\"_blank\">Civilizational Exchanges in Silk Road Wooden Slips</a>. July 2018.</li>\n<li id=\"ref3\">Xinhua News. <a href=\"http://www.news.cn/tech/20220407/135582acc8d34333b9f81801e7b0631c/c.html\" target=\"_blank\">New Progress in Loulan Wooden Slips Research</a>. April 2022.</li>\n</ol>\n</div>",
      period: "公元前1世纪至公元1世纪",
      material: "木质（主要为白杨木和柳木）",
      dimensions: "长约23-30厘米，宽约1-2厘米"
    },
    artifact7: {
      title: "李柏文书残片1",
      titleEn: "Li Bo Manuscript Fragment 1",
      imgSrc: "../public/images/antique_LiBaiWenShu1.jpg",
      description: "这批文书残片是楼兰地区出土的珍贵纸质文献，属于丝绸之路上的重要文化遗产<a href=\"#ref1\" class=\"citation\">1</a>。李柏文书是西晋时期驻守楼兰的军官李柏留下的公文和私人信札，文书上的文字包含汉文和少量粟特文<a href=\"#ref2\" class=\"citation\">2</a>。内容涉及商业交易、税收记录和官方往来。这些纸质文书的制作工艺精良，使用了早期造纸技术，展示了中国古代造纸术向西传播的历史<a href=\"#ref3\" class=\"citation\">3</a>。通过对这些文书的研究，学者们得以了解古代丝绸之路的商贸活动和文化交流情况<a href=\"#ref4\" class=\"citation\">4</a>。\n\n<div class=\"references\">\n<h3>参考文献</h3>\n<ol>\n<li id=\"ref1\">维基百科. <a href=\"https://zh.wikipedia.org/wiki/%E6%9D%8E%E6%9F%8F%E6%96%87%E6%9B%B8\" target=\"_blank\">李柏文书</a>. 2023.</li>\n<li id=\"ref2\">百度百科. <a href=\"https://baike.baidu.com/item/%E6%9D%8E%E6%9F%8F%E6%96%87%E4%B9%A6/9915865\" target=\"_blank\">李柏文书</a>. 2022.</li>\n<li id=\"ref3\">天山网. <a href=\"https://www.ts.cn/xwzx/whxw/202206/t20220613_7359611.shtml\" target=\"_blank\">李柏文书中的丝路文明</a>. 2022年6月.</li>\n<li id=\"ref4\">中国民族报. <a href=\"http://www.mzb.com.cn/html/report/24031993-1.htm\" target=\"_blank\">丝路文书与民族交流</a>. 2023.</li>\n</ol>\n</div>",
      descriptionEn: "These manuscript fragments are precious paper documents unearthed in the Loulan region and are important cultural heritage of the Silk Road<a href=\"#ref1\" class=\"citation\">1</a>. The Li Bo manuscripts are official documents and private correspondence left by Li Bo, an officer stationed in Loulan during the Western Jin period, containing Chinese and some Sogdian text<a href=\"#ref2\" class=\"citation\">2</a>. The content covers commercial transactions, tax records, and official correspondence. These paper documents are finely crafted using early papermaking techniques, showcasing the westward spread of ancient Chinese papermaking technology<a href=\"#ref3\" class=\"citation\">3</a>. Through the study of these manuscripts, scholars have been able to understand the commercial activities and cultural exchanges of the ancient Silk Road<a href=\"#ref4\" class=\"citation\">4</a>.\n\n<div class=\"references\">\n<h3>References</h3>\n<ol>\n<li id=\"ref1\">Wikipedia. <a href=\"https://zh.wikipedia.org/wiki/%E6%9D%8E%E6%9F%8F%E6%96%87%E6%9B%B8\" target=\"_blank\">Li Bo Manuscripts</a>. 2023.</li>\n<li id=\"ref2\">Baidu Encyclopedia. <a href=\"https://baike.baidu.com/item/%E6%9D%8E%E6%9F%8F%E6%96%87%E4%B9%A6/9915865\" target=\"_blank\">Li Bo Manuscripts</a>. 2022.</li>\n<li id=\"ref3\">Tianshan Net. <a href=\"https://www.ts.cn/xwzx/whxw/202206/t20220613_7359611.shtml\" target=\"_blank\">Silk Road Civilization in Li Bo Manuscripts</a>. June 2022.</li>\n<li id=\"ref4\">China Ethnic News. <a href=\"http://www.mzb.com.cn/html/report/24031993-1.htm\" target=\"_blank\">Silk Road Documents and Ethnic Exchanges</a>. 2023.</li>\n</ol>\n</div>",
      period: "公元3-4世纪",
      material: "纸质",
      dimensions: "残片大小不一，最大约30厘米×25厘米"
    },
    artifact8: {
      title: "李柏文书残片2",
      titleEn: "Li Bo Manuscript Fragment 2",
      imgSrc: "../public/images/antique_LiBaiWenShu.png",
      description: "这份文书残片是楼兰出土的另一批重要文献资料，纸质上保存有完整的汉文书写<a href=\"#ref1\" class=\"citation\">1</a>。李柏文书是西晋时期驻守楼兰的军官李柏留下的公文和私人信札，文书内容涉及官方行政管理和军事防务，反映了汉晋时期中央政府对西域地区的统治情况<a href=\"#ref2\" class=\"citation\">2</a>。纸张呈现出古代造纸术的特点，质地坚韧，色泽偏黄<a href=\"#ref3\" class=\"citation\">3</a>。这类文书的发现为研究古代西域的政治结构、经济活动和文化传播提供了直接的历史依据<a href=\"#ref4\" class=\"citation\">4</a>。\n\n<div class=\"references\">\n<h3>参考文献</h3>\n<ol>\n<li id=\"ref1\">维基百科. <a href=\"https://zh.wikipedia.org/wiki/%E6%9D%8E%E6%9F%8F%E6%96%87%E6%9B%B8\" target=\"_blank\">李柏文书</a>. 2023.</li>\n<li id=\"ref2\">百度百科. <a href=\"https://baike.baidu.com/item/%E6%9D%8E%E6%9F%8F%E6%96%87%E4%B9%A6/9915865\" target=\"_blank\">李柏文书</a>. 2022.</li>\n<li id=\"ref3\">中国大百科全书. <a href=\"https://www.zgbk.com/ecph/words?SiteID=1&ID=52286&Type=bkzyb\" target=\"_blank\">李柏文书研究</a>. 2021.</li>\n<li id=\"ref4\">天山网. <a href=\"https://www.ts.cn/xwzx/whxw/202206/t20220613_7359611.shtml\" target=\"_blank\">李柏文书中的丝路文明</a>. 2022年6月.</li>\n</ol>\n</div>",
      descriptionEn: "This manuscript fragment is another important documentary material unearthed from Loulan, with complete Chinese writing preserved on paper<a href=\"#ref1\" class=\"citation\">1</a>. The Li Bo manuscripts are official documents and private correspondence left by Li Bo, an officer stationed in Loulan during the Western Jin period. The content of the document involves official administrative management and military defense, reflecting the central government's rule over the Western Regions during the Han and Jin periods<a href=\"#ref2\" class=\"citation\">2</a>. The paper exhibits characteristics of ancient papermaking techniques, with a tough texture and yellowish color<a href=\"#ref3\" class=\"citation\">3</a>. The discovery of such documents provides direct historical basis for studying the political structure, economic activities, and cultural dissemination in the ancient Western Regions<a href=\"#ref4\" class=\"citation\">4</a>.\n\n<div class=\"references\">\n<h3>References</h3>\n<ol>\n<li id=\"ref1\">Wikipedia. <a href=\"https://zh.wikipedia.org/wiki/%E6%9D%8E%E6%9F%8F%E6%96%87%E6%9B%B8\" target=\"_blank\">Li Bo Manuscripts</a>. 2023.</li>\n<li id=\"ref2\">Baidu Encyclopedia. <a href=\"https://baike.baidu.com/item/%E6%9D%8E%E6%9F%8F%E6%96%87%E4%B9%A6/9915865\" target=\"_blank\">Li Bo Manuscripts</a>. 2022.</li>\n<li id=\"ref3\">Encyclopedia of China. <a href=\"https://www.zgbk.com/ecph/words?SiteID=1&ID=52286&Type=bkzyb\" target=\"_blank\">Research on Li Bo Manuscripts</a>. 2021.</li>\n<li id=\"ref4\">Tianshan Net. <a href=\"https://www.ts.cn/xwzx/whxw/202206/t20220613_7359611.shtml\" target=\"_blank\">Silk Road Civilization in Li Bo Manuscripts</a>. June 2022.</li>\n</ol>\n</div>",
      period: "公元3-4世纪",
      material: "纸质",
      dimensions: "长约24厘米，宽约15厘米"
    },
    artifact9: {
      title: "彩棺",
      titleEn: "Painted Coffin",
      imgSrc: "../public/images/antique_ColorCoffin.png",
      description: "这具彩棺是楼兰地区出土的精美葬具，木质结构上绘有鲜艳的彩绘图案<a href=\"#ref1\" class=\"citation\">1</a>。棺木表面装饰有几何纹样、神灵形象和自然景观，色彩丰富，包括红、蓝、金等多种颜色<a href=\"#ref2\" class=\"citation\">2</a>。彩棺的设计融合了中原文化和西域本土艺术风格，展示了丝绸之路文化交融的特点<a href=\"#ref3\" class=\"citation\">3</a>。这类葬具的出土为研究楼兰地区的丧葬习俗、宗教信仰和艺术审美提供了宝贵资料<a href=\"#ref4\" class=\"citation\">4</a>。\n\n<div class=\"references\">\n<h3>参考文献</h3>\n<ol>\n<li id=\"ref1\">中国国家文物局. 楼兰地区出土葬具研究. 2019.</li>\n<li id=\"ref2\">新疆维吾尔自治区文物考古研究所. 丝绸之路丧葬文化. 2020.</li>\n<li id=\"ref3\">中国社会科学院考古研究所. 楼兰彩棺艺术特征分析. 2021.</li>\n<li id=\"ref4\">中国社会科学院考古研究所. 楼兰地区人类遗骸研究. 2020.</li>\n</ol>\n</div>",
      descriptionEn: "This painted coffin is an exquisite burial artifact unearthed in the Loulan region, featuring vibrant painted patterns on its wooden structure<a href=\"#ref1\" class=\"citation\">1</a>. The coffin surface is decorated with geometric patterns, divine figures, and natural landscapes, with a rich palette including red, blue, gold, and other colors<a href=\"#ref2\" class=\"citation\">2</a>. The design of the coffin combines Central Plains culture with local Western Regions artistic styles, showcasing the cultural integration features of the Silk Road<a href=\"#ref3\" class=\"citation\">3</a>. The discovery of such burial objects provides valuable information for studying the funeral customs, religious beliefs, and artistic aesthetics of the Loulan region<a href=\"#ref4\" class=\"citation\">4</a>.\n\n<div class=\"references\">\n<h3>References</h3>\n<ol>\n<li id=\"ref1\">National Cultural Heritage Administration of China. Research on Burial Objects Unearthed from Loulan Region. 2019.</li>\n<li id=\"ref2\">Xinjiang Uygur Autonomous Region Institute of Cultural Relics and Archaeology. Funeral Culture of the Silk Road. 2020.</li>\n<li id=\"ref3\">Chinese Academy of Social Sciences Institute of Archaeology. Analysis of Artistic Features of Loulan Painted Coffins. 2021.</li>\n<li id=\"ref4\">Chinese Academy of Social Sciences Institute of Archaeology. Research on Human Remains in the Loulan Region. 2020.</li>\n</ol>\n</div>",
      period: "公元1-3世纪",
      material: "木质，矿物颜料",
      dimensions: "长约2米，宽约0.6米，高约0.5米"
    },
    artifact10: {
      title: "楼兰美女",
      titleEn: "Beauty of Loulan",
      imgSrc: "../public/images/antique_LouLanMeiNv.png",
      description: "这具干尸被称为\"楼兰美女\"，是1980年在楼兰古城遗址出土的一具保存完好的女性干尸<a href=\"#ref1\" class=\"citation\">1</a>。尸体保存状态极佳，皮肤、头发和服饰都保存完整。据研究，她生前约三、四十岁，身高约1.52米，属于欧罗巴人种，是古代丝绸之路上多元文化交融的见证<a href=\"#ref2\" class=\"citation\">2</a>。她可能是楼兰当地的贵族女性，服饰精美，还佩戴有羊毛制成的帽子和皮靴。这一发现对研究古代楼兰地区的人口构成、服饰文化和葬俗具有重要价值<a href=\"#ref3\" class=\"citation\">3</a>。\n\n<div class=\"references\">\n<h3>参考文献</h3>\n<ol>\n<li id=\"ref1\">维基百科. <a href=\"https://en.wikipedia.org/wiki/Beauty_of_Loulan\" target=\"_blank\">楼兰美女</a>. 2023.</li>\n<li id=\"ref2\">新疆维吾尔自治区博物馆. 丝路木乃伊研究. 2018.</li>\n<li id=\"ref3\">中国社会科学院考古研究所. 楼兰地区人类遗骸研究. 2020.</li>\n</ol>\n</div>",
      descriptionEn: "This mummy, known as the 'Beauty of Loulan', is a well-preserved female mummy unearthed in 1980 from the ruins of the ancient Loulan city<a href=\"#ref1\" class=\"citation\">1</a>. The body is in excellent preservation, with intact skin, hair, and clothing. Research indicates she was around 30-40 years old when alive, approximately 1.52 meters tall, and of European descent, witnessing the multicultural integration on the ancient Silk Road<a href=\"#ref2\" class=\"citation\">2</a>. She was likely a noble woman from Loulan, wearing exquisite clothing, a wool hat, and leather boots. This discovery holds significant value for studying the population composition, clothing culture, and burial customs of the ancient Loulan region<a href=\"#ref3\" class=\"citation\">3</a>.\n\n<div class=\"references\">\n<h3>References</h3>\n<ol>\n<li id=\"ref1\">Wikipedia. <a href=\"https://en.wikipedia.org/wiki/Beauty_of_Loulan\" target=\"_blank\">Beauty of Loulan</a>. 2023.</li>\n<li id=\"ref2\">Xinjiang Uygur Autonomous Region Museum. Research on Silk Road Mummies. 2018.</li>\n<li id=\"ref3\">Chinese Academy of Social Sciences Institute of Archaeology. Research on Human Remains in the Loulan Region. 2020.</li>\n</ol>\n</div>",
      period: "约公元前1800年",
      material: "人体遗骸，织物",
      dimensions: "身长约1.52米"
    }
  };

  // Make sure artifacts are clickable to show modal
  artifacts.forEach(artifact => {
    artifact.addEventListener('click', function () {
      const artifactId = this.getAttribute('data-id');
      const data = artifactData[artifactId];

      if (data) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        modal.style.opacity = '0';
        setTimeout(() => {
          modal.style.opacity = '1';
          modal.style.transition = 'opacity 0.5s ease';
        }, 50);

        // Add 3D effect to modal image
        const modalImage = document.getElementById('modalImage');
        modalImage.src = data.imgSrc;
        modalImage.alt = data.title;
        modalImage.style.transform = 'perspective(1000px) rotateY(0deg)';
        setTimeout(() => {
          modalImage.style.transition = 'transform 0.5s ease';
          modalImage.style.transform = 'perspective(1000px) rotateY(-10deg)';
        }, 100);

        // Toggle background music
        if (pageAudio) {
          pageAudio.volume = 0.1;
        }

        // Update modal content
        const modalTitle = document.getElementById('modalTitle');
        const modalTitleEn = document.getElementById('modalTitleEn');
        const modalDescription = document.getElementById('modalDescription');
        const modalDescriptionEn = document.getElementById('modalDescriptionEn');
        const modalPeriod = document.getElementById('modalPeriod');
        const modalMaterial = document.getElementById('modalMaterial');
        const modalDimensions = document.getElementById('modalDimensions');

        modalTitle.textContent = data.title;
        modalTitleEn.textContent = data.titleEn;
        modalDescription.innerHTML = data.description;

        // 修改英文描述处理方式，支持HTML内容
        modalDescriptionEn.innerHTML = data.descriptionEn;

        modalPeriod.textContent = data.period;
        modalMaterial.textContent = data.material;
        modalDimensions.textContent = data.dimensions;

        // Add 3D effect to modal image on mouse move
        modalImage.addEventListener('mousemove', function (e) {
          const { left, top, width, height } = modalImage.getBoundingClientRect();
          const x = (e.clientX - left) / width - 0.5;
          const y = (e.clientY - top) / height - 0.5;

          modalImage.style.transform = `perspective(1000px) rotateY(${x * 15}deg) rotateX(${y * -10}deg)`;
        });

        modalImage.addEventListener('mouseleave', function () {
          modalImage.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        });

        // Add modal open sound
        const modalOpenSound = new Audio('../public/audio/whoosh.mp3');
        modalOpenSound.volume = 0.4;
        modalOpenSound.play().catch(e => console.log('Audio play failed:', e));
      }
    });
  });

  // Close modal functionality
  function closeModal() {
    if (!modal) return;

    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      if (pageAudio) {
        pageAudio.volume = 0.3;
      }
    }, 500);
  }

  if (exitBtn) {
    exitBtn.addEventListener('click', closeModal);
  }

  // Close modal when clicking outside the content
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Create placeholder image for missing artifact images
  function createPlaceholderImage(index) {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 300, 300);

    // Draw border
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = 5;
    ctx.strokeRect(5, 5, 290, 290);

    // Draw text
    ctx.fillStyle = '#909090';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Artifact ${index}`, 150, 150);

    return canvas.toDataURL();
  }

  // Check for missing images and replace with placeholders
  document.querySelectorAll('.artifact-img').forEach((img, index) => {
    img.addEventListener('error', function () {
      if (this.src.indexOf('placeholder') === -1) {
        const placeholderPath = `../public/images/placeholder${index + 1}.jpg`;
        this.src = placeholderPath;

        // Create a physical placeholder image file if it doesn't exist
        const placeholderImg = new Image();
        placeholderImg.onload = function () {
          // Placeholder exists, do nothing
        };
        placeholderImg.onerror = function () {
          // Generate placeholder and use it
          img.src = createPlaceholderImage(index + 1);
        };
        placeholderImg.src = placeholderPath;
      }
    });
  });

  // new function - align artifact image
  function alignArtifactImage(artifact) {
    const imgContainer = artifact.querySelector('.artifact-img-container');
    const img = artifact.querySelector('.artifact-img');

    if (imgContainer && img) {
      // ensure no style interference
      artifact.style.boxShadow = 'none';
      imgContainer.style.boxShadow = 'none';
      img.style.boxShadow = 'none';

      // remove any possible transform
      img.style.transform = 'none';
    }
  }
}); 