import { useEffect, useState } from 'react';
import Select, { createFilter } from 'react-select';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { UNDPColorModule } from '../../../ColorPalette';
import { GeoHubMultipleMap } from './GeoHubMultipleMap';
import { GeoHubSingleMap } from './GeoHubSingleMap';
import { BackgroundStyleDataType, SourcesDataType } from '../../../../Types';
import { getReactSelectTheme } from '../../../../Utils/getReactSelectTheme';

interface Props {
  mapStyle: string | { style: string; name: string }[];
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
  includeLayers?: string[];
  excludeLayers?: string[];
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
}

export function GeoHubMap(props: Props) {
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
    backgroundColor,
    center,
    zoomLevel,
    graphID,
    rtl,
    language,
    minHeight,
    mode,
    includeLayers,
    excludeLayers,
    ariaLabel,
    backgroundStyle,
  } = props;

  const [selectedMapStyle, setSelectedMapStyle] = useState(
    typeof mapStyle === 'string' ? mapStyle : mapStyle[0].style,
  );

  useEffect(() => {
    setSelectedMapStyle(
      typeof mapStyle === 'string' ? mapStyle : mapStyle[0].style,
    );
  }, [mapStyle]);
  const filterConfig = {
    ignoreCase: true,
    ignoreAccents: true,
    trim: true,
  };
  return (
    <div
      style={{
        ...(backgroundStyle || {}),
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
          ? UNDPColorModule[mode || 'light'].grays['gray-200']
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
              mode={mode || 'light'}
            />
          ) : null}
          {typeof mapStyle === 'string' ? null : (
            <Select
              className={
                rtl
                  ? `undp-viz-select-${language || 'ar'} undp-viz-select`
                  : 'undp-viz-select'
              }
              options={mapStyle.map(d => ({ label: d.name, value: d.style }))}
              isClearable={false}
              isRtl={rtl}
              isSearchable
              filterOption={createFilter(filterConfig)}
              defaultValue={{
                label: mapStyle[0].name,
                value: mapStyle[0].style,
              }}
              controlShouldRenderValue
              onChange={el => {
                if (el) setSelectedMapStyle(el.value);
              }}
              theme={theme => getReactSelectTheme(theme, mode)}
            />
          )}
          {typeof mapStyle === 'string' ? (
            <GeoHubSingleMap
              mapStyle={mapStyle}
              center={center}
              zoomLevel={zoomLevel}
              width={width}
              height={height}
              relativeHeight={relativeHeight}
              minHeight={minHeight}
              includeLayers={includeLayers}
              excludeLayers={excludeLayers}
            />
          ) : (
            <GeoHubMultipleMap
              mapStyle={selectedMapStyle}
              center={center}
              zoomLevel={zoomLevel}
              width={width}
              height={height}
              relativeHeight={relativeHeight}
              minHeight={minHeight}
              includeLayers={includeLayers}
              excludeLayers={excludeLayers}
            />
          )}
          {sources || footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              sources={sources}
              footNote={footNote}
              width={width}
              mode={mode || 'light'}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
