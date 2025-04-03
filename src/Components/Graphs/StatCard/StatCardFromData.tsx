import sum from 'lodash.sum';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import { H3 } from '@undp-data/undp-design-system-react';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import {
  Languages,
  SourcesDataType,
  StatCardsFromDataSheetDataType,
  StyleObject,
  ClassNameObject,
} from '@/Types';

interface Props {
  year?: number | string;
  headingFontSize?: string;
  data: StatCardsFromDataSheetDataType[];
  graphTitle: string;
  graphDescription?: string;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  footNote?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  graphID?: string;
  countOnly?: (string | number)[];
  aggregationMethod?: 'count' | 'max' | 'min' | 'average' | 'sum';
  language?: Languages;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  textBackground?: boolean;
  centerAlign?: boolean;
  verticalAlign?: 'center' | 'top' | 'bottom';
  styles?: StyleObject;
  classNames?: ClassNameObject;
}

export function StatCardFromData(props: Props) {
  const {
    year,
    data,
    graphTitle,
    suffix = '',
    sources,
    prefix = '',
    graphDescription,
    footNote,
    padding,
    backgroundColor = false,
    graphID,
    aggregationMethod = 'count',
    language = 'en',
    countOnly,
    mode = 'light',
    ariaLabel,
    textBackground = false,
    headingFontSize = '4.375rem',
    centerAlign = false,
    verticalAlign = 'center',
    styles,
    classNames,
  } = props;

  return (
    <div
      className={`${mode || 'light'} flex w-full`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={`${
          !backgroundColor
            ? 'bg-transparent '
            : backgroundColor === true
            ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
            : ''
        }flex flex-col w-full h-inherit ${language || 'en'}`}
        style={{
          ...(styles?.graphBackground || {}),
          ...(backgroundColor && backgroundColor !== true
            ? { backgroundColor }
            : {}),
        }}
        id={graphID}
        aria-label={
          ariaLabel ||
          `${
            graphTitle ? `The graph shows ${graphTitle}. ` : ''
          }This is a statistic card.${
            graphDescription ? ` ${graphDescription}` : ''
          }`
        }
      >
        <div
          className='flex grow'
          style={{
            padding: backgroundColor ? padding || '1rem' : padding || 0,
          }}
        >
          <div className='flex flex-col w-full gap-12 justify-between grow'>
            {graphTitle || graphDescription ? (
              <GraphHeader
                styles={{
                  title: styles?.title,
                  description: styles?.description,
                }}
                classNames={{
                  title: classNames?.title,
                  description: classNames?.description,
                }}
                graphTitle={graphTitle}
                graphDescription={graphDescription}
              />
            ) : null}
            <div
              className={`flex flex-col justify-between grow ${
                verticalAlign === 'top'
                  ? 'justify-start'
                  : verticalAlign === 'bottom'
                  ? 'justify-end'
                  : 'justify-center'
              }`}
            >
              <H3
                marginBottom='base'
                className={`leading-none text-outline font-heading ${
                  centerAlign
                    ? 'text-center'
                    : language === 'he' || language === 'ar'
                    ? 'text-right'
                    : 'text-left'
                } ${
                  textBackground
                    ? 'text-primary-black dark:text-primary-white'
                    : 'transparent'
                }`}
                style={{
                  fontSize: headingFontSize,
                  letterSpacing: '0.05rem',
                }}
              >
                {data.filter(d => typeof d.value === 'string').length > 0 ||
                aggregationMethod === 'count'
                  ? countOnly && countOnly?.length !== 0
                    ? data.filter(d => countOnly.indexOf(d.value) !== -1).length
                    : data.length
                  : aggregationMethod === 'sum'
                  ? numberFormattingFunction(
                      sum(data.map(d => d.value)),
                      prefix,
                      suffix,
                    )
                  : aggregationMethod === 'average'
                  ? numberFormattingFunction(
                      parseFloat(
                        (sum(data.map(d => d.value)) / data.length).toFixed(2),
                      ),
                      prefix,
                      suffix,
                    )
                  : aggregationMethod === 'max'
                  ? numberFormattingFunction(
                      maxBy(data, d => d.value)?.value as number | undefined,
                      prefix,
                      suffix,
                    )
                  : numberFormattingFunction(
                      minBy(data, d => d.value)?.value as number | undefined,
                      prefix,
                      suffix,
                    )}{' '}
                {year ? (
                  <span
                    className='text-lg font-normal mt-0 mb-4 text-primary-gray-550 dark:text-primary-gray-400'
                    style={{
                      marginLeft: '-8px',
                      lineHeight: '1.09',
                      textShadow: 'none',
                      WebkitTextStrokeWidth: 0,
                    }}
                  >
                    ({year})
                  </span>
                ) : null}
              </H3>
            </div>
            {sources || footNote ? (
              <GraphFooter
                styles={{ footnote: styles?.footnote, source: styles?.source }}
                classNames={{
                  footnote: classNames?.footnote,
                  source: classNames?.source,
                }}
                sources={sources}
                footNote={footNote}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
