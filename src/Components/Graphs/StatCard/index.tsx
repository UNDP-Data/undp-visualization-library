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
  rtl?: boolean;
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
    rtl = false,
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
      className='flex flex-col w-full h-inherit'
      style={{
        ...backgroundStyle,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule[mode].grays['gray-200']
          : backgroundColor,
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
              rtl={rtl}
              language={language}
              graphTitle={graphTitle}
              graphDescription={graphDescription}
              mode={mode}
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
            <h3
              className={`mb-4 mt-0 font-heading ${
                centerAlign ? 'text-center' : rtl ? 'text-right' : 'text-left'
              }`}
              style={{
                fontSize: headingFontSize,
                lineHeight: '1',
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
                  className={`text-lg md:text-lg font-normal mt-0 mb-4 ${
                    rtl
                      ? `font-sans-${language || 'ar'} text-right`
                      : 'text-left font-sans'
                  }`}
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
            </h3>
          </div>
          {sources || footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              sources={sources}
              footNote={footNote}
              mode={mode}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
