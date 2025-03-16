import { H3 } from '@undp-data/undp-design-system-react';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import {
  BackgroundStyleDataType,
  Languages,
  SourcesDataType,
} from '../../../Types';

interface Props {
  year?: number | string;
  value: number | string;
  graphTitle: string;
  graphDescription?: string;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  footNote?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  graphID?: string;
  language?: Languages;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  textBackground?: boolean;
  backgroundStyle?: BackgroundStyleDataType;
  headingFontSize?: string;
  centerAlign?: boolean;
  verticalAlign?: 'center' | 'top' | 'bottom';
}

export function BasicStatCard(props: Props) {
  const {
    year,
    value,
    graphTitle,
    suffix = '',
    sources,
    prefix = '',
    graphDescription,
    footNote,
    padding,
    backgroundColor = false,
    graphID,
    language = 'en',
    mode = 'light',
    ariaLabel,
    textBackground = false,
    backgroundStyle = {},
    headingFontSize = '4.375rem',
    centerAlign = false,
    verticalAlign = 'center',
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
                {typeof value === 'string'
                  ? `${prefix}${value}${suffix}`
                  : numberFormattingFunction(value, prefix, suffix)}{' '}
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
              <GraphFooter sources={sources} footNote={footNote} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
