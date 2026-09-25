(() => {
  'use strict';

  const DATA = window.LOCATIONS;
  const CITY_NAMES = window.CITY_NAMES;
  const $ = id => document.getElementById(id);

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
   * V12.1 BUG FIX
   *
   * Highways are now represented by dots instead of MapLibre road lines.
   * These representative points are stored here so data.js does not need
   * to be changed for this bug-fix release.
   */
  const HIGHWAY_POINTS = [
    {
      name: 'I-80',
      lat: 37.994,
      lon: -122.304,
      group: 'highway'
    },
    {
      name: 'I-580',
      lat: 37.931,
      lon: -122.363,
      group: 'highway'
    },
    {
      name: 'I-680',
      lat: 37.963,
      lon: -122.069,
      group: 'highway'
    },
    {
      name: 'SR-4',
      lat: 38.006,
      lon: -121.958,
      group: 'highway'
    },
    {
      name: 'SR-24',
      lat: 37.892,
      lon: -122.122,
      group: 'highway'
    },
    {
      name: 'SR-160',
      lat: 38.018,
      lon: -121.752,
      group: 'highway'
    },
    {
      name: 'SR-242',
      lat: 37.976,
      lon: -122.044,
      group: 'highway'
    }
  ];

  let mode = 'study';
  let target = null;
  let attempts = 0;
  let correct = 0;
  let boundariesLoaded = false;
  let wrongName = null;

  const completed = new Set();
  const review = new Map();

  /*
   * Return all study items for a group.
   *
   * Highways come from HIGHWAY_POINTS.
   * Everything else comes from data.js.
   */
  function items(group) {
    if (group === 'highway') {
      return HIGHWAY_POINTS.map(item => ({
        ...item,
        type: 'point'
      }));
    }

    return DATA
      .filter(item => item.group === group)
      .map(item => ({
        ...item,
        type: 'point'
      }));
  }

  /*
   * Build quiz-pool checkboxes.
   */
  $('poolChecks').innerHTML = GROUPS.map(([group, label], index) => {
    return `
      <label>
        <input
          data-group="${group}"
          type="checkbox"
          ${index < 2 ? 'checked' : ''}
        >
        <span>
          <b>${label}</b>
          <small> — ${items(group).length}</small>
        </span>
      </label>
    `;
  }).join('');

  function checked(group) {
    return !!document.querySelector(
      `input[data-group="${group}"]`
    )?.checked;
  }

  function pool() {
    return GROUPS.flatMap(([group]) => {
      return checked(group) ? items(group) : [];
    });
  }

  /*
   * MAP
   */
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [-121.98, 37.94],
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
   * CENSUS GIS
   */
  const query = (base, where, fields) => {
    return (
      base +
      '/query?where=' +
      encodeURIComponent(where) +
      '&outFields=' +
      encodeURIComponent(fields) +
      '&returnGeometry=true&outSR=4326&f=geojson'
    );
  };

  const cityWhere =
    "STATE='06' AND BASENAME IN (" +
    CITY_NAMES.map(name => "'" + name + "'").join(',') +
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

  function geoBounds(geojson) {
    const xs = [];
    const ys = [];

    const walk = coordinates => {
      if (
        Array.isArray(coordinates) &&
        typeof coordinates[0] === 'number'
      ) {
        xs.push(coordinates[0]);
        ys.push(coordinates[1]);
      } else if (Array.isArray(coordinates)) {
        coordinates.forEach(walk);
      }
    };

    geojson.features.forEach(feature => {
      walk(feature.geometry.coordinates);
    });

    if (!xs.length) {
      return null;
    }

    return [
      [Math.min(...xs), Math.min(...ys)],
      [Math.max(...xs), Math.max(...ys)]
    ];
  }

  async function loadGIS() {
    try {
      const responses = await Promise.all([
        fetch(cityURL),
        fetch(countyURL),
        fetch(regionalURL)
      ]);

      const data = await Promise.all(
        responses.map(response => response.json())
      );

      /*
       * City polygons
       */
      map.addSource('cities', {
        type: 'geojson',
        data: data[0]
      });

      map.addLayer({
        id: 'city-fill',
        type: 'fill',
        source: 'cities',
        paint: {
          'fill-color': '#8fb8d8',
          'fill-opacity': 0.30
        }
      });

      map.addLayer({
        id: 'city-outline',
        type: 'line',
        source: 'cities',
        paint: {
          'line-color': '#394b59',
          'line-width': 1.5
        }
      });

      /*
       * Regional county boundaries
       */
      map.addSource('regional-counties', {
        type: 'geojson',
        data: data[2]
      });

      map.addLayer({
        id: 'regional-county-outline',
        type: 'line',
        source: 'regional-counties',
        layout: {
          visibility: 'none'
        },
        paint: {
          'line-color': '#7058a8',
          'line-width': 2
        }
      });

      /*
       * Contra Costa County boundary
       */
      map.addSource('county', {
        type: 'geojson',
        data: data[1]
      });

      map.addLayer({
        id: 'county-outline',
        type: 'line',
        source: 'county',
        paint: {
          'line-color': '#102b42',
          'line-width': 3
        }
      });

      const bounds = geoBounds(data[1]);

      if (bounds) {
        map.fitBounds(bounds, {
          padding: 30,
          duration: 0
        });
      }

      boundariesLoaded = true;

      $('status').textContent =
        '2026 Census city/county boundaries loaded';

    } catch (error) {
      console.error(error);

      $('status').textContent =
        'Census boundary service unavailable; map quiz still works';
    }
  }

  /*
   * POINT DATA
   *
   * V12.1:
   * Cities, unincorporated areas, surrounding locations,
   * counties, highways, bridges, roads, and water locations
   * all use this same point system.
   */
  function pointGeo() {
    return {
      type: 'FeatureCollection',

      features: pool().map(point => ({
        type: 'Feature',

        properties: {
          name: point.name,
          group: point.group,

          status: completed.has(point.name)
            ? 'done'
            : wrongName === point.name
              ? 'wrong'
              : 'open'
        },

        geometry: {
          type: 'Point',
          coordinates: [
            point.lon,
            point.lat
          ]
        }
      }))
    };
  }

  function syncPoints() {
    const source = map.getSource('places');

    if (source) {
      source.setData(pointGeo());
      return;
    }

    map.addSource('places', {
      type: 'geojson',
      data: pointGeo()
    });

    map.addLayer({
      id: 'places',
      type: 'circle',
      source: 'places',

      paint: {
        'circle-radius': 6.5,

        'circle-color': [
          'match',
          ['get', 'status'],

          /*
           * Completed / wrong states override
           * the normal category color.
           */
          'done',
          '#f2b705',

          'wrong',
          '#d73027',

          /*
           * Normal category colors
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

            /*
             * Highway gets its own visible color.
             */
            'highway',
            '#d85b2a',

            'bridge',
            '#15a7a1',

            'water',
            '#2980b9',

            'road',
            '#d6428b',

            '#777'
          ]
        ],

        'circle-stroke-color': '#fff',
        'circle-stroke-width': 1.8
      }
    });
  }

  /*
   * LABELS
   */
  function syncLabels() {
    if (map.getLayer('place-labels')) {
      map.removeLayer('place-labels');
    }

    if (
      mode === 'study' &&
      $('labels').checked &&
      map.getSource('places')
    ) {
      map.addLayer({
        id: 'place-labels',
        type: 'symbol',
        source: 'places',

        layout: {
          'text-field': ['get', 'name'],
          'text-size': 12,
          'text-offset': [0.8, 0],
          'text-anchor': 'left'
        },

        paint: {
          'text-color': '#173150',
          'text-halo-color': 'rgba(255,255,255,.95)',
          'text-halo-width': 1.5
        }
      });
    }
  }

  /*
   * Hide the basemap's own text labels during Quiz Mode.
   */
  function setBasemapLabels(show) {
    const layers = map.getStyle()?.layers || [];

    layers.forEach(layer => {
      if (
        layer.id !== 'place-labels' &&
        layer.type === 'symbol' &&
        layer.layout &&
        ('text-field' in layer.layout)
      ) {
        try {
          map.setLayoutProperty(
            layer.id,
            'visibility',
            show ? 'visible' : 'none'
          );
        } catch (error) {
          // Ignore basemap layers that cannot be changed.
        }
      }
    });
  }

  /*
   * REFRESH MAP / UI
   */
  function refresh() {
    syncPoints();
    syncLabels();

    $('poolCount').textContent = pool().length;

    updateProgress();
    renderStudyLists();
    updateMobileOverlay();
  }

  /*
   * MOBILE UI
   */
  function isPhone() {
    return window.matchMedia(
      '(max-width: 600px)'
    ).matches;
  }

  function updateMobileOverlay(studyItem) {
    const box = $('mobileOverlay');

    if (!box) {
      return;
    }

    /*
     * Desktop remains exactly like the original V12/V11 layout.
     */
    if (!isPhone() || mode === 'list') {
      box.hidden = true;
      return;
    }

    box.hidden = false;

    if (mode === 'quiz') {
      box.className =
        'mobile-overlay quiz-overlay';

      box.innerHTML = `
        <small>QUIZ</small>
        <strong>
          Find: ${target ? target.name : '—'}
        </strong>
        <span>
          ${
            pool().filter(item =>
              completed.has(item.name)
            ).length
          }
          of ${pool().length} completed
        </span>
      `;

      return;
    }

    if (studyItem) {
      const groupLabel =
        GROUPS.find(
          ([group]) =>
            group === studyItem.group
        )?.[1] || studyItem.group;

      box.className =
        'mobile-overlay study-overlay';

      box.innerHTML = `
        <small>STUDY</small>
        <strong>${studyItem.name}</strong>
        <span>${groupLabel}</span>
      `;

      return;
    }

    box.hidden = true;
  }

  /*
   * QUIZ
   */
  function available() {
    return pool().filter(
      item => !completed.has(item.name)
    );
  }

  function newQuestion() {
    const currentPool = pool();
    const remaining = available();

    if (!currentPool.length) {
      target = null;
      $('target').textContent =
        'No items enabled';

      updateMobileOverlay();
      return;
    }

    if (!remaining.length) {
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

    target =
      remaining[
        Math.floor(
          Math.random() *
          remaining.length
        )
      ];

    $('target').textContent =
      target.name;

    $('feedback').textContent = '';

    updateMobileOverlay();
  }

  /*
   * MODE SELECTION
   */
  function setMode(newMode) {
    mode = newMode;

    $('study').classList.toggle(
      'active',
      newMode === 'study'
    );

    $('quiz').classList.toggle(
      'active',
      newMode === 'quiz'
    );

    $('listMode').classList.toggle(
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

    if (newMode !== 'list') {
      map.resize();

      setBasemapLabels(
        newMode === 'study'
      );

      syncLabels();

      if (newMode === 'quiz') {
        newQuestion();
      } else {
        updateMobileOverlay();
      }

    } else {
      updateMobileOverlay();
    }

    renderStudyLists();
  }

  /*
   * REVIEW / STUDY NEXT
   */
  function markReview(question, wrong) {
    if (!review.has(question)) {
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
    if (!review.size) {
      $('review').textContent =
        'No misses yet.';
      return;
    }

    $('review').innerHTML =
      [...review]
        .map(([question, selections]) => {
          return `
            <div>
              <b>${question}</b>
              ${
                selections.size
                  ? ` — selected: ${
                      [...selections].join(', ')
                    }`
                  : ' — skipped / review'
              }
            </div>
          `;
        })
        .join('');
  }

  /*
   * SCORE / PROGRESS
   */
  function updateStats() {
    $('score').textContent =
      correct + ' / ' + attempts;

    $('accuracy').textContent =
      attempts
        ? Math.round(
            correct / attempts * 100
          ) + '%'
        : '—';
  }

  function updateProgress() {
    const numberCompleted =
      pool().filter(
        item =>
          completed.has(item.name)
      ).length;

    $('progress').textContent =
      numberCompleted +
      ' of ' +
      pool().length +
      ' completed';
  }

  /*
   * RESTART
   */
  function restart() {
    completed.clear();

    attempts = 0;
    correct = 0;
    target = null;
    wrongName = null;

    updateStats();
    refresh();

    if (mode === 'quiz') {
      newQuestion();
    }
  }

  /*
   * STUDY LIST
   */
  function renderStudyLists() {
    $('studyLists').innerHTML =
      GROUPS.map(([group, label]) => {

        const names =
          items(group)
            .map(item => item.name)
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
      }).join('');
  }

  /*
   * MAP INITIALIZATION
   */
  map.on('load', async () => {
    await loadGIS();

    /*
     * Every quiz category now uses the same point layer.
     * There is no route-hit / route-open / route-done layer.
     */
    syncPoints();
    syncLabels();
    renderStudyLists();

    map.on(
      'click',
      'places',
      event => {

        const name =
          event.features?.[0]
            ?.properties?.name;

        if (!name) {
          return;
        }

        /*
         * Mobile Study Mode:
         * tapping a dot shows its information
         * in the floating map overlay.
         */
        if (
          mode === 'study' &&
          isPhone()
        ) {
          const item =
            pool().find(
              entry =>
                entry.name === name
            ) ||
            DATA.find(
              entry =>
                entry.name === name
            ) ||
            HIGHWAY_POINTS.find(
              entry =>
                entry.name === name
            );

          if (item) {
            updateMobileOverlay(item);
          }

          return;
        }

        /*
         * Desktop Study Mode ignores quiz scoring.
         * Quiz Mode passes the dot into the normal
         * answer handler.
         */
        handleChoice(name);
      }
    );

    /*
     * Pointer cursor over dots on desktop.
     */
    map.on(
      'mouseenter',
      'places',
      () => {
        map.getCanvas().style.cursor =
          'pointer';
      }
    );

    map.on(
      'mouseleave',
      'places',
      () => {
        map.getCanvas().style.cursor =
          '';
      }
    );
  });

  /*
   * HANDLE QUIZ SELECTION
   */
  function handleChoice(name) {
    if (
      mode !== 'quiz' ||
      !target
    ) {
      return;
    }

    if (completed.has(name)) {
      return;
    }

    attempts++;

    if (name === target.name) {
      correct++;

      completed.add(name);

      wrongName = null;

      $('feedback').innerHTML =
        '<span class="good">' +
        'Correct! ' +
        name +
        ' is complete.' +
        '</span>';

      refresh();
      updateStats();

      setTimeout(
        newQuestion,
        650
      );

    } else {
      markReview(
        target.name,
        name
      );

      wrongName = name;

      $('feedback').innerHTML =
        '<span class="bad">' +
        'That was ' +
        name +
        '. Try again.' +
        '</span>';

      refresh();
      updateStats();

      setTimeout(() => {
        wrongName = null;
        syncPoints();
      }, 500);
    }
  }

  /*
   * BUTTONS
   */
  $('study').onclick =
    () => setMode('study');

  $('quiz').onclick =
    () => setMode('quiz');

  $('listMode').onclick =
    () => setMode('list');

  $('newq').onclick =
    newQuestion;

  $('skip').onclick = () => {
    if (target) {
      markReview(
        target.name,
        null
      );

      newQuestion();
    }
  };

  $('restart').onclick =
    restart;

  $('clearReview').onclick = () => {
    review.clear();
    renderReview();
  };

  /*
   * QUIZ-POOL CHECKBOXES
   */
  document
    .querySelectorAll('[data-group]')
    .forEach(input => {

      input.onchange = () => {
        refresh();

        if (mode === 'quiz') {
          newQuestion();
        }
      };
    });

  /*
   * LABEL CHECKBOX
   */
  $('labels').onchange =
    syncLabels;

  /*
   * MAP BOUNDARY CONTROLS
   */
  $('cityBounds').onchange =
    event => {

      if (!boundariesLoaded) {
        return;
      }

      [
        'city-fill',
        'city-outline'
      ].forEach(id => {

        map.setLayoutProperty(
          id,
          'visibility',
          event.target.checked
            ? 'visible'
            : 'none'
        );
      });
    };

  $('regionalCountyBounds').onchange =
    event => {

      if (!boundariesLoaded) {
        return;
      }

      map.setLayoutProperty(
        'regional-county-outline',
        'visibility',
        event.target.checked
          ? 'visible'
          : 'none'
      );
    };

  $('countyBound').onchange =
    event => {

      if (!boundariesLoaded) {
        return;
      }

      map.setLayoutProperty(
        'county-outline',
        'visibility',
        event.target.checked
          ? 'visible'
          : 'none'
      );
    };

  /*
   * CITY POLYGON OPACITY
   */
  $('opacity').oninput =
    event => {

      if (!boundariesLoaded) {
        return;
      }

      map.setPaintProperty(
        'city-fill',
        'fill-opacity',
        Number(event.target.value) / 100
      );
    };

  /*
   * RESET MAP POSITION
   */
  $('reset').onclick = () => {
    map.flyTo({
      center: [-121.98, 37.94],
      zoom: 9.55
    });
  };

  /*
   * RESPONSIVE MOBILE BEHAVIOR
   *
   * Desktop remains unchanged.
   * Phone-sized browser windows receive
   * larger dot targets and the mobile overlay.
   */
  window.addEventListener(
    'resize',
    () => {

      map.resize();

      updateMobileOverlay();

      if (map.getLayer('places')) {
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
   * INITIAL UI
   */
  renderReview();
  renderStudyLists();

})();
