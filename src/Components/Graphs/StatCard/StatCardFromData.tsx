import sum from 'lodash.sum';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { UNDPColorModule } from '../../ColorPalette';
import { StatCardsFromDataSheetDataType } from '../../../Types';

interface Props {
  year?: number | string;
  data: StatCardsFromDataSheetDataType[];
  graphTitle: string;
  graphDescription?: string;
  suffix?: string;
  prefix?: string;
  source?: string;
  sourceLink?: string;
  footNote?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  graphID?: string;
  countOnly?: (string | number)[];
  aggregationMethod?: 'count' | 'max' | 'min' | 'average' | 'sum';
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
}

export function StatCardFromData(props: Props) {
  const {
    year,
    data,
    graphTitle,
    suffix,
    source,
    sourceLink,
    prefix,
    graphDescription,
    footNote,
    padding,
    backgroundColor,
    graphID,
    aggregationMethod,
    rtl,
    language,
    countOnly,
  } = props;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'inherit',
        width: '100%',
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule.grays['gray-200']
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
            gap: '3rem',
            justifyContent: 'space-between',
            flexGrow: 1,
          }}
        >
          {graphTitle || graphDescription ? (
            <GraphHeader
              rtl={rtl}
              language={language}
              graphTitle={graphTitle}
              graphDescription={graphDescription}
            />
          ) : null}
          <div
            style={{
              flexGrow: 1,
              flexDirection: 'column',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <h3
              style={{
                fontSize: '4.375rem',
                lineHeight: '1',
                textShadow: 'none',
                WebkitTextStroke: `2px ${UNDPColorModule.grays.black}`,
                color: UNDPColorModule.grays['gray-200'],
                letterSpacing: '0.05rem',
                marginTop: '0',
                marginBottom: '1rem',
                textAlign: rtl ? 'right' : 'left',
                fontFamily:
                  'SohneBreit, ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
              }}
            >
              {data.filter(d => typeof d.value === 'string').length > 0 ||
              aggregationMethod === 'count' ||
              !aggregationMethod
                ? countOnly && countOnly?.length !== 0
                  ? data.filter(d => countOnly.indexOf(d.value) !== -1).length
                  : data.length
                : aggregationMethod === 'sum'
                ? numberFormattingFunction(
                    sum(data.map(d => d.value)),
                    prefix || '',
                    suffix || '',
                  )
                : aggregationMethod === 'average'
                ? numberFormattingFunction(
                    parseFloat(
                      (sum(data.map(d => d.value)) / data.length).toFixed(2),
                    ),
                    prefix || '',
                    suffix || '',
                  )
                : aggregationMethod === 'max'
                ? numberFormattingFunction(
                    maxBy(data, d => d.value)?.value as number | undefined,
                    prefix || '',
                    suffix || '',
                  )
                : numberFormattingFunction(
                    minBy(data, d => d.value)?.value as number | undefined,
                    prefix || '',
                    suffix || '',
                  )}{' '}
              {year ? (
                <span
                  style={{
                    marginLeft: '-8px',
                    fontSize: '1.25rem',
                    lineHeight: '1.09',
                    textShadow: 'none',
                    fontWeight: 'normal',
                    WebkitTextStroke: `0px ${UNDPColorModule.grays.black}`,
                    color: UNDPColorModule.grays['gray-500'],
                    marginTop: '0',
                    marginBottom: '1rem',
                    fontFamily: rtl
                      ? language === 'he'
                        ? 'Noto Sans Hebrew, sans-serif'
                        : 'Noto Sans Arabic, sans-serif'
                      : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                  }}
                >
                  ({year})
                </span>
              ) : null}
            </h3>
          </div>
          {source || footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              source={source}
              sourceLink={sourceLink}
              footNote={footNote}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
