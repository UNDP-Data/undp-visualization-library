import { useEffect, useMemo, useState } from 'react';

import {
  DropdownSelect,
  createFilter,
} from '@undp-data/undp-design-system-react';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GeoHubMultipleMap } from './GeoHubMultipleMap';
import { GeoHubSingleMap } from './GeoHubSingleMap';
import {
  BackgroundStyleDataType,
  Languages,
  SourcesDataType,
} from '../../../../Types';

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
  language?: Languages;
  minHeight?: number;
  mode?: 'light' | 'dark';
  includeLayers?: string[];
  excludeLayers?: string[];
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  uiMode?: 'light' | 'normal';
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
    backgroundColor = false,
    center,
    zoomLevel,
    graphID,
    language = 'en',
    minHeight = 0,
    mode = 'light',
    includeLayers = [],
    excludeLayers = [],
    ariaLabel,
    backgroundStyle = {},
    uiMode = 'normal',
  } = props;

  const [selectedMapStyle, setSelectedMapStyle] = useState(
    typeof mapStyle === 'string' ? mapStyle : mapStyle[0].style,
  );

  useEffect(() => {
    setSelectedMapStyle(
      typeof mapStyle === 'string' ? mapStyle : mapStyle[0].style,
    );
  }, [mapStyle]);

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
      className={`${mode || 'light'} flex  ${
        width ? 'w-fit grow-0' : 'w-full grow'
      }`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={`${
          !backgroundColor
            ? 'bg-transparent '
            : backgroundColor === true
            ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
            : ''
        }ml-auto mr-auto flex flex-col grow h-inherit ${language || 'en'}`}
        style={{
          ...backgroundStyle,
          ...(backgroundColor && backgroundColor !== true
            ? { backgroundColor }
            : {}),
        }}
        id={graphID}
        aria-label={
          ariaLabel ||
          `${
            graphTitle ? `The graph shows ${graphTitle}. ` : ''
          }This is a map.${graphDescription ? ` ${graphDescription}` : ''}`
        }
      >
        <div
          className='flex grow'
          style={{
            padding: backgroundColor ? padding || '1rem' : padding || 0,
          }}
        >
          <div className='flex flex-col w-full gap-4 grow justify-between'>
            {graphTitle || graphDescription ? (
              <GraphHeader
                graphTitle={graphTitle}
                graphDescription={graphDescription}
                width={width}
              />
            ) : null}
            {typeof mapStyle === 'string' ? null : (
              <DropdownSelect
                options={mapStyle.map(d => ({ label: d.name, value: d.style }))}
                isClearable={false}
                size='sm'
                variant={uiMode}
                isRtl={language === 'he' || language === 'ar'}
                isSearchable
                filterOption={createFilter(filterConfig)}
                defaultValue={{
                  label: mapStyle[0].name,
                  value: mapStyle[0].style,
                }}
                controlShouldRenderValue
                onChange={(el: any) => {
                  if (el) setSelectedMapStyle(el.value);
                }}
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
                sources={sources}
                footNote={footNote}
                width={width}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
