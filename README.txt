Contra Costa County Geography Trainer V10

Run locally:
1. Extract this ZIP.
2. Open Command Prompt in this folder.
3. Run: py -m http.server 8000
4. Open http://localhost:8000
5. Stop with Ctrl+C.

V10 changes:
- Kensington moved to Tested Unincorporated (25 tested unincorporated; 44 required locations with all 19 incorporated cities).
- Added Rossmoor, Marsh Creek Springs, Delta Coves, Browns Island, Valona, Tormey, Bixler, Werner, and Orwood to Additional Unincorporated.
- Added Surrounding Locations category (24 locations) and Counties category (5 counties).
- Category checkboxes control BOTH map visibility and quiz pool.
- Added optional Census regional county boundary layer.
- Quiz mode suppresses basemap/trainer text labels; correct answers turn gold.

Naming notes:
- “Bexler” was normalized to “Bixler,” matching Contra Costa County map labeling (“Bixler Tract”).
- “San Quinten” was normalized to “San Quentin.”

Data notes:
- Incorporated city and county polygons are loaded online from U.S. Census TIGERweb.
- Basemap is loaded online through OpenFreeMap/MapLibre.
- Point markers are study reference points; some small neighborhoods, tracts, islands, and historic localities do not have official polygon boundaries.
