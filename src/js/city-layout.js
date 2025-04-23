document.addEventListener('DOMContentLoaded', function () {
  const mapMarkers = document.querySelectorAll('.map-marker');
  const spotModal = document.getElementById('spotModal');
  const closeModal = document.querySelector('.close-modal');
  const spotImage = document.getElementById('spotImage');
  const spotTitle = document.getElementById('spotTitle');
  const spotTitleEn = document.getElementById('spotTitleEn');
  const spotDescription = document.getElementById('spotDescription');
  const spotDescriptionEn = document.getElementById('spotDescriptionEn');

  // 跟踪当前活跃的标记
  let activeMarker = null;

  // Define data for each red dot
  const spotsData = {
    spot1: {
      title: "佛塔遗址",
      titleEn: "Buddhist Stupa Ruins",
      image: "../public/images/OldCity_Stupa.webp",
      description: "佛塔位于古城的佛寺区，是楼兰故城的主要宗教建筑<sup class='city-citation' data-ref='1'>1</sup>。佛塔采用中心实心、外围环绕的结构，塔基直径约10米，现仅存夯土基座<sup class='city-citation' data-ref='2'>2</sup>。据百度百科记载，佛塔遗址是楼兰故城内保存较为完好的建筑遗址之一<sup class='city-citation' data-ref='4'>4</sup>。在佛塔周围曾发现佛教壁画和雕像碎片，甚至包括西亚艺术风格的有翼天使像，体现了东西方文化的交融<sup class='city-citation' data-ref='3'>3</sup>。",
      descriptionEn: "The Buddhist stupa is located in the temple area of the ancient city and is a major religious building of Loulan<sup class='city-citation' data-ref='1'>1</sup>. The stupa adopts a structure with a solid center surrounded by corridors, with a base diameter of about 10 meters, though only the rammed earth base remains today<sup class='city-citation' data-ref='2'>2</sup>. According to Baidu Encyclopedia, the stupa ruins are one of the better-preserved building remains in Loulan Ancient City<sup class='city-citation' data-ref='4'>4</sup>. Buddhist murals and statue fragments have been discovered around the stupa, including winged angel figures in West Asian artistic style, reflecting the integration of Eastern and Western cultures<sup class='city-citation' data-ref='3'>3</sup>.",
      references: [
        {
          id: 1,
          zh: "百度百科. <a href='https://baike.baidu.com/item/%E6%A5%BC%E5%85%B0%E6%95%85%E5%9F%8E%E9%81%97%E5%9D%80/2310140' target='_blank'>楼兰故城遗址</a>. 2025.",
          en: "Baidu Encyclopedia. <a href='https://baike.baidu.com/item/%E6%A5%BC%E5%85%B0%E6%95%85%E5%9F%8E%E9%81%97%E5%9D%80/2310140' target='_blank'>Loulan Ancient City Ruins</a>. 2025."
        },
        {
          id: 2,
          zh: "林梅村. 丝绸之路考古十五讲. 北京大学出版社. 2006: 53-54.",
          en: "Lin, Meicun. Fifteen Lectures on Silk Road Archaeology. Peking University Press. 2006: 53-54."
        },
        {
          id: 3,
          zh: "霍旭初. 新疆史地文献资料(6)-中国丝绸之路名城楼兰古城. 中国边疆史地研究. 1991(3): 47-48.",
          en: "Huo, Xuchu. Xinjiang Historical and Geographical Documents (6) - Loulan Ancient City, a Famous City on China's Silk Road. Research on China's Frontier History and Geography. 1991(3): 47-48."
        },
        {
          id: 4,
          zh: "百度百科. <a href='https://baike.baidu.com/item/%E6%A5%BC%E5%85%B0%E5%9F%8E/5426738' target='_blank'>楼兰城</a>. 2025.",
          en: "Baidu Encyclopedia. <a href='https://baike.baidu.com/item/%E6%A5%BC%E5%85%B0%E5%9F%8E/5426738' target='_blank'>Loulan City</a>. 2025."
        }
      ]
    },
    spot2: {
      title: "\"三间房\"",
      titleEn: "The Three-Room House",
      image: "../public/images/OldCity_sanjianfang2.webp",
      description: "\"三间房\"位于故城的官府区，是楼兰城最大的建筑之一，因其平面布局为三间并列房间而得名<sup class='city-citation' data-ref='1'>1</sup>。考古发现显示，这里可能是西域长史府的重要行政中心，出土了大量公文简牍和官印封泥<sup class='city-citation' data-ref='2'>2</sup>。根据百度百科记载，\"三间房\"由大量土坯建造，是楼兰故城内官府区最有代表性的建筑<sup class='city-citation' data-ref='4'>4</sup>。魏晋时期（3~4世纪），中央王朝在楼兰城设立西域长史府，\"三间房\"是研究汉晋时期中央政府对西域管理制度的重要实物资料<sup class='city-citation' data-ref='3'>3</sup>。",
      descriptionEn: "The \"Three-Room House\" is located in the government area of the ancient city and is one of the largest buildings in Loulan. It is named after its floor plan of three rooms arranged side by side<sup class='city-citation' data-ref='1'>1</sup>. Archaeological discoveries suggest that this was likely an important administrative center of the Western Regions Protectorate, where numerous official documents on wooden slips and official seal impressions have been unearthed<sup class='city-citation' data-ref='2'>2</sup>. According to Baidu Encyclopedia, the \"Three-Room House\" was constructed with numerous mud bricks and is the most representative building in the government district of Loulan Ancient City<sup class='city-citation' data-ref='4'>4</sup>. During the Wei and Jin periods (3rd-4th centuries), the central dynasty established the Western Regions Protectorate in Loulan City, making the \"Three-Room House\" an important physical evidence for studying the central government's management system over the Western Regions during the Han and Jin dynasties<sup class='city-citation' data-ref='3'>3</sup>.",
      references: [
        {
          id: 1,
          zh: "百度百科. <a href='https://baike.baidu.com/item/%E6%A5%BC%E5%85%B0%E6%95%85%E5%9F%8E%E9%81%97%E5%9D%80/2310140' target='_blank'>楼兰故城遗址</a>. 2025.",
          en: "Baidu Encyclopedia. <a href='https://baike.baidu.com/item/%E6%A5%BC%E5%85%B0%E6%95%85%E5%9F%8E%E9%81%97%E5%9D%80/2310140' target='_blank'>Loulan Ancient City Ruins</a>. 2025."
        },
        {
          id: 2,
          zh: "王炳华. 楼兰-尼雅考古与汉简研究. 新疆人民出版社. 2006: 121-123.",
          en: "Wang, Binghua. Archaeological and Han Bamboo Slips Research in Loulan-Niya. Xinjiang People's Publishing House. 2006: 121-123."
        },
        {
          id: 3,
          zh: "余太山. 两汉魏晋南北朝正史西域传要注. 中华书局. 2005: 87-89.",
          en: "Yu, Taishan. Annotation of Western Regions Biographies in the Official Histories of Han, Wei, Jin and Northern and Southern Dynasties. Zhonghua Book Company. 2005: 87-89."
        },
        {
          id: 4,
          zh: "百度百科. <a href='https://baike.baidu.com/item/%E6%A5%BC%E5%85%B0%E5%9F%8E/5426738' target='_blank'>楼兰城</a>. 2025.",
          en: "Baidu Encyclopedia. <a href='https://baike.baidu.com/item/%E6%A5%BC%E5%85%B0%E5%9F%8E/5426738' target='_blank'>Loulan City</a>. 2025."
        }
      ]
    },
    spot3: {
      title: "城墙遗址",
      titleEn: "City Wall Ruins",
      image: "../public/images/OldCity_WallRelics.png",
      description: "楼兰故城遗址呈不规则方形，城址四周筑有夯土城墙，城墙宽约3米，现存高度在4-5.8米之间<sup class='city-citation' data-ref='1'>1</sup>。据百度百科记载，楼兰城外的城墙保存状况相对较好，这与当地干旱的气候环境有关<sup class='city-citation' data-ref='4'>4</sup>。研究表明，4世纪后期，随着气候变冷和水文环境变化，楼兰绿洲逐渐干涸，城址最终被流沙所吞没<sup class='city-citation' data-ref='2'>2</sup>。Lei等人在研究罗布泊湖泊水位变化时指出，过去2000年来罗布泊地区的气候变化与楼兰古国的衰落有着密切联系<sup class='city-citation' data-ref='5'>5</sup>。城墙中有不少原生土木构件，这些构件的材料和做法为中原地区汉代建筑工艺所独有，反映了汉代中央政府对边疆地区建筑活动的影响<sup class='city-citation' data-ref='3'>3</sup>。",
      descriptionEn: "The Loulan Ancient City ruins form an irregular square, surrounded by rammed earth walls about 3 meters wide, with existing heights between 4-5.8 meters<sup class='city-citation' data-ref='1'>1</sup>. According to Baidu Encyclopedia, the city walls outside Loulan City are relatively well preserved, which is related to the local arid climate environment<sup class='city-citation' data-ref='4'>4</sup>. Research shows that in the late 4th century, with climate cooling and changes in the hydrological environment, the Loulan oasis gradually dried up and the city site was eventually swallowed by shifting sands<sup class='city-citation' data-ref='2'>2</sup>. Lei et al., in their study of Lop Nur lake level changes, pointed out that climate changes in the Lop Nur region over the past 2000 years are closely linked to the decline of the ancient Loulan Kingdom<sup class='city-citation' data-ref='5'>5</sup>. There are many original earth and wood components in the walls, and these materials and techniques are unique to Han Dynasty architecture in the Central Plains region, reflecting the influence of the central government on construction activities in frontier areas<sup class='city-citation' data-ref='3'>3</sup>.",
      references: [
        {
          id: 1,
          zh: "百度百科. <a href='https://baike.baidu.com/item/%E6%A5%BC%E5%85%B0%E6%95%85%E5%9F%8E%E9%81%97%E5%9D%80/2310140' target='_blank'>楼兰故城遗址</a>. 2025.",
          en: "Baidu Encyclopedia. <a href='https://baike.baidu.com/item/%E6%A5%BC%E5%85%B0%E6%95%85%E5%9F%8E%E9%81%97%E5%9D%80/2310140' target='_blank'>Loulan Ancient City Ruins</a>. 2025."
        },
        {
          id: 2,
          zh: "马雍. 丝绸之路与西域文明. 新疆人民出版社. 2002: 156-158.",
          en: "Ma, Yong. Silk Road and Western Regions Civilization. Xinjiang People's Publishing House. 2002: 156-158."
        },
        {
          id: 3,
          zh: "郭物. 楼兰考古记. 文物出版社. 2012: 75-77.",
          en: "Guo, Wu. Archaeological Records of Loulan. Cultural Relics Press. 2012: 75-77."
        },
        {
          id: 4,
          zh: "百度百科. <a href='https://baike.baidu.com/item/%E6%A5%BC%E5%85%B0%E5%9F%8E/5426738' target='_blank'>楼兰城</a>. 2025.",
          en: "Baidu Encyclopedia. <a href='https://baike.baidu.com/item/%E6%A5%BC%E5%85%B0%E5%9F%8E/5426738' target='_blank'>Loulan City</a>. 2025."
        },
        {
          id: 5,
          zh: "Lei, Y., et al. <a href='https://www.researchgate.net/publication/357911632_The_lake-level_changes_of_Lop_Nur_over_the_past_2000_years_and_its_linkage_to_the_decline_of_the_ancient_Loulan_Kingdom' target='_blank'>过去2000年罗布泊湖泊水位变化及其与古代楼兰王国衰落的联系</a>. Frontiers of Earth Science, 2022.",
          en: "Lei, Y., et al. <a href='https://www.researchgate.net/publication/357911632_The_lake-level_changes_of_Lop_Nur_over_the_past_2000_years_and_its_linkage_to_the_decline_of_the_ancient_Loulan_Kingdom' target='_blank'>The lake-level changes of Lop Nur over the past 2000 years and its linkage to the decline of the ancient Loulan Kingdom</a>. Frontiers of Earth Science, 2022."
        }
      ]
    },
    spot4: {
      title: "远眺三间房",
      titleEn: "View of the Three-Room House",
      image: "../public/images/OldCity_sanjianfang.webp",
      description: "这是从城址高处远眺三间房及其周围的沙漠景观。这一视角可以清晰地看到楼兰故城的整体布局和周围的地理环境<sup class='city-citation' data-ref='1'>1</sup>。远处连绵起伏的沙丘和戈壁地貌，展示了楼兰所处的极端干旱环境。楼兰故城在东晋太元元年（376年）前后，西域长史府撤离楼兰城后逐渐荒弃<sup class='city-citation' data-ref='2'>2</sup>。直到1900年，瑞典探险家斯文·赫定在罗布泊地区探险时重新发现了这座古城<sup class='city-citation' data-ref='3'>3</sup>。",
      descriptionEn: "This is a view of the Three-Room House and its surrounding desert landscape from a high point in the ruins. This perspective clearly shows the overall layout of the Loulan Ancient City and its geographical environment<sup class='city-citation' data-ref='1'>1</sup>. The undulating sand dunes and gobi terrain in the distance demonstrate the extremely arid environment of Loulan. The Loulan Ancient City was gradually abandoned around the first year of Taiyuan in the Eastern Jin Dynasty (376 CE) after the Western Regions Protectorate left<sup class='city-citation' data-ref='2'>2</sup>. It wasn't until 1900 that Swedish explorer Sven Hedin rediscovered this ancient city during his expedition in the Lop Nur region<sup class='city-citation' data-ref='3'>3</sup>.",
      references: [
        {
          id: 1,
          zh: "百度百科. <a href='https://baike.baidu.com/item/%E6%A5%BC%E5%85%B0%E6%95%85%E5%9F%8E%E9%81%97%E5%9D%80/2310140' target='_blank'>楼兰故城遗址</a>. 2025.",
          en: "Baidu Encyclopedia. <a href='https://baike.baidu.com/item/%E6%A5%BC%E5%85%B0%E6%95%85%E5%9F%8E%E9%81%97%E5%9D%80/2310140' target='_blank'>Loulan Ancient City Ruins</a>. 2025."
        },
        {
          id: 2,
          zh: "马雍. 丝绸之路与西域历史文化. 新疆大学出版社. 2005: 123-125.",
          en: "Ma, Yong. Silk Road and Historical Culture of Western Regions. Xinjiang University Press. 2005: 123-125."
        },
        {
          id: 3,
          zh: "斯文·赫定. 楼兰考古记. 新疆人民出版社译本. 2021: 68-70.",
          en: "Sven Hedin. Archaeological Notes on Loulan. Xinjiang People's Publishing House Translation. 2021: 68-70."
        }
      ]
    }
  };

  // 预加载图片
  function preloadImages() {
    for (const spot in spotsData) {
      const img = new Image();
      img.src = spotsData[spot].image;
    }
  }

  // 调用预加载函数
  preloadImages();

  // 点击红点显示详情
  mapMarkers.forEach(marker => {
    // 添加标记点悬停时的提示文本
    const spotId = marker.getAttribute('data-spot');
    const tooltip = document.createElement('div');
    tooltip.className = 'marker-tooltip';

    // 创建中文和英文提示
    const zhTooltip = document.createElement('span');
    zhTooltip.className = 'zh';
    zhTooltip.textContent = spotsData[spotId].title;

    const enTooltip = document.createElement('span');
    enTooltip.className = 'en';
    enTooltip.textContent = spotsData[spotId].titleEn;

    tooltip.appendChild(zhTooltip);
    tooltip.appendChild(enTooltip);
    marker.appendChild(tooltip);

    marker.addEventListener('click', function () {
      const spotId = this.getAttribute('data-spot');

      // 重置之前的活跃标记
      if (activeMarker && activeMarker !== this) {
        activeMarker.classList.remove('active-marker');
      }

      // 设置当前标记为活跃
      this.classList.add('active-marker');
      activeMarker = this;

      // 调用显示信息的函数
      showSpotInfo(spotId);
    });
  });

  // 关闭弹窗
  closeModal.addEventListener('click', function () {
    closeSpotModal();
  });

  // 点击弹窗外部关闭
  window.addEventListener('click', function (event) {
    if (event.target === spotModal) {
      closeSpotModal();
    }
  });

  // ESC键关闭弹窗
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && spotModal.style.display === 'block') {
      closeSpotModal();
    }
  });

  // 弹窗关闭函数
  function closeSpotModal() {
    spotModal.classList.remove('show');
    setTimeout(() => {
      spotModal.style.display = 'none';
      document.body.style.overflow = ''; // 恢复背景滚动
    }, 300);

    // 重置活跃标记
    if (activeMarker) {
      activeMarker.classList.remove('active-marker');
      activeMarker = null;
    }
  }

  // 显示选中的标记点信息
  function showSpotInfo(spotId) {
    const spotData = spotsData[spotId];

    if (spotData) {
      // 使用淡入效果显示图片
      spotImage.style.opacity = 0;
      spotImage.src = spotData.image;
      spotImage.alt = spotData.title;
      setTimeout(() => {
        spotImage.style.opacity = 1;
      }, 50);

      // 设置标题和描述
      spotTitle.innerHTML = spotData.title;
      spotTitleEn.innerHTML = spotData.titleEn;
      spotDescription.innerHTML = spotData.description;
      spotDescriptionEn.innerHTML = spotData.descriptionEn;

      // 添加参考文献部分
      if (spotData.references && spotData.references.length > 0) {
        // 先移除可能已存在的旧引用部分
        const oldRefsZh = document.getElementById('spot-references-zh');
        const oldRefsEn = document.getElementById('spot-references-en');
        if (oldRefsZh) oldRefsZh.remove();
        if (oldRefsEn) oldRefsEn.remove();

        // 创建中文参考文献
        const refsZh = document.createElement('div');
        refsZh.id = 'spot-references-zh';
        refsZh.className = 'zh references';
        refsZh.innerHTML = '<h3>参考文献</h3><ol></ol>';

        // 创建英文参考文献
        const refsEn = document.createElement('div');
        refsEn.id = 'spot-references-en';
        refsEn.className = 'en references';
        refsEn.innerHTML = '<h3>References</h3><ol></ol>';

        // 添加引用项
        spotData.references.forEach(ref => {
          const liZh = document.createElement('li');
          liZh.id = `spot-ref-${ref.id}`;
          liZh.innerHTML = ref.zh;
          refsZh.querySelector('ol').appendChild(liZh);

          const liEn = document.createElement('li');
          liEn.id = `spot-ref-${ref.id}-en`;
          liEn.innerHTML = ref.en;
          refsEn.querySelector('ol').appendChild(liEn);
        });

        // 添加到DOM
        document.querySelector('.spot-info').appendChild(refsZh);
        document.querySelector('.spot-info').appendChild(refsEn);
      }

      // 显示弹窗
      spotModal.style.display = 'block';
      setTimeout(() => {
        spotModal.classList.add('show');
      }, 10);
      document.body.style.overflow = 'hidden'; // 防止背景滚动

      // 添加引用点击事件
      document.querySelectorAll('.city-citation').forEach(citation => {
        citation.addEventListener('click', function (e) {
          e.preventDefault();
          const refId = this.getAttribute('data-ref');
          const currentLang = document.querySelector('.lang-btn.active').getAttribute('data-lang');
          const targetId = currentLang === 'zh' ? `spot-ref-${refId}` : `spot-ref-${refId}-en`;
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            // 平滑滚动到目标元素
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });

            // 高亮显示被引用的条目
            targetElement.classList.add('highlight-reference');
            setTimeout(() => {
              targetElement.classList.remove('highlight-reference');
            }, 2000);
          }
        });
      });

      // 根据当前语言显示内容
      const currentLang = document.querySelector('.lang-btn.active').getAttribute('data-lang');
      if (currentLang === 'zh') {
        document.querySelectorAll('.spot-modal-content .zh').forEach(el => el.style.display = 'block');
        document.querySelectorAll('.spot-modal-content .en').forEach(el => el.style.display = 'none');
      } else {
        document.querySelectorAll('.spot-modal-content .zh').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.spot-modal-content .en').forEach(el => el.style.display = 'block');
      }
    }
  }
}); 