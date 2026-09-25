/*
 * ============================================================
 * CONTRA COSTA GEOGRAPHY TRAINER
 * data.js
 * V12.2
 *
 * All quiz/study locations are stored in window.LOCATIONS.
 *
 * Every location uses the same structure:
 *
 * {
 *   name: "Location Name",
 *   lat: 37.000,
 *   lon: -122.000,
 *   group: "category"
 * }
 *
 * There is no separate ROUTES system in V12.2.
 * ============================================================
 */


/*
 * ------------------------------------------------------------
 * INCORPORATED CITY NAMES
 *
 * Used for Census city boundary polygons.
 * ------------------------------------------------------------
 */

window.CITY_NAMES = [
  "Richmond",
  "San Pablo",
  "El Cerrito",
  "Pinole",
  "Hercules",
  "Martinez",
  "Pleasant Hill",
  "Concord",
  "Clayton",
  "Walnut Creek",
  "Lafayette",
  "Orinda",
  "Moraga",
  "Danville",
  "San Ramon",
  "Pittsburg",
  "Antioch",
  "Oakley",
  "Brentwood"
];


/*
 * ============================================================
 * ALL QUIZ / STUDY LOCATIONS
 * ============================================================
 */

window.LOCATIONS = [

  /*
   * ----------------------------------------------------------
   * INCORPORATED CITIES
   * group: city
   * ----------------------------------------------------------
   */

  {
    name: "Richmond Soutwest",
    lat: 37.936,
    lon: -122.347,
    group: "city"
  },

  {
    name: "Richmond Northwest",
    lat: 37.99083669031433,
    lon: -122.34501271968908,
    group: "city"
  },

  {
    name: "Richmond Southeast",
    lat: 37.95253663290174,
    lon: -122.2983843023872,
    group: "city"
  },

  {
    name: "Richmond Northeast",
    lat: 37.97055971395262,
    lon: -122.27879433255319,
    group: "city"
  },

  {
    name: "San Pablo",
    lat: 37.962,
    lon: -122.345,
    group: "city"
  },

  {
    name: "El Cerrito",
    lat: 37.916,
    lon: -122.306,
    group: "city"
  },

  {
    name: "Pinole",
    lat: 38.004,
    lon: -122.298,
    group: "city"
  },

  {
    name: "Hercules",
    lat: 38.018,
    lon: -122.288,
    group: "city"
  },

  {
    name: "Martinez",
    lat: 38.019,
    lon: -122.134,
    group: "city"
  },

  {
    name: "Pleasant Hill",
    lat: 37.95172079520568, 
    lon: -122.07611427903475,
    group: "city"
  },

  {
    name: "Concord",
    lat: 37.978,
    lon: -122.031,
    group: "city"
  },

  {
    name: "Clayton",
    lat: 37.942,
    lon: -121.935,
    group: "city"
  },

  {
    name: "Walnut Creek",
    lat: 37.910,
    lon: -122.065,
    group: "city"
  },

  {
    name: "Lafayette",
    lat: 37.886,
    lon: -122.118,
    group: "city"
  },

  {
    name: "Orinda",
    lat: 37.877,
    lon: -122.180,
    group: "city"
  },

  {
    name: "Moraga",
    lat: 37.835,
    lon: -122.129,
    group: "city"
  },

  {
    name: "Danville",
    lat: 37.821,
    lon: -121.999,
    group: "city"
  },

  {
    name: "San Ramon",
    lat: 37.7648,
    lon: -121.9544,
    group: "city"
  },

  {
    name: "Pittsburg",
    lat: 38.028,
    lon: -121.885,
    group: "city"
  },

  {
    name: "Antioch",
    lat: 38.005,
    lon: -121.806,
    group: "city"
  },

  {
    name: "Oakley",
    lat: 37.997,
    lon: -121.712,
    group: "city"
  },

  {
    name: "Brentwood",
    lat: 37.932,
    lon: -121.696,
    group: "city"
  },


  /*
   * ----------------------------------------------------------
   * TESTED UNINCORPORATED LOCATIONS
   * group: tested
   * ----------------------------------------------------------
   */

  {
    name: "Alamo",
    lat: 37.850,
    lon: -122.032,
    group: "tested"
  },

  {
    name: "Bay Point",
    lat: 38.030,
    lon: -121.961,
    group: "tested"
  },

  {
    name: "Bay View",
    lat: 38.006,
    lon: -122.319,
    group: "tested"
  },

  {
    name: "Bayo Vista",
    lat: 38.03687,
    lon: -122.26136,
    group: "tested"
  },

  {
    name: "Bethel Island",
    lat: 38.025,
    lon: -121.640,
    group: "tested"
  },

  {
    name: "Blackhawk",
    lat: 37.821,
    lon: -121.907,
    group: "tested"
  },

  {
    name: "Byron",
    lat: 37.867,
    lon: -121.638,
    group: "tested"
  },

  {
    name: "Canyon",
    lat: 37.830,
    lon: -122.166,
    group: "tested"
  },

  {
    name: "Clyde",
    lat: 38.025,
    lon: -122.025,
    group: "tested"
  },

  {
    name: "Crockett",
    lat: 38.052,
    lon: -122.214,
    group: "tested"
  },

  {
    name: "Diablo",
    lat: 37.835,
    lon: -121.958,
    group: "tested"
  },

  {
    name: "Discovery Bay",
    lat: 37.909,
    lon: -121.600,
    group: "tested"
  },

  {
    name: "East Richmond Heights",
    lat: 37.943,
    lon: -122.314,
    group: "tested"
  },

  {
    name: "El Sobrante",
    lat: 37.977,
    lon: -122.295,
    group: "tested"
  },

  {
    name: "Kensington",
    lat: 37.910,
    lon: -122.280,
    group: "tested"
  },

  {
    name: "Knightsen",
    lat: 37.969,
    lon: -121.668,
    group: "tested"
  },

  {
    name: "Montalvin Manor",
    lat: 37.995,
    lon: -122.332,
    group: "tested"
  },

  {
    name: "North Richmond",
    lat: 37.958,
    lon: -122.367,
    group: "tested"
  },

  {
    name: "Pacheco",
    lat: 37.984,
    lon: -122.075,
    group: "tested"
  },

  {
    name: "Port Costa",
    lat: 38.046,
    lon: -122.185,
    group: "tested"
  },

  {
    name: "Rodeo",
    lat: 38.033,
    lon: -122.267,
    group: "tested"
  },

  {
    name: "Rollingwood",
    lat: 37.965,
    lon: -122.330,
    group: "tested"
  },

  {
    name: "Roundhill",
    lat: 37.858,
    lon: -122.002,
    group: "tested"
  },

  {
    name: "Tara Hills",
    lat: 37.994,
    lon: -122.316,
    group: "tested"
  },

  {
    name: "Tassajara",
    lat: 37.79576,
    lon: -121.86357,
    group: "tested"
  },


  /*
   * ----------------------------------------------------------
   * ADDITIONAL UNINCORPORATED LOCATIONS
   * group: supplemental
   * ----------------------------------------------------------
   */

  {
    name: "Acalanes Ridge",
    lat: 37.904,
    lon: -122.079,
    group: "supplemental"
  },

  {
    name: "Alhambra Valley",
    lat: 37.984,
    lon: -122.161,
    group: "supplemental"
  },

  {
    name: "Ayers Ranch",
    lat: 37.91,
    lon: -121.86,
    group: "supplemental"
  },

  {
    name: "Briones",
    lat: 37.937,
    lon: -122.160,
    group: "supplemental"
  },

  {
    name: "Browns Island",
    lat: 38.040,
    lon: -121.873,
    group: "supplemental"
  },

  {
    name: "Camino Tassajara",
    lat: 37.79696,
    lon: -121.88650,
    group: "supplemental"
  },

  {
    name: "Castle Hill",
    lat: 37.889,
    lon: -122.023,
    group: "supplemental"
  },

  {
    name: "Contra Costa Centre",
    lat: 37.927,
    lon: -122.057,
    group: "supplemental"
  },

  {
    name: "Contra Costa Fair & Event Park",
    lat: 38.004,
    lon: -121.817,
    group: "supplemental"
  },

  {
    name: "Delta Coves",
    lat: 38.0175,
    lon: -121.6260,
    group: "supplemental"
  },


  {
    name: "Los Medanos College",
    lat: 38.006006015755005, -121.86095793291612,
    lon: -121.86095793291612,
    group: "supplemental"
   },

  {
    name: "Marsh Creek Springs",
    lat: 37.8927022,
    lon: -121.8538455,
    group: "supplemental"
  },

  {
    name: "Mountain View",
    lat: 38.009,
    lon: -122.116,
    group: "supplemental"
  },

  {
    name: "Norris Canyon",
    lat: 37.74794730048643,
    lon: -121.98887758540535,
    group: "supplemental"
  },

  {
    name: "North Gate",
    lat: 37.902,
    lon: -121.996,
    group: "supplemental"
  },

  {
    name: "Orwood",
    lat: 37.929,
    lon: -121.573,
    group: "supplemental"
  },

  {
    name: "Reliez Valley",
    lat: 37.943,
    lon: -122.107,
    group: "supplemental"
  },

  {
    name: "Rossmoor",
    lat: 37.8585,
    lon: -122.0714,
    group: "supplemental"
  },

  {
    name: "San Miguel",
    lat: 37.925,
    lon: -122.040,
    group: "supplemental"
  },

  {
    name: "Saranap / Parkmead",
    lat: 37.884,
    lon: -122.077,
    group: "supplemental"
  },

  {
    name: "Shell Ridge",
    lat: 37.892,
    lon: -122.012,
    group: "supplemental"
  },

  {
    name: "Bixler",
    lat: 37.947,
    lon: -121.622,
    group: "supplemental"
  },

  {
    name: "Tormey",
    lat: 38.055,
    lon: -122.248,
    group: "supplemental"
  },

  {
    name: "Valona",
    lat: 38.049,
    lon: -122.236,
    group: "supplemental"
  },

  {
    name: "Vine Hill",
    lat: 38.006,
    lon: -122.096,
    group: "supplemental"
  },

  {
    name: "Werner",
    lat: 37.931,
    lon: -121.625,
    group: "supplemental"
  },


  /*
   * ----------------------------------------------------------
   * SURROUNDING LOCATIONS
   * group: surrounding
   * ----------------------------------------------------------
   */

  {
    name: "Albany",
    lat: 37.887,
    lon: -122.298,
    group: "surrounding"
  },

  {
    name: "Berkeley",
    lat: 37.872,
    lon: -122.273,
    group: "surrounding"
  },

  {
    name: "Oakland",
    lat: 37.804,
    lon: -122.271,
    group: "surrounding"
  },

  {
    name: "Oakland Hills",
    lat: 37.81,
    lon: -122.18,
    group: "surrounding"
  },

  {
    name: "Piedmont",
    lat: 37.824,
    lon: -122.231,
    group: "surrounding"
  },

  {
    name: "San Leandro",
    lat: 37.725,
    lon: -122.156,
    group: "surrounding"
  },

  {
    name: "Castro Valley",
    lat: 37.694,
    lon: -122.086,
    group: "surrounding"
  },

  {
    name: "Fairview",
    lat: 37.678,
    lon: -122.045,
    group: "surrounding"
  },

  {
    name: "Pleasanton",
    lat: 37.662,
    lon: -121.875,
    group: "surrounding"
  },

  {
    name: "Livermore",
    lat: 37.682,
    lon: -121.768,
    group: "surrounding"
  },

  {
    name: "Dublin",
    lat: 37.702,
    lon: -121.936,
    group: "surrounding"
  },

  {
    name: "Mountain House",
    lat: 37.783,
    lon: -121.542,
    group: "surrounding"
  },

  {
    name: "West Island",
    lat: 38.035,
    lon: -121.891,
    group: "surrounding"
  },

  {
    name: "Sherman Island",
    lat: 38.059,
    lon: -121.720,
    group: "surrounding"
  },

  {
    name: "Rio Vista",
    lat: 38.155,
    lon: -121.692,
    group: "surrounding"
  },

  {
    name: "El Sobrante Hills",
    lat: 37.965,
    lon: -122.300,
    group: "surrounding"
  },

  {
    name: "Castro Heights",
    lat: 37.949,
    lon: -122.315,
    group: "surrounding"
  },

  {
    name: "Carriage Hills South",
    lat: 37.957,
    lon: -122.286,
    group: "surrounding"
  },

  {
    name: "Carriage Hills North",
    lat: 37.968,
    lon: -122.285,
    group: "surrounding"
  },

  {
    name: "Richmond Annex",
    lat: 37.914,
    lon: -122.319,
    group: "surrounding"
  },

  {
    name: "San Quentin",
    lat: 37.939,
    lon: -122.486,
    group: "surrounding"
  },

  {
    name: "San Rafael",
    lat: 37.974,
    lon: -122.531,
    group: "surrounding"
  },

  {
    name: "Vallejo",
    lat: 38.104,
    lon: -122.256,
    group: "surrounding"
  },

  {
    name: "Vacaville",
    lat: 38.357,
    lon: -121.987,
    group: "surrounding"
  },

  {
    name: "Fairfield",
    lat: 38.249,
    lon: -122.040,
    group: "surrounding"
  },


  /*
   * ----------------------------------------------------------
   * COUNTIES
   * group: county
   * ----------------------------------------------------------
   */

  {
    name: "Contra Costa County",
    lat: 37.93,
    lon: -121.95,
    group: "county"
  },

  {
    name: "Solano County",
    lat: 38.27,
    lon: -121.94,
    group: "county"
  },

  {
    name: "San Joaquin County",
    lat: 37.93,
    lon: -121.29,
    group: "county"
  },

  {
    name: "Alameda County",
    lat: 37.65,
    lon: -121.90,
    group: "county"
  },

  {
    name: "Marin County",
    lat: 38.05,
    lon: -122.74,
    group: "county"
  },

  {
    name: "Sacramento County",
    lat: 38.45,
    lon: -121.35,
    group: "county"
  },


  /*
   * ----------------------------------------------------------
   * MAJOR HIGHWAYS
   * group: highway
   *
   * V12.2:
   * These are now normal point locations just like cities,
   * communities, roads, bridges, etc.
   * ----------------------------------------------------------
   */

  {
    name: "I-80",
    lat: 37.994,
    lon: -122.304,
    group: "highway"
  },

  {
    name: "I-580",
    lat: 37.92152603127899,
    lon: -122.33945308572017,
    group: "highway"
  },

  {
    name: "I-680",
    lat: 38.01612566749626, 
    lon: -122.09349440625844,
    group: "highway"
  },

  {
    name: "SR-4",
    lat: 38.02144295482448, 
    lon: -121.95760645078933,
    group: "highway"
  },

  {
    name: "SR-24",
    lat: 37.892,
    lon: -122.122,
    group: "highway"
  },

  {
    name: "SR-160",
    lat: 38.018,
    lon: -121.752,
    group: "highway"
  },

  {
    name: "SR-242",
    lat: 37.976,
    lon: -122.044,
    group: "highway"
  },


  /*
   * ----------------------------------------------------------
   * MAJOR ROADWAYS
   * group: road
   *
   * All coordinates below are preserved exactly from your
   * current data.js.
   * ----------------------------------------------------------
   */

  {
    name: "Alhambra Valley Road",
    lat: 37.9699808562013,
    lon: -122.16076400481131,
    group: "road"
  },

  {
    name: "Appian Way",
    lat: 37.98575450357184,
    lon: -122.29817838620949,
    group: "road"
  },

  {
    name: "Bailey Road",
    lat: 37.99532165517284,
    lon: -121.94820156016279,
    group: "road"
  },

  {
    name: "Balfour Road",
    lat: 37.92533454809087,
    lon: -121.70894576201202,
    group: "road"
  },

  {
    name: "Bethel Island Road",
    lat: 38.012396426182534,
    lon: -121.64098033147394,
    group: "road"
  },

  {
    name: "Bollinger Canyon Road",
    lat: 37.78685482907895,
    lon: -122.00633805752818,
    group: "road"
  },

  {
    name: "Byron Highway",
    lat: 37.856784219824846,
    lon: -121.62881783232594,
    group: "road"
  },

  {
    name: "Camino Diablo",
    lat: 37.86789196078416,
    lon: -121.68410719704264,
    group: "road"
  },

  {
    name: "Camino Tassajara",
    lat: 37.767129859845795,
    lon: -121.86541545808139,
    group: "road"
  },

  {
    name: "Castro Ranch Road",
    lat: 37.96288022468995,
    lon: -122.25768441184418,
    group: "road"
  },

  {
    name: "Clayton Road",
    lat: 37.962,
    lon: -121.986,
    group: "road"
  },

  {
    name: "Concord Avenue",
    lat: 37.98075616528948,
    lon: -122.05315687923546,
    group: "road"
  },

  {
    name: "Crockett Boulevard",
    lat: 38.04484534856574,
    lon: -122.21899451991987,
    group: "road"
  },

  {
    name: "Crow Canyon Road",
    lat: 37.76854469859689,
    lon: -122.00689585793438,
    group: "road"
  },

  {
    name: "Cypress Road",
    lat: 37.997,
    lon: -121.699,
    group: "road"
  },

  {
    name: "Danville Boulevard",
    lat: 37.845,
    lon: -122.027,
    group: "road"
  },

  {
    name: "Deer Valley Road",
    lat: 37.948,
    lon: -121.793,
    group: "road"
  },

  {
    name: "Discovery Bay Boulevard",
    lat: 37.904,
    lon: -121.603,
    group: "road"
  },

  {
    name: "Dougherty Road",
    lat: 37.754,
    lon: -121.914,
    group: "road"
  },

  {
    name: "East 14th Street",
    lat: 38.018,
    lon: -121.889,
    group: "road"
  },

  {
    name: "East 18th Street",
    lat: 38.004,
    lon: -121.789,
    group: "road"
  },

  {
    name: "Franklin Canyon Road",
    lat: 38.02,
    lon: -122.198,
    group: "road"
  },

  {
    name: "Kirker Pass Road",
    lat: 37.983,
    lon: -121.934,
    group: "road"
  },

  {
    name: "Knightsen Avenue",
    lat: 37.968,
    lon: -121.669,
    group: "road"
  },

  {
    name: "Main Street",
    lat: 37.997,
    lon: -121.712,
    group: "road"
  },

  {
    name: "Marsh Creek Road",
    lat: 37.905,
    lon: -121.837,
    group: "road"
  },

  {
    name: "Norris Canyon Road",
    lat: 37.76038556554233,
    lon: -121.99404046700944,
    group: "road"
  },

  {
    name: "Pacheco Boulevard",
    lat: 37.993,
    lon: -122.071,
    group: "road"
  },

  {
    name: "Parker Avenue",
    lat: 38.032,
    lon: -122.251,
    group: "road"
  },

  {
    name: "Port Chicago Highway",
    lat: 38.015,
    lon: -122.03,
    group: "road"
  },

  {
    name: "Railroad Avenue",
    lat: 38.021,
    lon: -121.884,
    group: "road"
  },

  {
    name: "Reliez Valley Road",
    lat: 37.935,
    lon: -122.108,
    group: "road"
  },

  {
    name: "Richmond Parkway",
    lat: 37.981,
    lon: -122.357,
    group: "road"
  },

  {
    name: "San Pablo Avenue",
    lat: 37.973,
    lon: -122.348,
    group: "road"
  },

  {
    name: "San Pablo Dam Road",
    lat: 37.963,
    lon: -122.318,
    group: "road"
  },

  {
    name: "San Ramon Valley Boulevard",
    lat: 37.795,
    lon: -121.997,
    group: "road"
  },

  {
    name: "Sellers Avenue",
    lat: 37.939,
    lon: -121.682,
    group: "road"
  },

  {
    name: "Treat Boulevard",
    lat: 37.939,
    lon: -122.026,
    group: "road"
  },

  {
    name: "Vasco Road",
    lat: 37.888,
    lon: -121.722,
    group: "road"
  },

  {
    name: "West 10th Street",
    lat: 38.028,
    lon: -121.902,
    group: "road"
  },

  {
    name: "Willow Pass Road",
    lat: 38.028,
    lon: -121.961,
    group: "road"
  },

  {
    name: "Ygnacio Valley Road",
    lat: 37.93,
    lon: -122.025,
    group: "road"
  },


  /*
   * ----------------------------------------------------------
   * BRIDGES
   * group: bridge
   * ----------------------------------------------------------
   */

  {
    name: "Antioch Bridge",
    lat: 38.02726406081978,
    lon: -121.75159315783625,
    group: "bridge"
  },

  {
    name: "Benicia-Martinez Bridge",
    lat: 38.038,
    lon: -122.119,
    group: "bridge"
  },

  {
    name: "Carquinez Bridge",
    lat: 38.060,
    lon: -122.226,
    group: "bridge"
  },

  {
    name: "Richmond-San Rafael Bridge",
    lat: 37.935,
    lon: -122.420,
    group: "bridge"
  },


  /*
   * ----------------------------------------------------------
   * BODIES OF WATER
   * group: water
   * ----------------------------------------------------------
   */

  {
    name: "San Francisco Bay",
    lat: 37.80,
    lon: -122.36,
    group: "water"
  },

  {
    name: "San Pablo Bay",
    lat: 38.03,
    lon: -122.39,
    group: "water"
  },

  {
    name: "Carquinez Strait",
    lat: 38.055,
    lon: -122.17,
    group: "water"
  },

  {
    name: "Suisun Bay",
    lat: 38.07,
    lon: -121.99,
    group: "water"
  },

  {
    name: "Honker Bay",
    lat: 38.09,
    lon: -121.94,
    group: "water"
  },

  {
    name: "Sacramento River",
    lat: 38.10,
    lon: -121.72,
    group: "water"
  },

  {
    name: "San Joaquin River",
    lat: 38.04,
    lon: -121.83,
    group: "water"
  },

  {
    name: "Big Break",
    lat: 38.02,
    lon: -121.72,
    group: "water"
  },

  {
    name: "Clifton Court Forebay",
    lat: 37.83,
    lon: -121.56,
    group: "water"
  },

  {
    name: "San Pablo Reservoir",
    lat: 37.94,
    lon: -122.25,
    group: "water"
  },

  {
    name: "Briones Reservoir",
    lat: 37.91,
    lon: -122.21,
    group: "water"
  },

  {
    name: "Los Vaqueros Reservoir",
    lat: 37.82,
    lon: -121.74,
    group: "water"
  }

];
