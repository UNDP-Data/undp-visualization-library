import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  year?: number | string;
  value: number | string;
  graphTitle: string;
  graphDescription?: string;
  suffix?: string;
  prefix?: string;
  source: string;
  sourceLink?: string;
  footNote?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  graphID?: string;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  mode?: 'light' | 'dark';
}

export function BasicStatCard(props: Props) {
  const {
    year,
    value,
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
    rtl,
    language,
    mode,
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
              mode={mode || 'light'}
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
                WebkitTextStroke: `2px ${
                  UNDPColorModule[mode || 'light'].grays.black
                }`,
                color: UNDPColorModule[mode || 'light'].grays['gray-200'],
                letterSpacing: '0.05rem',
                marginTop: '0',
                marginBottom: '1rem',
                textAlign: rtl ? 'right' : 'left',
                fontFamily:
                  'SohneBreit, ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
              }}
            >
              {typeof value === 'string'
                ? `${prefix}${value}${suffix}`
                : numberFormattingFunction(
                    value,
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
                    WebkitTextStroke: `0px ${
                      UNDPColorModule[mode || 'light'].grays.black
                    }`,
                    color: UNDPColorModule[mode || 'light'].grays['gray-500'],
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
              mode={mode || 'light'}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
