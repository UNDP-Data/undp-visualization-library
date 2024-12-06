import { useEffect, useMemo, useState } from 'react';
import Select, { createFilter } from 'react-select';
import flattenDeep from 'lodash.flattendeep';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { UNDPColorModule } from '../../../ColorPalette';
import { MapEl } from './MapEl';
import { BackgroundStyleDataType, SourcesDataType } from '../../../../Types';
import { getReactSelectTheme } from '../../../../Utils/getReactSelectTheme';

interface Props {
  mapStyle: string;
  center?: [number, number];
  zoomLevel?: number;
  graphTitle?: string;
  sources?: SourcesDataType[];
  graphDescription?: string;
  footNote?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  width?: number;
  height?: number;
  relativeHeight?: number;
  graphID?: string;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
  layerSelection: { layerID: string[]; name: string }[];
  excludeLayers?: string[];
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
}

export function GeoHubMapWithLayerSelection(props: Props) {
  const {
    mapStyle,
    graphTitle,
    height,
    width,
    relativeHeight,
    sources,
    graphDescription,
    footNote,
    padding,
    backgroundColor = false,
    center,
    zoomLevel,
    graphID,
    rtl = false,
    language = 'en',
    minHeight = 0,
    mode = 'light',
    layerSelection,
    excludeLayers = [],
    ariaLabel,
    backgroundStyle = {},
  } = props;

  const [selectedLayer, setSelectedLayer] = useState(layerSelection[0].layerID);

  useEffect(() => {
    setSelectedLayer(layerSelection[0].layerID);
  }, [layerSelection]);

  const filterConfig = useMemo(
    () => ({
      ignoreCase: true,
      ignoreAccents: true,
      trim: true,
    }),
    [],
  );
  return (
    <div
      style={{
        ...backgroundStyle,
        display: 'flex',
        flexDirection: 'column',
        height: 'inherit',
        width: width ? 'fit-content' : '100%',
        flexGrow: width ? 0 : 1,
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule[mode].grays['gray-200']
          : backgroundColor,
      }}
      id={graphID}
      aria-label={
        ariaLabel ||
        `${graphTitle ? `The graph shows ${graphTitle}. ` : ''}This is a map.${
          graphDescription ? ` ${graphDescription}` : ''
        }`
      }
    >
      <div
        style={{
          padding: backgroundColor ? padding || '1rem' : padding || 0,
          flexGrow: 1,
          display: 'flex',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: '1rem',
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
        >
          {graphTitle || graphDescription ? (
            <GraphHeader
              rtl={rtl}
              language={language}
              graphTitle={graphTitle}
              graphDescription={graphDescription}
              width={width}
              mode={mode}
            />
          ) : null}
          <Select
            className={
              rtl
                ? `undp-viz-select-${language} undp-viz-select`
                : 'undp-viz-select'
            }
            options={layerSelection.map(d => ({
              label: d.name,
              value: d.layerID,
            }))}
            isClearable={false}
            isRtl={rtl}
            isSearchable
            filterOption={createFilter(filterConfig)}
            defaultValue={{
              label: layerSelection[0].name,
              value: layerSelection[0].layerID,
            }}
            controlShouldRenderValue
            onChange={el => {
              if (el) setSelectedLayer(el.value);
            }}
            theme={theme => getReactSelectTheme(theme, mode)}
          />
          <MapEl
            mapStyle={mapStyle}
            center={center}
            zoomLevel={zoomLevel}
            width={width}
            height={height}
            relativeHeight={relativeHeight}
            minHeight={minHeight}
            selectedLayer={selectedLayer}
            layerIdList={flattenDeep(layerSelection.map(d => d.layerID))}
            excludeLayers={excludeLayers}
          />
          {sources || footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              sources={sources}
              footNote={footNote}
              width={width}
              mode={mode}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
