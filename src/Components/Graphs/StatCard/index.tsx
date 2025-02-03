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
      style={{
        ...backgroundStyle,
        display: 'flex',
        flexDirection: 'column',
        height: 'inherit',
        width: '100%',
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
              mode={mode}
            />
          ) : null}
          <div
            style={{
              flexGrow: 1,
              flexDirection: 'column',
              display: 'flex',
              justifyContent:
                verticalAlign === 'top'
                  ? 'flex-start'
                  : verticalAlign === 'bottom'
                  ? 'flex-end'
                  : 'center',
            }}
          >
            <h3
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
                marginTop: '0',
                marginBottom: '1rem',
                textAlign: centerAlign ? 'center' : rtl ? 'right' : 'left',
                fontFamily:
                  'SohneBreit, ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
              }}
            >
              {typeof value === 'string'
                ? `${prefix}${value}${suffix}`
                : numberFormattingFunction(value, prefix, suffix)}{' '}
              {year ? (
                <span
                  style={{
                    marginLeft: '-8px',
                    fontSize: '1.25rem',
                    lineHeight: '1.09',
                    textShadow: 'none',
                    fontWeight: 'normal',
                    WebkitTextStroke: `0px ${UNDPColorModule[mode].grays.black}`,
                    color: UNDPColorModule[mode].grays['gray-550'],
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
