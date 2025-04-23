document.addEventListener('DOMContentLoaded', function () {
  // initialize variables
  const globeBtn = document.getElementById('globe-btn');
  const mapContainer = document.getElementById('map-container');
  const placeInfo = document.getElementById('place-info');
  const closeInfoBtn = document.querySelector('.close-info');
  const modeBtns = document.querySelectorAll('.map-mode-btn');
  const routeBtns = document.querySelectorAll('.map-route-btn');

  // ArcGIS data source URL
  const arcgisRouteUrl = "https://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/SilkRoad_KidsFair2015/FeatureServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=json";
  const arcgisStopsUrl = "https://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/SilkRoad_KidsFair2015/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json";

  // global variables, for storing ArcGIS data
  let arcgisRouteData = null;
  let arcgisStopsData = null;
  let arcgisRouteLayer = null;
  // add a variable to track the route display status
  let silkRoadVisible = false;

  // audio control
  const pageAudio = document.getElementById('pageAudio');
  const homeAudio = document.getElementById('homeAudio');
  const currentAudio = pageAudio || homeAudio;

  // silk road important cities data
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

  // data of silk road routes (simplified GeoJSON format)
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

  // map instance
  let map;
  let currentRouteLayer;
  let markersLayer;

  // control the map display
  if (globeBtn && mapContainer) {
    // apply the click event to the whole container
    const buttonContainer = document.querySelector('.silk-road-button-container');
    if (buttonContainer) {
      buttonContainer.addEventListener('click', function () {
        toggleMap();
      });
    } else {
      // if the new container is not found, keep the old click event (backward compatibility)
      globeBtn.addEventListener('click', function () {
        toggleMap();
      });
    }

    // map switching function
    function toggleMap() {
      mapContainer.classList.toggle('hidden');

      if (!mapContainer.classList.contains('hidden') && !map) {
        initMap();
      } else if (!mapContainer.classList.contains('hidden') && map) {
        // update the language
        updateMapLanguage();
      }
    }
  }

  // listen to language switch
  langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(button => {
    button.addEventListener('click', function () {
      // if the map is initialized, update the map language
      if (map) {
        // delay a little to ensure the HTML lang attribute is updated
        setTimeout(updateMapLanguage, 100);
      }
    });
  });

  // get the text of the current language
  function getLocalizedText(textObj) {
    const isEnglish = document.documentElement.getAttribute('lang') === 'en';
    if (typeof textObj === 'object') {
      return isEnglish ? textObj.en : textObj.zh;
    }
    return textObj;
  }

  // play the audio (if exists)
  function playAudio(audioFile) {
    // here can add the audio playback logic, but since the city audio files are not provided, it is not implemented temporarily
    console.log('play the audio file:', audioFile);
  }

  // initialize the map
  function initMap() {
    // create the map instance, center on the location of Loulan
    map = L.map('silk-road-map').setView([40.517, 89.833], 5);

    // add the satellite base map as the default layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 17,
      className: 'map-tiles-desaturated' // add the class of desaturated
    }).addTo(map);

    // initialize the markers layer
    markersLayer = L.layerGroup().addTo(map);

    // set the corresponding buttons to active state
    document.querySelector('.map-mode-btn[data-mode="satellite"]').classList.add('active');
    document.querySelector('.map-mode-btn[data-mode="terrain"]').classList.remove('active');
    // ensure the route button is not active initially
    document.querySelector('.map-route-btn[data-route="arcgis"]').classList.remove('active');

    // update the button text to the current language
    updateMapLanguage();

    // disable the text selection of the zoom button
    map.getContainer().style.outline = 'none';
  }

  // get the ArcGIS silk road data
  function fetchArcGISData() {
    // add the loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>加载丝绸之路数据...</p>';
    document.getElementById('map-container').appendChild(loadingIndicator);

    // ensure the route button is displayed as active
    const arcgisButton = document.querySelector('.map-route-btn[data-route="arcgis"]');
    if (arcgisButton) {
      const allButtons = document.querySelectorAll('.map-route-btn');
      allButtons.forEach(btn => btn.classList.remove('active'));
      arcgisButton.classList.add('active');
    }

    // get the route data
    fetch(arcgisRouteUrl)
      .then(response => response.json())
      .then(data => {
        arcgisRouteData = data;
        console.log('ArcGIS路线数据加载成功');

        // get the stops data
        return fetch(arcgisStopsUrl);
      })
      .then(response => response.json())
      .then(data => {
        arcgisStopsData = data;
        console.log('ArcGIS站点数据加载成功');

        // show the routes first
        showArcGISRoutes();

        // remove the loading indicator
        document.getElementById('map-container').removeChild(loadingIndicator);

        // show the markers later, create the animation effect
        setTimeout(function () {
          addCityMarkers();
          showArcGISStops();
        }, 500);
      })
      .catch(error => {
        console.error('加载ArcGIS数据时出错:', error);

        // remove the loading indicator, show the error information
        loadingIndicator.innerHTML = '<p>加载丝绸之路数据失败，使用内置数据</p>';
        setTimeout(() => {
          document.getElementById('map-container').removeChild(loadingIndicator);
          // use the built-in routes
          showRoute('all');
        }, 2000);
      });
  }

  // show the ArcGIS routes data
  function showArcGISRoutes() {
    if (!arcgisRouteData || !arcgisRouteData.features || arcgisRouteData.features.length === 0) {
      console.error('没有有效的ArcGIS路线数据');
      return;
    }

    try {
      // clear the existing routes
      if (currentRouteLayer) {
        map.removeLayer(currentRouteLayer);
      }
      if (arcgisRouteLayer && map.hasLayer(arcgisRouteLayer)) {
        map.removeLayer(arcgisRouteLayer);
      }

      // convert the ArcGIS routes data to GeoJSON format
      const routeCoordinates = [];
      arcgisRouteData.features.forEach(feature => {
        if (feature.geometry && feature.geometry.paths) {
          feature.geometry.paths.forEach(path => {
            const processedPath = path.map(point => [point[1], point[0]]); // 转换[经度,纬度]为[纬度,经度]
            routeCoordinates.push(processedPath);
          });
        }
      });

      // create the route layer
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

      // add to the map
      arcgisRouteLayer = L.layerGroup(routeLayers).addTo(map);

      // adjust the map view to show all routes
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

  // show the ArcGIS stops data
  function showArcGISStops() {
    if (!arcgisStopsData || !arcgisStopsData.features || arcgisStopsData.features.length === 0) {
      console.error('没有有效的ArcGIS站点数据');
      return;
    }

    try {
      // important city coordinates, these points will have a breathing effect
      const importantCityCoords = silkRoadCities.map(city =>
        [city.coords[0].toFixed(3), city.coords[1].toFixed(3)]
      );

      // add the ArcGIS stops
      arcgisStopsData.features.forEach(feature => {
        if (feature.geometry && feature.geometry.y && feature.geometry.x) {
          const lat = feature.geometry.y;
          const lng = feature.geometry.x;
          const name = feature.attributes.NAME || 'Unknown Stop';

          // check if it is the important city coordinates (points with detailed information)
          const isImportantCity = importantCityCoords.some(coords =>
            Math.abs(lat - parseFloat(coords[0])) < 0.1 &&
            Math.abs(lng - parseFloat(coords[1])) < 0.1
          );

          if (isImportantCity) {
            // skip this point, because it has been added by the addCityMarkers function
            return;
          }

          // create the stop marker - a small static white point
          const stopMarker = L.circleMarker([lat, lng], {
            radius: 3,  // a smaller circle point
            fillColor: '#ffffff',  // white
            color: '#ffffff',
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.6,
            zIndex: 900 // ensure it is above the route layer but below the important city points
          }).addTo(markersLayer);

          // add the hover tooltip
          if (name && name !== 'Unknown Stop') {
            stopMarker.bindTooltip(name, {
              permanent: false,
              direction: 'top',
              className: 'arcgis-tooltip'
            });
          }
        }
      });

      // ensure the markers layer is above the routes
      if (markersLayer) {
        markersLayer.bringToFront();
      }

    } catch (error) {
      console.error('处理ArcGIS站点数据时出错:', error);
    }
  }

  // process the ArcGIS data and display it on the map
  function processArcGISData() {
    // clear the old markers
    markersLayer.clearLayers();

    // show the routes first
    showArcGISRoutes();

    // then show the markers
    setTimeout(function () {
      addCityMarkers();
      showArcGISStops();
    }, 500);
  }

  // add the city markers - these are the important points with detailed information
  function addCityMarkers() {
    silkRoadCities.forEach(city => {
      // set the marker style based on the city type
      let markerOptions = {
        radius: 8,
        fillColor: '#ffae42',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
        className: 'breathing-marker',
        zIndex: 1000 // ensure it is above the route layer
      };

      // Loulan is a special color and size
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

  // update the marker tooltip
  function updateMarkerTooltip(marker, city) {
    const isEnglish = document.documentElement.getAttribute('lang') === 'en';
    marker.unbindTooltip();
    marker.bindTooltip(isEnglish ? city.nameEn : city.name, {
      permanent: false,
      direction: 'top',
      className: 'marker-tooltip'
    });
  }

  // show the place info
  function showPlaceInfo(place) {
    const placeName = document.getElementById('place-name');
    const placeImage = document.getElementById('place-image');
    const placeDescription = document.getElementById('place-description');

    // set the content based on the current language
    const isEnglish = document.documentElement.getAttribute('lang') === 'en';

    placeName.textContent = isEnglish ? place.nameEn : place.name;
    placeImage.src = place.image;
    placeImage.alt = isEnglish ? place.nameEn : place.name;
    placeDescription.innerHTML = isEnglish ? place.description.en : place.description.zh;

    // add the references section
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

      // add the reference click event
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

    // show the info panel
    placeInfo.classList.remove('hidden');
  }

  // close the place info
  if (closeInfoBtn) {
    closeInfoBtn.addEventListener('click', function () {
      placeInfo.classList.add('hidden');
    });
  }

  // map style switch
  modeBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // remove the active state of all buttons
      modeBtns.forEach(b => b.classList.remove('active'));

      // set the current button to active state
      this.classList.add('active');

      // get the map mode
      const mode = this.getAttribute('data-mode');

      // remove the current base map
      map.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      // add the new base map
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

  // route switch
  routeBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // get the route type
      const route = this.getAttribute('data-route');

      if (route === 'arcgis') {
        // switch the button status
        if (silkRoadVisible) {
          // if the route is currently visible, hide it
          this.classList.remove('active');

          // clear the routes and markers
          if (arcgisRouteLayer && map.hasLayer(arcgisRouteLayer)) {
            map.removeLayer(arcgisRouteLayer);
          }
          markersLayer.clearLayers();

          // update the status
          silkRoadVisible = false;
        } else {
          // if the route is currently not visible, show it
          // remove the active state of all buttons
          routeBtns.forEach(b => b.classList.remove('active'));

          // set the current button to active state
          this.classList.add('active');

          // clear the existing markers
          markersLayer.clearLayers();

          // if the arcgis data is loaded, show the routes and markers
          if (arcgisRouteData) {
            // show the routes first
            showArcGISRoutes();

            // then delay the display of the markers
            setTimeout(function () {
              addCityMarkers();
              showArcGISStops();
            }, 500);
          }
          // if the arcgis data is not loaded, load it
          else {
            fetchArcGISData();
          }

          // update the status
          silkRoadVisible = true;
        }
      } else {
        // other route processing logic remains unchanged
        // remove the active state of all buttons
        routeBtns.forEach(b => b.classList.remove('active'));

        // set the current button to active state
        this.classList.add('active');

        // show the other routes
        showRoute(route);

        // update the status
        silkRoadVisible = true;
      }
    });
  });

  function showRoute(routeType) {
    // clear the current route
    if (currentRouteLayer) {
      map.removeLayer(currentRouteLayer);
    }

    // if the arcgis route is currently visible, decide whether to hide it based on the selection
    if (arcgisRouteLayer && map.hasLayer(arcgisRouteLayer)) {
      map.removeLayer(arcgisRouteLayer);
    }

    if (routeType === 'all') {


      // set the map view to show all routes
      const bounds = northLine.getBounds().extend(southLine.getBounds());
      map.fitBounds(bounds, { padding: [50, 50] });

    } else if (routeType === 'arcgis') {
      // if the arcgis route is selected but the data is not loaded, try to load it
      if (!arcgisRouteData) {
        fetchArcGISData();
      } else {
        processArcGISData();
      }
    } else {
      // show the single route
      let routeCoords = [];
      routeCoords = silkRoadRoutes[routeType];

      const color = '#5d4037'; // 深棕色（不再区分北道南道颜色）

      currentRouteLayer = L.polyline(routeCoords, {
        color: color,
        weight: 3.2, // 
        opacity: 0.8,
        dashArray: '5, 10'
      }).addTo(map);

      // set the map view to show the selected route
      map.fitBounds(currentRouteLayer.getBounds(), { padding: [50, 50] });
    }

    // ensure the markers layer is above the routes
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

  // intercept clicks
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const page = item.dataset.page;
      fetch(`pages/${page}.html`)
        .then(r => r.text())
        .then(html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          document.getElementById('app').innerHTML = doc.querySelector('#app').innerHTML;
          document.title = doc.title;
          history.pushState({ page }, '', `/${page}.html`);
          // 重新初始化语言、引用滚动、视频等逻辑
        });
    });
  });
  // 处理 back/forward
  window.addEventListener('popstate', e => {
    const page = e.state?.page || 'index';
    // 同上 fetch 并填充
  });
}); 