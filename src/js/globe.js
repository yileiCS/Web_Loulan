document.addEventListener('DOMContentLoaded', function () {
  // 初始化变量
  const globeBtn = document.getElementById('globe-btn');
  const mapContainer = document.getElementById('map-container');
  const placeInfo = document.getElementById('place-info');
  const closeInfoBtn = document.querySelector('.close-info');
  const modeBtns = document.querySelectorAll('.map-mode-btn');
  const routeBtns = document.querySelectorAll('.map-route-btn');

  // ArcGIS数据源URL
  const arcgisRouteUrl = "https://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/SilkRoad_KidsFair2015/FeatureServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=json";
  const arcgisStopsUrl = "https://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/SilkRoad_KidsFair2015/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json";

  // 全局变量，用于存储ArcGIS数据
  let arcgisRouteData = null;
  let arcgisStopsData = null;
  let arcgisRouteLayer = null;
  // 添加一个变量跟踪路线显示状态
  let silkRoadVisible = false;

  // 音频控制
  const pageAudio = document.getElementById('pageAudio');
  if (pageAudio) {
    pageAudio.volume = 0.9;
  }

  // 丝绸之路重要城市数据
  const silkRoadCities = [
    {
      name: "楼兰古城",
      nameEn: "Loulan Ancient City",
      coords: [40.517, 89.833],
      type: "loulan",
      image: "../public/images/image_Loulan.png",
      description: {
        zh: "楼兰古城遗址位于今新疆维吾尔自治区若羌县罗布泊地区<sup class='city-citation' data-ref='1'>1</sup>。作为丝绸之路上的重要枢纽，楼兰曾繁华一时，直到约公元4世纪被废弃<sup class='city-citation' data-ref='2'>2</sup>。其地理位置在古代极为重要，是连接中原与西域的关键节点<sup class='city-citation' data-ref='3'>3</sup>。考古发现显示，这里曾有发达的农业和手工业，并有多种文化和宗教交融的痕迹<sup class='city-citation' data-ref='4'>4</sup>。",
        en: "The ruins of Loulan Ancient City are located in the Lop Nur area of Ruoqiang County, Xinjiang Uygur Autonomous Region<sup class='city-citation' data-ref='1'>1</sup>. As an important hub on the Silk Road, Loulan was once prosperous until it was abandoned around the 4th century CE<sup class='city-citation' data-ref='2'>2</sup>. Its geographical location was extremely important in ancient times, serving as a key node connecting Central China with the Western Regions<sup class='city-citation' data-ref='3'>3</sup>. Archaeological discoveries show that there was developed agriculture and handicrafts here, with traces of multiple cultures and religions<sup class='city-citation' data-ref='4'>4</sup>."
      },
      references: [
        {
          id: 1,
          zh: "维基百科. <a href='https://en.wikipedia.org/wiki/Loulan_Kingdom' target='_blank'>楼兰王国</a>. 2024.",
          en: "Wikipedia. <a href='https://en.wikipedia.org/wiki/Loulan_Kingdom' target='_blank'>Loulan Kingdom</a>. 2024."
        },
        {
          id: 2,
          zh: "中国日报. <a href='https://www.chinadaily.com.cn/a/202404/22/WS6625b5eca31082fc043c3229.html' target='_blank'>探索神秘的楼兰古城</a>. 2024年4月22日.",
          en: "China Daily. <a href='https://www.chinadaily.com.cn/a/202404/22/WS6625b5eca31082fc043c3229.html' target='_blank'>Exploring the mysterious Loulan Ancient City</a>. April 22, 2024."
        },
        {
          id: 3,
          zh: "ResearchGate. <a href='https://www.researchgate.net/publication/232503253_The_road_to_the_Loulan_Kingdom' target='_blank'>通往楼兰王国的道路</a>. 2018.",
          en: "ResearchGate. <a href='https://www.researchgate.net/publication/232503253_The_road_to_the_Loulan_Kingdom' target='_blank'>The road to the Loulan Kingdom</a>. 2018."
        },
        {
          id: 4,
          zh: "古代起源. <a href='https://www.ancient-origins.net/ancient-places-asia/beauty-loulan-and-tattooed-mummies-tarim-basin-001227' target='_blank'>楼兰美女和塔里木盆地的纹身木乃伊</a>. 2019.",
          en: "Ancient Origins. <a href='https://www.ancient-origins.net/ancient-places-asia/beauty-loulan-and-tattooed-mummies-tarim-basin-001227' target='_blank'>The Beauty of Loulan and the Tattooed Mummies of the Tarim Basin</a>. 2019."
        }
      ]
    },
    {
      name: "敦煌",
      nameEn: "Dunhuang",
      coords: [40.1425, 94.6618],
      type: "city",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Mona_Lisa_Buddha_%2827023604587%29.jpg/512px-Mona_Lisa_Buddha_%2827023604587%29.jpg?20180810125804",
      description: {
        zh: "敦煌位于河西走廊西端，是古代丝绸之路上的重要城市和佛教艺术中心<sup class='city-citation' data-ref='1'>1</sup>。以莫高窟闻名于世，保存了大量佛教壁画和雕塑<sup class='city-citation' data-ref='2'>2</sup>。敦煌曾是汉唐时期连接中国与中亚的贸易和文化交流中心，莫高窟的艺术珍品体现了东西方文化的交融<sup class='city-citation' data-ref='3'>3</sup>。",
        en: "Located at the western end of the Hexi Corridor, Dunhuang was an important city on the ancient Silk Road and a center of Buddhist art<sup class='city-citation' data-ref='1'>1</sup>. It is famous for the Mogao Caves, which preserve a large number of Buddhist murals and sculptures<sup class='city-citation' data-ref='2'>2</sup>. Dunhuang was a center of trade and cultural exchange connecting China and Central Asia during the Han and Tang dynasties. The artistic treasures of the Mogao Caves reflect the integration of Eastern and Western cultures<sup class='city-citation' data-ref='3'>3</sup>."
      },
      references: [
        {
          id: 1,
          zh: "维基百科. <a href='https://en.wikipedia.org/wiki/Dunhuang' target='_blank'>敦煌</a>. 2024.",
          en: "Wikipedia. <a href='https://en.wikipedia.org/wiki/Dunhuang' target='_blank'>Dunhuang</a>. 2024."
        },
        {
          id: 2,
          zh: "UNESCO世界遗产中心. <a href='https://whc.unesco.org/en/list/440' target='_blank'>莫高窟</a>. 2020.",
          en: "UNESCO World Heritage Centre. <a href='https://whc.unesco.org/en/list/440' target='_blank'>Mogao Caves</a>. 2020."
        },
        {
          id: 3,
          zh: "国际敦煌项目. <a href='http://idp.bl.uk/' target='_blank'>敦煌艺术与文化</a>. 2022.",
          en: "International Dunhuang Project. <a href='http://idp.bl.uk/' target='_blank'>Dunhuang Art and Culture</a>. 2022."
        }
      ]
    },
    {
      name: "吐鲁番",
      nameEn: "Turpan",
      coords: [42.9477, 89.1716],
      type: "city",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/%E9%BA%BB%E6%89%8E%E6%9D%91%E4%B8%80%E8%A7%92_3.jpg/512px-%E9%BA%BB%E6%89%8E%E6%9D%91%E4%B8%80%E8%A7%92_3.jpg?20231001134106",
      description: {
        zh: "吐鲁番位于新疆维吾尔自治区中部，是丝绸之路北道上的重要城市<sup class='city-citation' data-ref='1'>1</sup>。作为世界上最低的盆地之一，吐鲁番以其独特的坎儿井灌溉系统而闻名，使这个干旱地区成为绿洲<sup class='city-citation' data-ref='2'>2</sup>。高昌故城和柏孜克里克千佛洞等历史遗迹证明了其作为丝路商贸和文化交流中心的重要性<sup class='city-citation' data-ref='3'>3</sup>。",
        en: "Turpan is located in the central part of Xinjiang Uygur Autonomous Region and was an important city on the northern route of the Silk Road<sup class='city-citation' data-ref='1'>1</sup>. As one of the lowest basins in the world, Turpan is known for its unique karez irrigation system, which turned this arid region into an oasis<sup class='city-citation' data-ref='2'>2</sup>. Historical sites such as the Gaochang Ancient City and Bezeklik Thousand Buddha Caves testify to its importance as a center of trade and cultural exchange on the Silk Road<sup class='city-citation' data-ref='3'>3</sup>."
      },
      references: [
        {
          id: 1,
          zh: "维基百科. <a href='https://en.wikipedia.org/wiki/Turpan' target='_blank'>吐鲁番</a>. 2024.",
          en: "Wikipedia. <a href='https://en.wikipedia.org/wiki/Turpan' target='_blank'>Turpan</a>. 2024."
        },
        {
          id: 2,
          zh: "UNESCO. <a href='https://whc.unesco.org/en/tentativelists/5347/' target='_blank'>吐鲁番坎儿井系统</a>. 2019.",
          en: "UNESCO. <a href='https://whc.unesco.org/en/tentativelists/5347/' target='_blank'>The Karez System in Turpan</a>. 2019."
        },
        {
          id: 3,
          zh: "中国文化遗产研究院. <a href='http://www.cach.org.cn/' target='_blank'>高昌故城与柏孜克里克千佛洞</a>. 2021.",
          en: "Chinese Academy of Cultural Heritage. <a href='http://www.cach.org.cn/' target='_blank'>Gaochang Ancient City and Bezeklik Thousand Buddha Caves</a>. 2021."
        }
      ]
    },
    {
      name: "喀什",
      nameEn: "Kashgar",
      coords: [39.4700, 75.9900],
      type: "city",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Afaq_Khoja_Mausoleum_%282017%2C_crop%29.jpg/512px-Afaq_Khoja_Mausoleum_%282017%2C_crop%29.jpg?20230530232157",
      description: {
        zh: "喀什位于新疆维吾尔自治区西南部，是丝绸之路上最西端的中国城市之一，历来是连接中国与中亚、南亚的重要贸易枢纽<sup class='city-citation' data-ref='1'>1</sup>。喀什老城保留了传统的维吾尔建筑风格，艾提尕尔清真寺和香妃墓等是当地著名的历史遗迹<sup class='city-citation' data-ref='2'>2</sup>。作为多民族聚居地，喀什有着深厚的文化底蕴和多元的民族风情<sup class='city-citation' data-ref='3'>3</sup>。",
        en: "Located in the southwestern part of Xinjiang Uygur Autonomous Region, Kashgar is one of the westernmost Chinese cities on the Silk Road and has long been an important trade hub connecting China with Central and South Asia<sup class='city-citation' data-ref='1'>1</sup>. Kashgar Old City preserves the traditional Uyghur architectural style, and the Id Kah Mosque and Abakh Khoja Tomb are famous historical sites<sup class='city-citation' data-ref='2'>2</sup>. As a multi-ethnic settlement, Kashgar has a profound cultural heritage and diverse ethnic customs<sup class='city-citation' data-ref='3'>3</sup>."
      },
      references: [
        {
          id: 1,
          zh: "维基百科. <a href='https://en.wikipedia.org/wiki/Kashgar' target='_blank'>喀什</a>. 2024.",
          en: "Wikipedia. <a href='https://en.wikipedia.org/wiki/Kashgar' target='_blank'>Kashgar</a>. 2024."
        },
        {
          id: 2,
          zh: "中国国家地理. <a href='http://www.dili360.com/' target='_blank'>喀什老城与历史建筑</a>. 2022.",
          en: "China National Geography. <a href='http://www.dili360.com/' target='_blank'>Kashgar Old City and Historical Buildings</a>. 2022."
        },
        {
          id: 3,
          zh: "丝绸之路研究中心. <a href='https://www.silkroadstudies.org/' target='_blank'>丝路上的喀什文化</a>. 2021.",
          en: "Silk Road Studies. <a href='https://www.silkroadstudies.org/' target='_blank'>Kashgar Culture on the Silk Road</a>. 2021."
        }
      ]
    },
    {
      name: "长安 (西安)",
      nameEn: "Chang'an (Xi'an)",
      coords: [34.3416, 108.9398],
      type: "city",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/%E8%A5%BF%E5%AE%89_%E5%A4%A7%E9%9B%81%E5%A1%94%E9%A1%B6%E5%B1%82%E8%A7%82%E8%B5%8F_-_panoramio.jpg/512px-%E8%A5%BF%E5%AE%89_%E5%A4%A7%E9%9B%81%E5%A1%94%E9%A1%B6%E5%B1%82%E8%A7%82%E8%B5%8F_-_panoramio.jpg?20170310101915",
      description: {
        zh: "长安(今西安)是古代丝绸之路的东方起点，汉唐时期的中国首都<sup class='city-citation' data-ref='1'>1</sup>。作为当时世界上最大的城市之一，长安是政治、经济和文化中心，吸引了来自世界各地的商人和旅行者<sup class='city-citation' data-ref='2'>2</sup>。兵马俑、大雁塔等历史遗迹展示了其辉煌的历史<sup class='city-citation' data-ref='3'>3</sup>。作为丝路起点，长安在促进东西方文化交流中发挥了关键作用。",
        en: "Chang'an (present-day Xi'an) was the eastern starting point of the ancient Silk Road and the capital of China during the Han and Tang dynasties<sup class='city-citation' data-ref='1'>1</sup>. As one of the largest cities in the world at that time, Chang'an was a political, economic, and cultural center that attracted merchants and travelers from around the world<sup class='city-citation' data-ref='2'>2</sup>. Historical sites such as the Terracotta Army and the Big Wild Goose Pagoda showcase its glorious history<sup class='city-citation' data-ref='3'>3</sup>. As the starting point of the Silk Road, Chang'an played a key role in promoting cultural exchange between East and West."
      },
      references: [
        {
          id: 1,
          zh: "维基百科. <a href='https://en.wikipedia.org/wiki/Chang%27an?variant=zh-cn' target='_blank'>长安</a>. 2024.",
          en: "Wikipedia. <a href='https://en.wikipedia.org/wiki/Chang%27an?variant=zh-cn' target='_blank'>Chang'an</a>. 2024."
        },
        {
          id: 2,
          zh: "UNESCO世界遗产中心. <a href='https://whc.unesco.org/en/list/441/' target='_blank'>西安历史遗迹</a>. 2021.",
          en: "UNESCO World Heritage Centre. <a href='https://whc.unesco.org/en/list/441/' target='_blank'>Historic Monuments of Xi'an</a>. 2021."
        },
        {
          id: 3,
          zh: "中国历史研究院. <a href='http://www.cass.org.cn/' target='_blank'>唐长安与丝绸之路</a>. 2023.",
          en: "Chinese Academy of History. <a href='http://www.cass.org.cn/' target='_blank'>Tang Dynasty Chang'an and the Silk Road</a>. 2023."
        }
      ]
    },
    {
      name: "洛阳",
      nameEn: "Luoyang",
      coords: [34.6188, 112.4532],
      type: "city",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/%E6%B2%B3%E5%8D%97_%E9%BE%99%E9%97%A8%E7%9F%B3%E7%AA%9F_-_panoramio.jpg/512px-%E6%B2%B3%E5%8D%97_%E9%BE%99%E9%97%A8%E7%9F%B3%E7%AA%9F_-_panoramio.jpg?20170618184131",
      description: {
        zh: "洛阳位于河洛平原中部，是东汉和北魏等朝代的国都，也是丝绸之路上的重要城市<sup class='city-citation' data-ref='1'>1</sup>。作为佛教传入中国后最早的传播中心之一，洛阳的白马寺是中国第一座官办佛寺<sup class='city-citation' data-ref='2'>2</sup>。龙门石窟以其精美的佛教雕塑闻名于世。在丝绸之路的繁荣时期，洛阳是连接东西方的重要枢纽，促进了经济文化交流<sup class='city-citation' data-ref='3'>3</sup>。",
        en: "Located in the central Heluoshan Plain, Luoyang was the capital of dynasties such as the Eastern Han and Northern Wei, and an important city on the Silk Road<sup class='city-citation' data-ref='1'>1</sup>. As one of the earliest centers of Buddhism after its introduction to China, Luoyang's White Horse Temple is the first official Buddhist temple in China<sup class='city-citation' data-ref='2'>2</sup>. The Longmen Grottoes are famous for their exquisite Buddhist sculptures. During the prosperous period of the Silk Road, Luoyang was an important hub connecting East and West, promoting economic and cultural exchanges<sup class='city-citation' data-ref='3'>3</sup>."
      },
      references: [
        {
          id: 1,
          zh: "维基百科. <a href='https://en.wikipedia.org/wiki/Luoyang' target='_blank'>洛阳</a>. 2024.",
          en: "Wikipedia. <a href='https://en.wikipedia.org/wiki/Luoyang' target='_blank'>Luoyang</a>. 2024."
        },
        {
          id: 2,
          zh: "中国佛教协会. <a href='http://www.chinabuddhism.com.cn/' target='_blank'>白马寺与佛教东传</a>. 2022.",
          en: "Buddhist Association of China. <a href='http://www.chinabuddhism.com.cn/' target='_blank'>White Horse Temple and the Eastward Spread of Buddhism</a>. 2022."
        },
        {
          id: 3,
          zh: "UNESCO世界遗产中心. <a href='https://whc.unesco.org/en/list/1305/' target='_blank'>龙门石窟</a>. 2020.",
          en: "UNESCO World Heritage Centre. <a href='https://whc.unesco.org/en/list/1305/' target='_blank'>Longmen Grottoes</a>. 2020."
        }
      ]
    }
  ];

  // 丝绸之路路线数据 (简化的GeoJSON格式)
  const silkRoadRoutes = {
    northern: [
      [34.3416, 108.9398], // 长安(西安)
      [36.0151, 103.8391], // 兰州
      [39.7402, 98.4895], // 张掖
      [40.1425, 94.6618], // 敦煌
      [40.517, 89.833], // 楼兰
      [42.9477, 89.1716], // 吐鲁番
      [43.8257, 87.6168], // 乌鲁木齐
      [44.0153, 81.0265], // 伊宁
      [43.2686, 76.9535], // 阿拉木图
      [41.2646, 69.2163], // 塔什干
      [39.6541, 66.9597], // 撒马尔罕
      [39.7680, 64.4231]  // 布哈拉
    ],
    southern: [
      [34.3416, 108.9398], // 长安(西安)
      [34.6188, 112.4532], // 洛阳
      [38.4744, 106.2577], // 银川
      [40.1425, 94.6618], // 敦煌
      [40.517, 89.833], // 楼兰
      [39.4700, 75.9900], // 喀什
      [38.0851, 70.9296], // 霍罗格
      [36.7097, 67.1053], // 马扎里沙里夫
      [36.3134, 59.5687], // 马什哈德
      [34.3377, 47.0778]  // 克尔曼沙赫
    ]
  };

  // 地图实例
  let map;
  let currentRouteLayer;
  let markersLayer;

  // 控制地图显示
  if (globeBtn && mapContainer) {
    // 将点击事件应用到整个容器上
    const buttonContainer = document.querySelector('.silk-road-button-container');
    if (buttonContainer) {
      buttonContainer.addEventListener('click', function () {
        toggleMap();
      });
    } else {
      // 如果找不到新容器，保留旧的点击事件（向后兼容）
      globeBtn.addEventListener('click', function () {
        toggleMap();
      });
    }

    // 地图切换功能
    function toggleMap() {
      mapContainer.classList.toggle('hidden');

      if (!mapContainer.classList.contains('hidden') && !map) {
        initMap();
      } else if (!mapContainer.classList.contains('hidden') && map) {
        // 更新语言
        updateMapLanguage();
      }
    }
  }

  // 监听语言切换
  langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(button => {
    button.addEventListener('click', function () {
      // 如果地图已初始化，则更新地图语言
      if (map) {
        // 延迟一点执行，确保HTML的lang属性已更新
        setTimeout(updateMapLanguage, 100);
      }
    });
  });

  // 获取当前语言的文本
  function getLocalizedText(textObj) {
    const isEnglish = document.documentElement.getAttribute('lang') === 'en';
    if (typeof textObj === 'object') {
      return isEnglish ? textObj.en : textObj.zh;
    }
    return textObj;
  }

  // 播放音频（如果存在）
  function playAudio(audioFile) {
    // 这里可以添加音频播放逻辑，但由于未提供城市音频文件，暂时不实现
    console.log('播放音频文件:', audioFile);
  }

  // 初始化地图
  function initMap() {
    // 创建地图实例，居中显示楼兰位置
    map = L.map('silk-road-map').setView([40.517, 89.833], 5);

    // 添加卫星底图作为默认图层
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 17,
      className: 'map-tiles-desaturated' // 添加降低饱和度的类
    }).addTo(map);

    // 初始化标记图层
    markersLayer = L.layerGroup().addTo(map);

    // 设置相应按钮为活跃状态
    document.querySelector('.map-mode-btn[data-mode="satellite"]').classList.add('active');
    document.querySelector('.map-mode-btn[data-mode="terrain"]').classList.remove('active');
    // 确保路线按钮初始时不是活跃状态
    document.querySelector('.map-route-btn[data-route="arcgis"]').classList.remove('active');

    // 更新按钮文本为当前语言
    updateMapLanguage();

    // 禁用缩放按钮文本选择
    map.getContainer().style.outline = 'none';
  }

  // 获取ArcGIS丝绸之路数据
  function fetchArcGISData() {
    // 添加加载指示器
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>加载丝绸之路数据...</p>';
    document.getElementById('map-container').appendChild(loadingIndicator);

    // 确保路线按钮显示为活跃状态
    const arcgisButton = document.querySelector('.map-route-btn[data-route="arcgis"]');
    if (arcgisButton) {
      const allButtons = document.querySelectorAll('.map-route-btn');
      allButtons.forEach(btn => btn.classList.remove('active'));
      arcgisButton.classList.add('active');
    }

    // 获取路线数据
    fetch(arcgisRouteUrl)
      .then(response => response.json())
      .then(data => {
        arcgisRouteData = data;
        console.log('ArcGIS路线数据加载成功');

        // 同时获取站点数据
        return fetch(arcgisStopsUrl);
      })
      .then(response => response.json())
      .then(data => {
        arcgisStopsData = data;
        console.log('ArcGIS站点数据加载成功');

        // 先显示路线
        showArcGISRoutes();

        // 移除加载指示器
        document.getElementById('map-container').removeChild(loadingIndicator);

        // 稍后显示标记点，创建动画效果
        setTimeout(function () {
          addCityMarkers();
          showArcGISStops();
        }, 500);
      })
      .catch(error => {
        console.error('加载ArcGIS数据时出错:', error);

        // 移除加载指示器，显示错误信息
        loadingIndicator.innerHTML = '<p>加载丝绸之路数据失败，使用内置数据</p>';
        setTimeout(() => {
          document.getElementById('map-container').removeChild(loadingIndicator);
          // 使用内置路线
          showRoute('all');
        }, 2000);
      });
  }

  // 显示ArcGIS路线数据
  function showArcGISRoutes() {
    if (!arcgisRouteData || !arcgisRouteData.features || arcgisRouteData.features.length === 0) {
      console.error('没有有效的ArcGIS路线数据');
      return;
    }

    try {
      // 清除现有路线
      if (currentRouteLayer) {
        map.removeLayer(currentRouteLayer);
      }
      if (arcgisRouteLayer && map.hasLayer(arcgisRouteLayer)) {
        map.removeLayer(arcgisRouteLayer);
      }

      // 转换ArcGIS路线数据为GeoJSON格式
      const routeCoordinates = [];
      arcgisRouteData.features.forEach(feature => {
        if (feature.geometry && feature.geometry.paths) {
          feature.geometry.paths.forEach(path => {
            const processedPath = path.map(point => [point[1], point[0]]); // 转换[经度,纬度]为[纬度,经度]
            routeCoordinates.push(processedPath);
          });
        }
      });

      // 创建路线图层
      const routeLayers = [];

      routeCoordinates.forEach(path => {
        const line = L.polyline(path, {
          color: '#5d4037', // 深棕色
          weight: 3.2, // 减小20%（原来是4）
          opacity: 0.9,
          dashArray: '5, 10',
          className: 'arcgis-route'
        });
        routeLayers.push(line);
      });

      // 添加到地图
      arcgisRouteLayer = L.layerGroup(routeLayers).addTo(map);

      // 调整地图视图以显示所有路线
      const bounds = L.latLngBounds();
      routeCoordinates.forEach(path => {
        path.forEach(point => {
          bounds.extend(point);
        });
      });

      map.fitBounds(bounds, { padding: [50, 50] });

    } catch (error) {
      console.error('处理ArcGIS路线数据时出错:', error);
    }
  }

  // 显示ArcGIS站点数据
  function showArcGISStops() {
    if (!arcgisStopsData || !arcgisStopsData.features || arcgisStopsData.features.length === 0) {
      console.error('没有有效的ArcGIS站点数据');
      return;
    }

    try {
      // 重要城市坐标，这些点会有呼吸效果
      const importantCityCoords = silkRoadCities.map(city =>
        [city.coords[0].toFixed(3), city.coords[1].toFixed(3)]
      );

      // 添加ArcGIS站点
      arcgisStopsData.features.forEach(feature => {
        if (feature.geometry && feature.geometry.y && feature.geometry.x) {
          const lat = feature.geometry.y;
          const lng = feature.geometry.x;
          const name = feature.attributes.NAME || 'Unknown Stop';

          // 检查是否为重要城市坐标（有详细信息的点）
          const isImportantCity = importantCityCoords.some(coords =>
            Math.abs(lat - parseFloat(coords[0])) < 0.1 &&
            Math.abs(lng - parseFloat(coords[1])) < 0.1
          );

          if (isImportantCity) {
            // 跳过这个点，因为它已经由addCityMarkers函数添加
            return;
          }

          // 创建站点标记 - 小的静态白点
          const stopMarker = L.circleMarker([lat, lng], {
            radius: 3,  // 更小的圆点
            fillColor: '#ffffff',  // 白色
            color: '#ffffff',
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.6,
            zIndex: 900 // 确保高于路线层但低于主要城市点
          }).addTo(markersLayer);

          // 添加悬停提示
          if (name && name !== 'Unknown Stop') {
            stopMarker.bindTooltip(name, {
              permanent: false,
              direction: 'top',
              className: 'arcgis-tooltip'
            });
          }
        }
      });

      // 确保标记层在路线上方
      if (markersLayer) {
        markersLayer.bringToFront();
      }

    } catch (error) {
      console.error('处理ArcGIS站点数据时出错:', error);
    }
  }

  // 处理ArcGIS数据并显示在地图上
  function processArcGISData() {
    // 清除旧的标记点
    markersLayer.clearLayers();

    // 先显示路线
    showArcGISRoutes();

    // 然后显示标记点
    setTimeout(function () {
      addCityMarkers();
      showArcGISStops();
    }, 500);
  }

  // 添加城市标记 - 这些是带有详细信息的重要点位
  function addCityMarkers() {
    silkRoadCities.forEach(city => {
      // 根据城市类型设置标记样式
      let markerOptions = {
        radius: 8,
        fillColor: '#ffae42',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
        className: 'breathing-marker',
        zIndex: 1000 // 确保高于路线层
      };

      // 楼兰为特殊颜色和大小
      if (city.type === 'loulan') {
        markerOptions.radius = 10;
        markerOptions.fillColor = '#d9534f';
        markerOptions.weight = 3;
      }

      const marker = L.circleMarker(city.coords, markerOptions).addTo(markersLayer);

      marker.on('click', function () {
        showPlaceInfo(city);
      });

      marker.bindTooltip(getLocalizedText(city.name), {
        permanent: false,
        direction: 'top',
        className: 'marker-tooltip'
      });
    });
  }

  // 更新标记提示
  function updateMarkerTooltip(marker, city) {
    const isEnglish = document.documentElement.getAttribute('lang') === 'en';
    marker.unbindTooltip();
    marker.bindTooltip(isEnglish ? city.nameEn : city.name, {
      permanent: false,
      direction: 'top',
      className: 'marker-tooltip'
    });
  }

  // 显示地点信息
  function showPlaceInfo(place) {
    const placeName = document.getElementById('place-name');
    const placeImage = document.getElementById('place-image');
    const placeDescription = document.getElementById('place-description');

    // 根据当前语言设置内容
    const isEnglish = document.documentElement.getAttribute('lang') === 'en';

    placeName.textContent = isEnglish ? place.nameEn : place.name;
    placeImage.src = place.image;
    placeImage.alt = isEnglish ? place.nameEn : place.name;
    placeDescription.innerHTML = isEnglish ? place.description.en : place.description.zh;

    // 添加参考文献部分
    if (place.references && place.references.length > 0) {
      let referencesHtml = `
        <div class="place-references">
          <h4>${isEnglish ? 'References' : '参考文献'}</h4>
          <ol class="reference-list">
      `;

      place.references.forEach(ref => {
        referencesHtml += `<li id="city-ref-${ref.id}">${isEnglish ? ref.en : ref.zh}</li>`;
      });

      referencesHtml += `</ol></div>`;
      placeDescription.innerHTML += referencesHtml;

      // 添加引用点击事件
      setTimeout(() => {
        const citations = document.querySelectorAll('.city-citation');
        citations.forEach(citation => {
          citation.addEventListener('click', function () {
            const refId = this.getAttribute('data-ref');
            const targetRef = document.getElementById(`city-ref-${refId}`);
            if (targetRef) {
              targetRef.scrollIntoView({ behavior: 'smooth' });
              targetRef.classList.add('highlight-reference');
              setTimeout(() => {
                targetRef.classList.remove('highlight-reference');
              }, 2000);
            }
          });
        });
      }, 100);
    }

    // 显示信息面板
    placeInfo.classList.remove('hidden');
  }

  // 关闭地点信息
  if (closeInfoBtn) {
    closeInfoBtn.addEventListener('click', function () {
      placeInfo.classList.add('hidden');
    });
  }

  // 地图样式切换
  modeBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // 移除所有按钮的活跃状态
      modeBtns.forEach(b => b.classList.remove('active'));

      // 设置当前按钮为活跃状态
      this.classList.add('active');

      // 获取地图模式
      const mode = this.getAttribute('data-mode');

      // 移除当前底图
      map.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      // 添加新底图
      if (mode === 'terrain') {
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>',
          maxZoom: 17,
          className: 'map-tiles-desaturated'
        }).addTo(map);
      } else if (mode === 'satellite') {
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 17,
          className: 'map-tiles-desaturated'
        }).addTo(map);
      }
    });
  });

  // 路线切换
  routeBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // 获取路线类型
      const route = this.getAttribute('data-route');

      if (route === 'arcgis') {
        // 切换按钮状态
        if (silkRoadVisible) {
          // 如果路线当前可见，则隐藏
          this.classList.remove('active');

          // 清除路线和标记
          if (arcgisRouteLayer && map.hasLayer(arcgisRouteLayer)) {
            map.removeLayer(arcgisRouteLayer);
          }
          markersLayer.clearLayers();

          // 更新状态
          silkRoadVisible = false;
        } else {
          // 如果路线当前不可见，则显示
          // 移除所有按钮的活跃状态
          routeBtns.forEach(b => b.classList.remove('active'));

          // 设置当前按钮为活跃状态
          this.classList.add('active');

          // 清除现有的标记点
          markersLayer.clearLayers();

          // 如果arcgis数据已加载，显示路线和标记点
          if (arcgisRouteData) {
            // 先显示路线
            showArcGISRoutes();

            // 然后延迟显示标记点
            setTimeout(function () {
              addCityMarkers();
              showArcGISStops();
            }, 500);
          }
          // 如果arcgis数据未加载，加载它
          else {
            fetchArcGISData();
          }

          // 更新状态
          silkRoadVisible = true;
        }
      } else {
        // 其他路线处理逻辑保持不变
        // 移除所有按钮的活跃状态
        routeBtns.forEach(b => b.classList.remove('active'));

        // 设置当前按钮为活跃状态
        this.classList.add('active');

        // 显示其他路线
        showRoute(route);

        // 更新状态
        silkRoadVisible = true;
      }
    });
  });

  function showRoute(routeType) {
    // 清除当前路线
    if (currentRouteLayer) {
      map.removeLayer(currentRouteLayer);
    }

    // 如果ArcGIS路线正在显示，则根据选择决定是否隐藏
    if (arcgisRouteLayer && map.hasLayer(arcgisRouteLayer)) {
      map.removeLayer(arcgisRouteLayer);
    }

    if (routeType === 'all') {


      // 设置地图视图以显示所有路线
      const bounds = northLine.getBounds().extend(southLine.getBounds());
      map.fitBounds(bounds, { padding: [50, 50] });

    } else if (routeType === 'arcgis') {
      // 如果选择ArcGIS路线但数据尚未加载，则尝试加载
      if (!arcgisRouteData) {
        fetchArcGISData();
      } else {
        processArcGISData();
      }
    } else {
      // 显示单条路线
      let routeCoords = [];
      routeCoords = silkRoadRoutes[routeType];

      const color = '#5d4037'; // 深棕色（不再区分北道南道颜色）

      currentRouteLayer = L.polyline(routeCoords, {
        color: color,
        weight: 3.2, // 减小20%（原来是4）
        opacity: 0.8,
        dashArray: '5, 10'
      }).addTo(map);

      // 设置地图视图以显示所选路线
      map.fitBounds(currentRouteLayer.getBounds(), { padding: [50, 50] });
    }

    // 确保标记层在路线上方
    if (markersLayer) {
      markersLayer.bringToFront();
    }
  }

  // map language
  function updateMapLanguage() {
    const isEnglish = document.documentElement.getAttribute('lang') === 'en';

    // update map control button text
    document.querySelectorAll('.map-mode-btn').forEach(btn => {
      const mode = btn.getAttribute('data-mode');
      if (mode && mapButtonsText[mode]) {
        btn.textContent = isEnglish ? mapButtonsText[mode].en : mapButtonsText[mode].zh;
      }
    });

    document.querySelectorAll('.map-route-btn').forEach(btn => {
      const route = btn.getAttribute('data-route');
      if (route && mapButtonsText[route]) {
        btn.textContent = isEnglish ? mapButtonsText[route].en : mapButtonsText[route].zh;
      }
    });

    // update marker tooltip
    if (map && markersLayer) {
      markersLayer.eachLayer(function (layer) {
        // find the city data that matches the marker
        const markerLatLng = layer.getLatLng();
        const city = silkRoadCities.find(city =>
          city.coords[0] === markerLatLng.lat &&
          city.coords[1] === markerLatLng.lng
        );

        if (city) {
          updateMarkerTooltip(layer, city);
        }
      });
    }

    // update the place info that is currently displayed
    if (!placeInfo.classList.contains('hidden')) {
      const placeName = document.getElementById('place-name');
      const currentCityName = placeName.textContent;

      // find the city data that matches the place name
      const currentCity = silkRoadCities.find(city =>
        city.name === currentCityName || city.nameEn === currentCityName
      );

      if (currentCity) {
        showPlaceInfo(currentCity);
      }
    }
  }

  // map control button text
  const mapButtonsText = {
    terrain: {
      zh: "地形图",
      en: "Terrain"
    },
    satellite: {
      zh: "卫星图",
      en: "Satellite"
    },
    arcgis: {
      zh: "丝绸之路路线",
      en: "Silk Road Route"
    },
  };
}); 