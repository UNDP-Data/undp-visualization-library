import { ScaleLinear, ScaleBand } from 'd3-scale';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import { motion, AnimatePresence } from 'framer-motion';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { UNDPColorModule } from '../../../../ColorPalette';

interface DataProps {
  date: string | number;
  values: {
    id: string;
    date: string | number;
    label: string | number;
    size?: number | undefined;
    color?: string;
    data?: object;
  }[];
}

interface Props {
  data: DataProps[];
  onSeriesMouseOver?: (_d: any) => void;
  onSeriesMouseClick?: (_d: any) => void;
  y: ScaleLinear<number, number, never>;
  x: ScaleBand<string>;
  highlightedDataPoints: (string | number)[];
  barColor: string[];
  selectedColor?: string;
  colorDomain: string[];
  showLabels: boolean;
  truncateBy: number;
  showValues: boolean;
  suffix: string;
  prefix: string;
  colorScale: boolean;
  setEventY: (d?: number) => void;
  setEventX: (d?: number) => void;
  setMouseOverData: (d: any) => void;
  indx: number;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  mode: 'light' | 'dark';
  resetSelectionOnDoubleClick: boolean;
}

export function Bars(props: Props) {
  const {
    data,
    onSeriesMouseOver,
    onSeriesMouseClick,
    y,
    x,
    highlightedDataPoints,
    barColor,
    selectedColor,
    colorDomain,
    showLabels,
    showValues,
    truncateBy,
    prefix,
    suffix,
    colorScale,
    setEventY,
    setEventX,
    setMouseOverData,
    indx,
    rtl,
    language,
    mode,
    resetSelectionOnDoubleClick,
  } = props;
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);

  return (
    <AnimatePresence>
      {data[indx].values.map(d => (
        <motion.g
          key={d.label}
          transition={{ duration: 0.5 }}
          className='undp-viz-g-with-hover'
          opacity={
            selectedColor
              ? d.color
                ? barColor[colorDomain.indexOf(d.color)] === selectedColor
                  ? 1
                  : 0.3
                : 0.3
              : highlightedDataPoints.length !== 0
              ? highlightedDataPoints.indexOf(d.label) !== -1
                ? 0.85
                : 0.3
              : 0.85
          }
          onMouseEnter={(event: any) => {
            setMouseOverData(d);
            setEventY(event.clientY);
            setEventX(event.clientX);
            if (onSeriesMouseOver) {
              onSeriesMouseOver(d);
            }
          }}
          onClick={() => {
            if (onSeriesMouseClick) {
              if (isEqual(mouseClickData, d) && resetSelectionOnDoubleClick) {
                setMouseClickData(undefined);
                onSeriesMouseClick(undefined);
              } else {
                setMouseClickData(d);
                onSeriesMouseClick(d);
              }
            }
          }}
          onMouseMove={(event: any) => {
            setMouseOverData(d);
            setEventY(event.clientY);
            setEventX(event.clientX);
          }}
          onMouseLeave={() => {
            setMouseOverData(undefined);
            setEventX(undefined);
            setEventY(undefined);
            if (onSeriesMouseOver) {
              onSeriesMouseOver(undefined);
            }
          }}
        >
          <motion.rect
            style={{
              fill: colorScale
                ? barColor[0]
                : !d.color
                ? UNDPColorModule[mode || 'light'].graphGray
                : barColor[colorDomain.indexOf(d.color)],
            }}
            height={d.size ? Math.abs(y(d.size) - y(0)) : 0}
            width={x.bandwidth()}
            animate={{
              height: d.size ? Math.abs(y(d.size) - y(0)) : 0,
              y: d.size ? (d.size > 0 ? y(d.size) : y(0)) : y(0),
              x: x(`${d.id}`),
              fill: colorScale
                ? barColor[0]
                : !d.color
                ? UNDPColorModule[mode || 'light'].graphGray
                : barColor[colorDomain.indexOf(d.color)],
            }}
            transition={{ duration: 0.5 }}
          />
          {showLabels ? (
            <motion.text
              style={{
                fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                fontSize: '0.75rem',
                textAnchor: 'middle',
                fontFamily: rtl
                  ? language === 'he'
                    ? 'Noto Sans Hebrew, sans-serif'
                    : 'Noto Sans Arabic, sans-serif'
                  : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
              }}
              dy={d.size ? (d.size >= 0 ? '15px' : '-5px') : '15px'}
              animate={{
                x: (x(`${d.id}`) as number) + x.bandwidth() / 2,
                y: y(0),
              }}
              transition={{ duration: 0.5 }}
            >
              {`${d.label}`.length < truncateBy
                ? `${d.label}`
                : `${`${d.label}`.substring(0, truncateBy)}...`}
            </motion.text>
          ) : null}
          {showValues ? (
            <motion.text
              style={{
                fill:
                  barColor.length > 1
                    ? UNDPColorModule[mode || 'light'].grays['gray-600']
                    : barColor[0],
                fontSize: '1rem',
                textAnchor: 'middle',
                fontFamily: rtl
                  ? language === 'he'
                    ? 'Noto Sans Hebrew, sans-serif'
                    : 'Noto Sans Arabic, sans-serif'
                  : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
              }}
              animate={{
                x: (x(`${d.id}`) as number) + x.bandwidth() / 2,
                y: y(d.size || 0),
              }}
              dy={d.size ? (d.size >= 0 ? '-5px' : '15px') : '-5px'}
              transition={{ duration: 0.5 }}
            >
              {numberFormattingFunction(d.size, prefix || '', suffix || '')}
            </motion.text>
          ) : null}
        </motion.g>
      ))}
    </AnimatePresence>
  );
}
