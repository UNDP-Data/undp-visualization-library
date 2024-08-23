import { ScaleLinear, ScaleBand } from 'd3-scale';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import { motion, AnimatePresence } from 'framer-motion';
import sum from 'lodash.sum';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { UNDPColorModule } from '../../../../ColorPalette';
import { getTextColorBasedOnBgColor } from '../../../../../Utils/getTextColorBasedOnBgColor';

interface DataProps {
  date: string | number;
  values: {
    id: string;
    date: string | number;
    label: string | number;
    size: (number | undefined)[];
    data?: object;
  }[];
}

interface Props {
  data: DataProps[];
  onSeriesMouseOver?: (_d: any) => void;
  onSeriesMouseClick?: (_d: any) => void;
  y: ScaleLinear<number, number, never>;
  x: ScaleBand<string>;
  barColors: string[];
  selectedColor?: string;
  showBarLabel: boolean;
  truncateBy: number;
  showValues: boolean;
  suffix: string;
  prefix: string;
  setEventY: (d?: number) => void;
  setEventX: (d?: number) => void;
  setMouseOverData: (d: any) => void;
  indx: number;
}

export function Bars(props: Props) {
  const {
    data,
    onSeriesMouseOver,
    onSeriesMouseClick,
    y,
    x,
    barColors,
    selectedColor,
    showBarLabel,
    showValues,
    truncateBy,
    prefix,
    suffix,
    setEventY,
    setEventX,
    setMouseOverData,
    indx,
  } = props;
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);

  return (
    <AnimatePresence>
      {data[indx].values.map(d => {
        return (
          <g
            className='undp-viz-low-opacity undp-viz-g-with-hover'
            key={d.label}
          >
            {d.size.map((el, j) => (
              <motion.g
                key={j}
                opacity={
                  selectedColor ? (barColors[j] === selectedColor ? 1 : 0.3) : 1
                }
                onMouseEnter={(event: any) => {
                  setMouseOverData({ ...d, sizeIndex: j });
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver({ ...d, sizeIndex: j });
                  }
                }}
                onMouseMove={(event: any) => {
                  setMouseOverData({ ...d, sizeIndex: j });
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
                onClick={() => {
                  if (onSeriesMouseClick) {
                    if (isEqual(mouseClickData, { ...d, sizeIndex: j })) {
                      setMouseClickData(undefined);
                      onSeriesMouseClick(undefined);
                    } else {
                      setMouseClickData({ ...d, sizeIndex: j });
                      onSeriesMouseClick({ ...d, sizeIndex: j });
                    }
                  }
                }}
              >
                <motion.rect
                  key={j}
                  style={{
                    fill: barColors[j],
                  }}
                  width={x.bandwidth()}
                  animate={{
                    height: Math.abs(
                      y(sum(d.size.filter((element, k) => k <= j && element))) -
                        y(sum(d.size.filter((element, k) => k < j && element))),
                    ),
                    y: y(sum(d.size.filter((element, k) => k <= j && element))),
                    x: x(d.id),
                  }}
                  transition={{ duration: 0.5 }}
                />
                {showValues ? (
                  <motion.text
                    style={{
                      fill: getTextColorBasedOnBgColor(barColors[j]),
                      fontSize: '1rem',
                      textAnchor: 'middle',
                      fontFamily:
                        'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                    }}
                    dy={5}
                    animate={{
                      y:
                        y(
                          sum(d.size.filter((element, k) => k <= j && element)),
                        ) +
                        Math.abs(
                          y(
                            sum(
                              d.size.filter((element, k) => k <= j && element),
                            ),
                          ) -
                            y(
                              sum(
                                d.size.filter((element, k) => k < j && element),
                              ),
                            ),
                        ) /
                          2,
                      x: (x(d.id) || 0) + x.bandwidth() / 2,
                      opacity:
                        el &&
                        Math.abs(
                          y(
                            sum(
                              d.size.filter((element, k) => k <= j && element),
                            ),
                          ) -
                            y(
                              sum(
                                d.size.filter((element, k) => k < j && element),
                              ),
                            ),
                        ) > 20
                          ? 1
                          : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {numberFormattingFunction(el, prefix || '', suffix || '')}
                  </motion.text>
                ) : null}
              </motion.g>
            ))}
            {showBarLabel ? (
              <motion.text
                style={{
                  fill: UNDPColorModule.grays['gray-700'],
                  fontSize: '0.75rem',
                  textAnchor: 'middle',
                  fontFamily:
                    'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                }}
                dy='15px'
                animate={{
                  y: y(0),
                  x: (x(d.id) || 0) + x.bandwidth() / 2,
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
                  fill: UNDPColorModule.grays['gray-700'],
                  fontSize: '1rem',
                  textAnchor: 'middle',
                  fontFamily:
                    'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                }}
                dy={-10}
                animate={{
                  y: y(sum(d.size.map(el => el || 0))),
                  x: (x(d.id) || 0) + x.bandwidth() / 2,
                }}
                transition={{ duration: 0.5 }}
              >
                {numberFormattingFunction(
                  sum(d.size.filter(element => element)),
                  prefix || '',
                  suffix || '',
                )}
              </motion.text>
            ) : null}
          </g>
        );
      })}
    </AnimatePresence>
  );
}
