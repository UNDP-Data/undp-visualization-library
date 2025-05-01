# UNDP data viz library ![npm](https://img.shields.io/npm/v/@undp/data-viz)

## Getting Started

UNDP data viz library is dedicated to providing a good development experience for data visualization specialists. Before starting, it is recommended to learn React first, and correctly install and configure Node.js v18 or above. 

We also assumes that you have intermediate knowledge about HTML, CSS, and JavaScript/TypeScript, and React. Starting out is straightforward.

__Note: The library uses react v19__

Detailed documentation can be found [here](https://dataviz.design.undp.org).

NPM Package can be found [here](https://www.npmjs.com/package/@undp/data-viz)

### Installation
__Using npm__
```
npm i @undp/data-viz
```


__Using yarn__
```
yarn add @undp/data-viz
```

### Import
It is recommended to import what you need and the use it. For example, import the `HorizontalBarGraph` like this:
```
import { HorizontalBarGraph } from '@undp/data-viz'
```


It is also recommended to import the css because some setting expect the CSS to be imported to look good. You can import the css file like this: 
```
import '@undp/data-viz/dist/style.css';
```

### TypeScript
UNDP visualization library provides a built-in ts definition, you don't need to install any type definitions.

### Dependencies
The dependencies that are pre-installed wit the library:
* Various D3 libraries - For visualizations
    * d3-array
    * d3-delaunay
    * d3-force
    * d3-format
    * d3-geo
    * d3-hierarchy
    * d3-scale
    * d3-selection
    * d3-shape
    * d3-zoom
* Various Lodash libraries - For array and data manipulation
    * lodash.flattendeep
    * lodash.intersection
    * lodash.max
    * lodash.maxby
    * lodash.min
    * lodash.minby
    * lodash.orderby
    * lodash.sortby
    * lodash.sum
    * lodash.uniq
    * lodash.uniqby
* @undp/design-system-react - For UI elements
* maplibre-gl - For Maplibre maps (Peer dependency)
* pmtiles - For adding pmtiles to Maplibre maps
* papaparse - For loading and parsing csv from links
* motion - For creating animations in the animated graphs
* dnd-kit - For creating comparison maps
* simple-statistics - For statistical functions
* xss - For cleaning up cross scripting from user-submitted HTML
* ajv - For schema validation
* date-fns - For date formatting
* html-to-image - For downloading div as images
* dom-to-svg - For downloading div as svg
* file-saver - For downloading files
* react-csv - For generating a csv file
* xlsx - For generating a xlsx file (Peer dependency)
* React (of course!) (Peer dependency)