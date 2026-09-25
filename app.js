(() => {
  'use strict';

  /*
   * ============================================================
   * CONTRA COSTA GEOGRAPHY TRAINER
   * V12.2
   *
   * All quizable locations are handled exactly the same way.
   *
   * Cities
   * Unincorporated communities
   * Surrounding locations
   * Counties
   * Highways
   * Bridges
   * Major roadways
   * Bodies of water
   *
   * Every location comes from window.LOCATIONS in data.js
   * and is rendered as a point.
   *
   * There is NO separate route/line system.
   * ============================================================
   */

  const DATA = window.LOCATIONS || [];
  const CITY_NAMES = window.CITY_NAMES || [];

  const $ = id => document.getElementById(id);

  /*
   * ------------------------------------------------------------
   * QUIZ / STUDY GROUPS
   * ------------------------------------------------------------
   */

  const GROUPS = [
    ['city', 'Incorporated cities'],
    ['tested', 'Tested unincorporated'],
    ['supplemental', 'Additional unincorporated'],
    ['surrounding', 'Surrounding locations'],
    ['county', 'Counties'],
    ['highway', 'Major highways'],
    ['bridge', 'Bridges'],
    ['road', 'Major roadways'],
    ['water', 'Bodies of water']
  ];

  /*
   * ------------------------------------------------------------
   * APPLICATION STATE
   * ------------------------------------------------------------
   */

  let mode = 'study';

  let target = null;

  let attempts = 0;
  let correct = 0;

  let boundariesLoaded = false;

  let wrongName = null;

  const completed = new Set();

  const review = new Map();
console.log("Highways found:", DATA.filter(item => item.group === "highway"));
  /*
   * ------------------------------------------------------------
   * DATA
   *
   * V12.2 IMPORTANT:
   *
   * There is NO special treatment for highways or roads here.
   *
   * Everything comes from LOCATIONS in data.js.
   * ------------------------------------------------------------
   */

  function items(group) {
    return DATA.filter(
      item => item.group === group
    );
  }

  /*
   * ------------------------------------------------------------
   * BUILD CATEGORY CHECKBOXES
   * ------------------------------------------------------------
   */

  $('poolChecks').innerHTML = GROUPS
    .map(([group, label], index) => {

      const count = items(group).length;

      return `
        <label>
          <input
            data-group="${group}"
            type="checkbox"
            ${index < 2 ? 'checked' : ''}
          >

          <span>
            <b>${label}</b>
            <small> — ${count}</small>
          </span>
        </label>
      `;
    })
    .join('');

  /*
   * ------------------------------------------------------------
   * CHECKBOX / POOL HELPERS
   * ------------------------------------------------------------
   */

  function checked(group) {

    const checkbox =
      document.querySelector(
        `input[data-group="${group}"]`
      );

    return !!checkbox?.checked;
  }


  function pool() {

    return GROUPS.flatMap(
      ([group]) => {

        if (!checked(group)) {
          return [];
        }

        return items(group);
      }
    );
  }

  /*
   * ------------------------------------------------------------
   * MAP
   * ------------------------------------------------------------
   */

  const map = new maplibregl.Map({

    container: 'map',

    style:
      'https://tiles.openfreemap.org/styles/liberty',

    center: [
      -121.98,
      37.94
    ],

    zoom: 9.55,

    minZoom: 7.5,

    maxZoom: 17,

    attributionControl: true
  });


  map.addControl(
    new maplibregl.NavigationControl(),
    'top-left'
  );


  map.addControl(
    new maplibregl.ScaleControl({
      maxWidth: 120,
      unit: 'imperial'
    }),
    'bottom-left'
  );

  /*
   * ------------------------------------------------------------
   * CENSUS GIS
   *
   * City polygons and county boundaries are reference layers.
   *
   * They are NOT part of the quiz marker system.
   * ------------------------------------------------------------
   */

  function query(
    base,
    where,
    fields
  ) {

    return (
      base +
      '/query?where=' +
      encodeURIComponent(where) +
      '&outFields=' +
      encodeURIComponent(fields) +
      '&returnGeometry=true' +
      '&outSR=4326' +
      '&f=geojson'
    );
  }


  const cityWhere =
    "STATE='06' AND BASENAME IN (" +
    CITY_NAMES
      .map(name => "'" + name + "'")
      .join(',') +
    ')';


  const cityURL = query(

    'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/4',

    cityWhere,

    'BASENAME,GEOID'
  );


  const countyURL = query(

    'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1',

    "GEOID='06013'",

    'BASENAME,GEOID'
  );


  const regionalURL = query(

    'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1',

    "GEOID IN ('06013','06095','06077','06001','06041','06067')",

    'BASENAME,GEOID'
  );

  /*
   * ------------------------------------------------------------
   * FIND BOUNDS OF GEOJSON
   * ------------------------------------------------------------
   */

  function geoBounds(geojson) {

    const xs = [];
    const ys = [];


    function walk(coordinates) {

      if (
        Array.isArray(coordinates) &&
        typeof coordinates[0] === 'number'
      ) {

        xs.push(coordinates[0]);
        ys.push(coordinates[1]);

        return;
      }


      if (Array.isArray(coordinates)) {

        coordinates.forEach(walk);
      }
    }


    geojson.features.forEach(
      feature => {

        if (feature.geometry) {

          walk(
            feature.geometry.coordinates
          );
        }
      }
    );


    if (!xs.length) {
      return null;
    }


    return [

      [
        Math.min(...xs),
        Math.min(...ys)
      ],

      [
        Math.max(...xs),
        Math.max(...ys)
      ]
    ];
  }

  /*
   * ------------------------------------------------------------
   * LOAD CENSUS BOUNDARIES
   * ------------------------------------------------------------
   */

  async function loadGIS() {

    try {

      const responses =
        await Promise.all([

          fetch(cityURL),

          fetch(countyURL),

          fetch(regionalURL)
        ]);


      const data =
        await Promise.all(

          responses.map(
            response => response.json()
          )
        );

      /*
       * CITY POLYGONS
       */

      map.addSource(
        'cities',
        {
          type: 'geojson',
          data: data[0]
        }
      );


      map.addLayer({

        id: 'city-fill',

        type: 'fill',

        source: 'cities',

        paint: {

          'fill-color':
            '#8fb8d8',

          'fill-opacity':
            0.30
        }
      });


      map.addLayer({

        id: 'city-outline',

        type: 'line',

        source: 'cities',

        paint: {

          'line-color':
            '#394b59',

          'line-width':
            1.5
        }
      });

      /*
       * REGIONAL COUNTY BOUNDARIES
       */

      map.addSource(
        'regional-counties',
        {
          type: 'geojson',
          data: data[2]
        }
      );


      map.addLayer({

        id:
          'regional-county-outline',

        type: 'line',

        source:
          'regional-counties',

        layout: {

          visibility:
            'none'
        },

        paint: {

          'line-color':
            '#7058a8',

          'line-width':
            2
        }
      });

      /*
       * CONTRA COSTA COUNTY BOUNDARY
       */

      map.addSource(
        'county',
        {
          type: 'geojson',
          data: data[1]
        }
      );


      map.addLayer({

        id: 'county-outline',

        type: 'line',

        source: 'county',

        paint: {

          'line-color':
            '#102b42',

          'line-width':
            3
        }
      });


      const bounds =
        geoBounds(data[1]);


      if (bounds) {

        map.fitBounds(
          bounds,
          {
            padding: 30,
            duration: 0
          }
        );
      }


      boundariesLoaded = true;


      $('status').textContent =
        '2026 Census city/county boundaries loaded';

    } catch (error) {

      console.error(
        'Census GIS load error:',
        error
      );


      $('status').textContent =
        'Census boundary service unavailable; map quiz still works';
    }
  }

  /*
   * ============================================================
   * POINT SYSTEM
   *
   * THIS IS THE IMPORTANT V12.2 CHANGE.
   *
   * Every enabled item from data.js is converted into exactly
   * the same GeoJSON Point feature.
   *
   * There is no:
   *
   * ROUTES
   * routeTemplate
   * syncRoutes
   * route-hit
   * route-open
   * route-done
   * highway line matching
   * road line matching
   *
   * Everything is a point.
   * ============================================================
   */

  function pointGeo() {

    const features =
      pool().map(item => {

        let status = 'open';


        if (
          completed.has(item.name)
        ) {

          status = 'done';

        } else if (
          wrongName === item.name
        ) {

          status = 'wrong';
        }


        return {

          type: 'Feature',

          properties: {

            name:
              item.name,

            group:
              item.group,

            status:
              status
          },

          geometry: {

            type: 'Point',

            coordinates: [

              Number(item.lon),

              Number(item.lat)
            ]
          }
        };
      });


    return {

      type:
        'FeatureCollection',

      features:
        features
    };
  }

  /*
   * ------------------------------------------------------------
   * POINT COLOR
   *
   * The only difference between categories is color.
   *
   * Rendering and quiz behavior are identical.
   * ------------------------------------------------------------
   */

  function syncPoints() {

    const source =
      map.getSource('places');


    if (source) {

      source.setData(
        pointGeo()
      );

      return;
    }


    map.addSource(
      'places',
      {

        type: 'geojson',

        data: pointGeo()
      }
    );


    map.addLayer({

      id: 'places',

      type: 'circle',

      source: 'places',

      paint: {

        'circle-radius':
          isPhone()
            ? 8.5
            : 6.5,


        'circle-color': [

          'case',

          /*
           * Completed
           */

          [
            '==',
            ['get', 'status'],
            'done'
          ],

          '#f2b705',


          /*
           * Wrong selection
           */

          [
            '==',
            ['get', 'status'],
            'wrong'
          ],

          '#d73027',


          /*
           * Normal category color
           */

          [
            'match',

            ['get', 'group'],


            'city',
            '#075fe4',


            'tested',
            '#07864c',


            'supplemental',
            '#df5ca8',


            'surrounding',
            '#e67e22',


            'county',
            '#7c4dcc',


            'highway',
            '#d85b2a',


            'bridge',
            '#15a7a1',


            'road',
            '#d6428b',


            'water',
            '#2980b9',


            '#777777'
          ]
        ],


        'circle-stroke-color':
          '#ffffff',


        'circle-stroke-width':
          1.8
      }
    });
  }

  /*
   * ------------------------------------------------------------
   * TRAINER LABELS
   * ------------------------------------------------------------
   */

  function syncLabels() {

    if (
      map.getLayer('place-labels')
    ) {

      map.removeLayer(
        'place-labels'
      );
    }


    if (
      mode !== 'study'
    ) {

      return;
    }


    if (
      !$('labels').checked
    ) {

      return;
    }


    if (
      !map.getSource('places')
    ) {

      return;
    }


    map.addLayer({

      id:
        'place-labels',

      type:
        'symbol',

      source:
        'places',

      layout: {

        'text-field':
          ['get', 'name'],

        'text-size':
          12,

        'text-offset':
          [0.8, 0],

        'text-anchor':
          'left',

        'text-allow-overlap':
          false
      },

      paint: {

        'text-color':
          '#173150',

        'text-halo-color':
          'rgba(255,255,255,.95)',

        'text-halo-width':
          1.5
      }
    });
  }

  /*
   * ------------------------------------------------------------
   * BASEMAP LABELS
   *
   * Study:
   * show normal map labels.
   *
   * Quiz:
   * hide them.
   * ------------------------------------------------------------
   */

  function setBasemapLabels(show) {

    const style =
      map.getStyle();


    const layers =
      style?.layers || [];


    layers.forEach(layer => {

      if (
        layer.id ===
        'place-labels'
      ) {

        return;
      }


      if (
        layer.type !==
        'symbol'
      ) {

        return;
      }


      if (
        !layer.layout
      ) {

        return;
      }


      if (
        !(
          'text-field'
          in layer.layout
        )
      ) {

        return;
      }


      try {

        map.setLayoutProperty(

          layer.id,

          'visibility',

          show
            ? 'visible'
            : 'none'
        );

      } catch (error) {

        /*
         * Some basemap layers may not allow
         * modification. Ignore those layers.
         */
      }
    });
  }

  /*
   * ------------------------------------------------------------
   * REFRESH
   * ------------------------------------------------------------
   */

  function refresh() {

    if (
      map.loaded()
    ) {

      syncPoints();

      syncLabels();
    }


    $('poolCount').textContent =
      pool().length;


    updateProgress();

    renderStudyLists();

    updateMobileOverlay();
  }

  /*
   * ------------------------------------------------------------
   * PHONE DETECTION
   * ------------------------------------------------------------
   */

  function isPhone() {

    return window.matchMedia(
      '(max-width: 600px)'
    ).matches;
  }

  /*
   * ------------------------------------------------------------
   * MOBILE OVERLAY
   * ------------------------------------------------------------
   */

  function updateMobileOverlay(
    studyItem = null
  ) {

    const box =
      $('mobileOverlay');


    if (!box) {
      return;
    }


    if (
      !isPhone() ||
      mode === 'list'
    ) {

      box.hidden = true;

      return;
    }


    if (
      mode === 'quiz'
    ) {

      box.hidden = false;

      box.className =
        'mobile-overlay quiz-overlay';


      const completedCount =
        pool().filter(
          item =>
            completed.has(
              item.name
            )
        ).length;


      box.innerHTML = `

        <small>
          QUIZ
        </small>

        <strong>
          Find:
          ${
            target
              ? target.name
              : '—'
          }
        </strong>

        <span>
          ${completedCount}
          of
          ${pool().length}
          completed
        </span>
      `;

      return;
    }


    if (
      mode === 'study' &&
      studyItem
    ) {

      const groupLabel =
        GROUPS.find(
          ([group]) =>
            group ===
            studyItem.group
        )?.[1]
        ||
        studyItem.group;


      box.hidden = false;

      box.className =
        'mobile-overlay study-overlay';


      box.innerHTML = `

        <small>
          STUDY
        </small>

        <strong>
          ${studyItem.name}
        </strong>

        <span>
          ${groupLabel}
        </span>
      `;

      return;
    }


    box.hidden = true;
  }

  /*
   * ------------------------------------------------------------
   * AVAILABLE QUESTIONS
   * ------------------------------------------------------------
   */

  function available() {

    return pool().filter(
      item =>
        !completed.has(
          item.name
        )
    );
  }

  /*
   * ------------------------------------------------------------
   * NEW QUESTION
   * ------------------------------------------------------------
   */

  function newQuestion() {

    const currentPool =
      pool();


    const remaining =
      available();


    if (
      !currentPool.length
    ) {

      target = null;


      $('target').textContent =
        'No items enabled';


      $('feedback').textContent =
        'Select at least one category.';


      updateMobileOverlay();

      return;
    }


    if (
      !remaining.length
    ) {

      target = null;


      $('target').textContent =
        'Round complete!';


      $('feedback').innerHTML =

        '<span class="good">' +

        'Review your Study Next list below.' +

        '</span>';


      updateMobileOverlay();

      return;
    }


    const randomIndex =
      Math.floor(
        Math.random() *
        remaining.length
      );


    target =
      remaining[randomIndex];


    $('target').textContent =
      target.name;


    $('feedback').textContent =
      '';


    updateMobileOverlay();
  }

  /*
   * ------------------------------------------------------------
   * MODE
   * ------------------------------------------------------------
   */

  function setMode(
    newMode
  ) {

    mode =
      newMode;


    $('study')
      .classList
      .toggle(
        'active',
        newMode === 'study'
      );


    $('quiz')
      .classList
      .toggle(
        'active',
        newMode === 'quiz'
      );


    $('listMode')
      .classList
      .toggle(
        'active',
        newMode === 'list'
      );


    $('quizbox').hidden =
      newMode !== 'quiz';


    $('mapPanel').hidden =
      newMode === 'list';


    $('studyPanel').hidden =
      newMode !== 'list';


    $('labels').disabled =
      newMode === 'quiz';


    if (
      newMode === 'list'
    ) {

      updateMobileOverlay();

      renderStudyLists();

      return;
    }


    map.resize();


    setBasemapLabels(
      newMode === 'study'
    );


    syncLabels();


    if (
      newMode === 'quiz'
    ) {

      newQuestion();

    } else {

      updateMobileOverlay();
    }


    renderStudyLists();
  }

  /*
   * ------------------------------------------------------------
   * REVIEW LIST
   * ------------------------------------------------------------
   */

  function markReview(
    question,
    wrong
  ) {

    if (
      !review.has(question)
    ) {

      review.set(
        question,
        new Set()
      );
    }


    if (wrong) {

      review
        .get(question)
        .add(wrong);
    }


    renderReview();
  }


  function renderReview() {

    if (
      !review.size
    ) {

      $('review').textContent =
        'No misses yet.';

      return;
    }


    $('review').innerHTML =

      [...review]

        .map(
          ([
            question,
            selections
          ]) => {

            if (
              selections.size
            ) {

              return `

                <div>

                  <b>
                    ${question}
                  </b>

                  — selected:

                  ${
                    [...selections]
                      .join(', ')
                  }

                </div>
              `;
            }


            return `

              <div>

                <b>
                  ${question}
                </b>

                — skipped / review

              </div>
            `;
          }
        )

        .join('');
  }

  /*
   * ------------------------------------------------------------
   * SCORE
   * ------------------------------------------------------------
   */

  function updateStats() {

    $('score').textContent =
      correct +
      ' / ' +
      attempts;


    $('accuracy').textContent =

      attempts

        ? Math.round(
            correct /
            attempts *
            100
          ) + '%'

        : '—';
  }

  /*
   * ------------------------------------------------------------
   * PROGRESS
   * ------------------------------------------------------------
   */

  function updateProgress() {

    const currentPool =
      pool();


    const numberCompleted =
      currentPool.filter(
        item =>
          completed.has(
            item.name
          )
      ).length;


    $('progress').textContent =

      numberCompleted +

      ' of ' +

      currentPool.length +

      ' completed';
  }

  /*
   * ------------------------------------------------------------
   * RESTART QUIZ
   *
   * Review list intentionally remains.
   * ------------------------------------------------------------
   */

  function restart() {

    completed.clear();


    attempts = 0;

    correct = 0;

    target = null;

    wrongName = null;


    updateStats();

    refresh();


    if (
      mode === 'quiz'
    ) {

      newQuestion();
    }
  }

  /*
   * ------------------------------------------------------------
   * STUDY LIST
   * ------------------------------------------------------------
   */

  function renderStudyLists() {

    $('studyLists').innerHTML =

      GROUPS

        .map(
          ([group, label]) => {

            const names =

              items(group)

                .map(
                  item =>
                    item.name
                )

                .sort(
                  (a, b) =>
                    a.localeCompare(b)
                );


            return `

              <section>

                <h3>

                  ${label}

                  <small>
                    (${names.length})
                  </small>

                </h3>

                <ol>

                  ${
                    names

                      .map(
                        name =>
                          `<li>${name}</li>`
                      )

                      .join('')
                  }

                </ol>

              </section>
            `;
          }
        )

        .join('');
  }

  /*
   * ============================================================
   * MAP LOAD
   * ============================================================
   */

  map.on(
    'load',
    async () => {

      /*
       * Load Census reference boundaries.
       */

      await loadGIS();


      /*
       * Create ONE point source and ONE point layer.
       *
       * Every location category uses this.
       */

      syncPoints();

      syncLabels();

      renderStudyLists();


      /*
       * --------------------------------------------------------
       * CLICK ANY LOCATION DOT
       *
       * City dot?
       * Same handler.
       *
       * Alamo?
       * Same handler.
       *
       * I-80?
       * Same handler.
       *
       * Ygnacio Valley Road?
       * Same handler.
       *
       * Bridge?
       * Same handler.
       *
       * Water?
       * Same handler.
       * --------------------------------------------------------
       */

      map.on(
        'click',
        'places',
        event => {

          const feature =
            event.features?.[0];


          if (!feature) {
            return;
          }


          const name =
            feature.properties?.name;


          if (!name) {
            return;
          }


          /*
           * STUDY MODE
           */

          if (
            mode === 'study'
          ) {

            if (
              isPhone()
            ) {

              const item =
                DATA.find(
                  entry =>
                    entry.name ===
                    name
                );


              if (item) {

                updateMobileOverlay(
                  item
                );
              }
            }


            return;
          }


          /*
           * QUIZ MODE
           */

          handleChoice(
            name
          );
        }
      );


      /*
       * Mouse pointer
       */

      map.on(
        'mouseenter',
        'places',
        () => {

          map.getCanvas()
            .style.cursor =
              'pointer';
        }
      );


      map.on(
        'mouseleave',
        'places',
        () => {

          map.getCanvas()
            .style.cursor =
              '';
        }
      );
    }
  );

  /*
   * ------------------------------------------------------------
   * HANDLE QUIZ ANSWER
   * ------------------------------------------------------------
   */

  function handleChoice(
    name
  ) {

    if (
      mode !== 'quiz'
    ) {

      return;
    }


    if (!target) {

      return;
    }


    if (
      completed.has(name)
    ) {

      return;
    }


    attempts++;


    if (
      name === target.name
    ) {

      correct++;


      completed.add(
        name
      );


      wrongName =
        null;


      $('feedback').innerHTML =

        '<span class="good">' +

        'Correct! ' +

        name +

        ' is complete.' +

        '</span>';


      updateStats();

      refresh();


      setTimeout(
        () => {

          newQuestion();

        },
        650
      );


      return;
    }

    /*
     * WRONG ANSWER
     */

    markReview(
      target.name,
      name
    );


    wrongName =
      name;


    $('feedback').innerHTML =

      '<span class="bad">' +

      'That was ' +

      name +

      '. Try again.' +

      '</span>';


    updateStats();

    refresh();


    setTimeout(
      () => {

        wrongName =
          null;


        if (
          map.getSource('places')
        ) {

          map
            .getSource('places')
            .setData(
              pointGeo()
            );
        }

      },
      500
    );
  }

  /*
   * ============================================================
   * BUTTON EVENTS
   * ============================================================
   */

  $('study').onclick =
    () => {

      setMode(
        'study'
      );
    };


  $('quiz').onclick =
    () => {

      setMode(
        'quiz'
      );
    };


  $('listMode').onclick =
    () => {

      setMode(
        'list'
      );
    };


  $('newq').onclick =
    () => {

      newQuestion();
    };


  $('skip').onclick =
    () => {

      if (!target) {
        return;
      }


      markReview(
        target.name,
        null
      );


      newQuestion();
    };


  $('restart').onclick =
    () => {

      restart();
    };


  $('clearReview').onclick =
    () => {

      review.clear();

      renderReview();
    };

  /*
   * ------------------------------------------------------------
   * CATEGORY CHECKBOX EVENTS
   * ------------------------------------------------------------
   */

  document
    .querySelectorAll(
      '[data-group]'
    )
    .forEach(
      input => {

        input.addEventListener(
          'change',
          () => {

            refresh();


            if (
              mode === 'quiz'
            ) {

              /*
               * If the existing target belongs
               * to a category that was unchecked,
               * choose a new target.
               */

              const currentNames =
                new Set(
                  pool().map(
                    item =>
                      item.name
                  )
                );


              if (
                !target ||
                !currentNames.has(
                  target.name
                )
              ) {

                newQuestion();

              } else {

                updateMobileOverlay();
              }
            }
          }
        );
      }
    );

  /*
   * ------------------------------------------------------------
   * TRAINER LABEL CHECKBOX
   * ------------------------------------------------------------
   */

  $('labels').addEventListener(
    'change',
    () => {

      syncLabels();
    }
  );

  /*
   * ------------------------------------------------------------
   * CITY BOUNDARY CHECKBOX
   * ------------------------------------------------------------
   */

  $('cityBounds').addEventListener(
    'change',
    event => {

      if (
        !boundariesLoaded
      ) {

        return;
      }


      const visibility =

        event.target.checked

          ? 'visible'

          : 'none';


      [
        'city-fill',
        'city-outline'
      ].forEach(
        id => {

          if (
            map.getLayer(id)
          ) {

            map.setLayoutProperty(
              id,
              'visibility',
              visibility
            );
          }
        }
      );
    }
  );

  /*
   * ------------------------------------------------------------
   * REGIONAL COUNTY BOUNDARY CHECKBOX
   * ------------------------------------------------------------
   */

  $('regionalCountyBounds')
    .addEventListener(
      'change',
      event => {

        if (
          !boundariesLoaded
        ) {

          return;
        }


        if (
          !map.getLayer(
            'regional-county-outline'
          )
        ) {

          return;
        }


        map.setLayoutProperty(

          'regional-county-outline',

          'visibility',

          event.target.checked
            ? 'visible'
            : 'none'
        );
      }
    );

  /*
   * ------------------------------------------------------------
   * CONTRA COSTA COUNTY BOUNDARY CHECKBOX
   * ------------------------------------------------------------
   */

  $('countyBound')
    .addEventListener(
      'change',
      event => {

        if (
          !boundariesLoaded
        ) {

          return;
        }


        if (
          !map.getLayer(
            'county-outline'
          )
        ) {

          return;
        }


        map.setLayoutProperty(

          'county-outline',

          'visibility',

          event.target.checked
            ? 'visible'
            : 'none'
        );
      }
    );

  /*
   * ------------------------------------------------------------
   * CITY POLYGON OPACITY
   * ------------------------------------------------------------
   */

  $('opacity')
    .addEventListener(
      'input',
      event => {

        if (
          !boundariesLoaded
        ) {

          return;
        }


        if (
          !map.getLayer(
            'city-fill'
          )
        ) {

          return;
        }


        map.setPaintProperty(

          'city-fill',

          'fill-opacity',

          Number(
            event.target.value
          ) / 100
        );
      }
    );

  /*
   * ------------------------------------------------------------
   * RESET MAP
   * ------------------------------------------------------------
   */

  $('reset').onclick =
    () => {

      map.flyTo({

        center: [
          -121.98,
          37.94
        ],

        zoom:
          9.55
      });
    };

  /*
   * ------------------------------------------------------------
   * WINDOW RESIZE / MOBILE
   * ------------------------------------------------------------
   */

  window.addEventListener(
    'resize',
    () => {

      map.resize();


      updateMobileOverlay();


      if (
        map.getLayer('places')
      ) {

        map.setPaintProperty(

          'places',

          'circle-radius',

          isPhone()
            ? 8.5
            : 6.5
        );
      }
    }
  );

  /*
   * ------------------------------------------------------------
   * INITIAL UI
   * ------------------------------------------------------------
   */

  updateStats();

  updateProgress();

  renderReview();

  renderStudyLists();

})();
