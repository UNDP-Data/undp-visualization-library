import { useEffect, useState } from 'react';
import Select, { createFilter } from 'react-select';
import flattenDeep from 'lodash.flattendeep';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { UNDPColorModule } from '../../../ColorPalette';
import { MapEl } from './MapEl';

interface Props {
  mapStyle: string;
  center?: [number, number];
  zoomLevel?: number;
  graphTitle?: string;
  source?: string;
  graphDescription?: string;
  sourceLink?: string;
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
}

export function GeoHubMapWithLayerSelection(props: Props) {
  const {
    mapStyle,
    sourceLink,
    graphTitle,
    height,
    width,
    relativeHeight,
    source,
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
    layerSelection,
  } = props;

  const [selectedLayer, setSelectedLayer] = useState(layerSelection[0].layerID);

  useEffect(() => {
    setSelectedLayer(layerSelection[0].layerID);
  }, [layerSelection]);
  const filterConfig = {
    ignoreCase: true,
    ignoreAccents: true,
    trim: true,
  };
  return (
    <div
      style={{
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
              theme={theme => {
                return {
                  ...theme,
                  borderRadius: 0,
                  spacing: {
                    ...theme.spacing,
                    baseUnit: 4,
                    menuGutter: 2,
                    controlHeight: 48,
                  },
                  colors: {
                    ...theme.colors,
                    danger: UNDPColorModule[mode || 'light'].alerts.darkRed,
                    dangerLight:
                      UNDPColorModule[mode || 'light'].grays['gray-400'],
                    neutral10:
                      UNDPColorModule[mode || 'light'].grays['gray-400'],
                    primary50:
                      UNDPColorModule[mode || 'light'].primaryColors[
                        'blue-400'
                      ],
                    primary25:
                      UNDPColorModule[mode || 'light'].grays['gray-200'],
                    primary:
                      UNDPColorModule[mode || 'light'].primaryColors[
                        'blue-600'
                      ],
                  },
                };
              }}
            />
          )}
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
          />
          {source || footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              source={source}
              sourceLink={sourceLink}
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
