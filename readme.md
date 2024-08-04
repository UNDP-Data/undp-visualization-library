# Getting Started

UNDP visualization library is dedicated to providing a good development experience for data visualization specialists. Before starting, it is recommended to learn React first, and correctly install and configure Node.js v16 or above. 

We also assumes that you have intermediate knowledge about HTML, CSS, and JavaScript/TypeScript, and React. Starting out is straightforward.

Detailed documentation can be found [here](https://orange-bay-04736e710.4.azurestaticapps.net/).

### Installation
__Using npm__
```
npm i @undp-data/undp-visualization-library
```


__Using yarn__
```
yarn add @undp-data/undp-visualization-library
```

### Import
It is recommended to import what you need and the use it. For example, import the `HorizontalBarGraph` like this:
```
import { HorizontalBarGraph } from '@undp-data/undp-visualization-library'
```


It is also recommended to import the css because some setting expect the CSS to be imported to look good. You can import the css file like this: 
```
import '@undp-data/undp-visualization-library/dist/style.css';
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
    * lodash.isequal
    * lodash.max
    * lodash.maxby
    * lodash.min
    * lodash.minby
    * lodash.orderby
    * lodash.sortby
    * lodash.sum
    * lodash.uniq
    * lodash.uniqby
* maplibre-gl - For Maplibre maps
* pmtiles - For adding pmtiles to Maplibre maps
* papaparse - For loading and parsing csv from links
* react-draggable - For creating comparison maps
* simple-statistics - For statistical functions
* date-fns - For date formatting
* dom-to-image - For downloading div as images
* dom-to-svg - For downloading div as svg
* file-saver - For downloading files
* react-csv - For generating a csv file
* react-select - For dropdown select 
* xlsx - For generating a xlsx file
* React (of course!)