import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';

interface Props {
  year?: number | string;
  value: number;
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
}

export function StatCard(props: Props) {
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
  } = props;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: backgroundColor
          ? padding || 'var(--spacing-05)'
          : padding || 0,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? 'var(--gray-200)'
          : backgroundColor,
      }}
      id={graphID}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 'var(--spacing-09)',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
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
              WebkitTextStroke: '2px var(--black)',
              color: 'var(--gray-200)',
              letterSpacing: '0.05rem',
              marginTop: '0',
              marginBottom: '1rem',
              fontFamily: 'var(--fontFamilyHeadings)',
            }}
          >
            {numberFormattingFunction(value, prefix || '', suffix || '')}{' '}
            {year ? (
              <span
                style={{
                  marginLeft: '-8px',
                  fontSize: '1.25rem',
                  lineHeight: '1.09',
                  textShadow: 'none',
                  fontWeight: 'normal',
                  WebkitTextStroke: '0px var(--black)',
                  color: 'var(--gray-500)',
                  marginTop: '0',
                  marginBottom: '1rem',
                  fontFamily: 'var(--fontFamily)',
                }}
              >
                ({year})
              </span>
            ) : null}
          </h3>
        </div>
        {source || footNote ? (
          <GraphFooter
            source={source}
            sourceLink={sourceLink}
            footNote={footNote}
          />
        ) : null}
      </div>
    </div>
  );
}
