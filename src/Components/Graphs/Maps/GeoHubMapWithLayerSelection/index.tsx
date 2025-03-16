import { useEffect, useMemo, useState } from 'react';
import flattenDeep from 'lodash.flattendeep';
import {
  createFilter,
  DropdownSelect,
} from '@undp-data/undp-design-system-react';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { MapEl } from './MapEl';
import {
  BackgroundStyleDataType,
  Languages,
  SourcesDataType,
} from '../../../../Types';

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
  language?: Languages;
  minHeight?: number;
  mode?: 'light' | 'dark';
  layerSelection: { layerID: string[]; name: string }[];
  excludeLayers?: string[];
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  uiMode?: 'light' | 'normal';
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
    language = 'en',
    minHeight = 0,
    mode = 'light',
    layerSelection,
    excludeLayers = [],
    ariaLabel,
    backgroundStyle = {},
    uiMode = 'normal',
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
            <DropdownSelect
              options={layerSelection.map(d => ({
                label: d.name,
                value: d.layerID,
              }))}
              size='sm'
              isClearable={false}
              variant={uiMode}
              isRtl={language === 'he' || language === 'ar'}
              isSearchable
              filterOption={createFilter(filterConfig)}
              defaultValue={{
                label: layerSelection[0].name,
                value: layerSelection[0].layerID,
              }}
              controlShouldRenderValue
              onChange={(el: any) => {
                if (el) setSelectedLayer(el.value);
              }}
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
