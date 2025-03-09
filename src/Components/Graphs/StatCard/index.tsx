import { H3 } from '@undp-data/undp-design-system-react';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { UNDPColorModule } from '../../ColorPalette';
import { BackgroundStyleDataType, SourcesDataType } from '../../../Types';

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
  language?: 'ar' | 'he' | 'en';
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
      className={`${
        !backgroundColor
          ? 'bg-transparent '
          : backgroundColor === true
          ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
          : ''
      }flex flex-col w-full h-inherit ${mode || 'light'} ${language || 'en'}`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
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
              className={`leading-none font-heading ${
                centerAlign
                  ? 'text-center'
                  : language === 'he' || language === 'ar'
                  ? 'text-right'
                  : 'text-left'
              }`}
              style={{
                fontSize: headingFontSize,
                textShadow: 'none',
                WebkitTextStroke: textBackground
                  ? undefined
                  : `2px ${UNDPColorModule[mode].grays.black}`,
                color: textBackground
                  ? UNDPColorModule[mode].grays.black
                  : !backgroundColor
                  ? 'rgba(0,0,0,0)'
                  : backgroundColor === true
                  ? UNDPColorModule[mode].grays['gray-200']
                  : backgroundColor,
                letterSpacing: '0.05rem',
              }}
            >
              {typeof value === 'string'
                ? `${prefix}${value}${suffix}`
                : numberFormattingFunction(value, prefix, suffix)}{' '}
              {year ? (
                <span
                  className='text-lg font-normal mt-0 mb-4'
                  style={{
                    marginLeft: '-8px',
                    lineHeight: '1.09',
                    textShadow: 'none',
                    WebkitTextStroke: `0px ${UNDPColorModule[mode].grays.black}`,
                    color: UNDPColorModule[mode].grays['gray-550'],
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
  );
}
