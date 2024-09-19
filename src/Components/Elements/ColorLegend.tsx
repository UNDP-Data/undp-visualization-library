import { UNDPColorModule } from '../ColorPalette';

interface Props {
  colors: string[];
  colorDomain: string[];
  colorLegendTitle?: string;
  showNAColor: boolean;
  width?: number;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  isCenter?: boolean;
}

export function ColorLegend(props: Props) {
  const {
    colorLegendTitle,
    colorDomain,
    colors,
    showNAColor,
    width,
    rtl,
    language,
    isCenter,
  } = props;

  return (
    <div
      style={{
        lineHeight: 0,
        maxWidth: width || 'none',
        display: 'flex',
        justifyContent: isCenter ? 'center' : rtl ? 'flex-end' : 'flex-start',
      }}
    >
      <div>
        {colorLegendTitle ? (
          <p
            className={`${
              rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
            }undp-viz-typography`}
            style={{
              fill: UNDPColorModule.grays['gray-700'],
              fontSize: '0.875rem',
              textAlign: isCenter ? 'center' : rtl ? 'right' : 'left',
              marginBottom: '0.5rem',
            }}
          >
            {colorLegendTitle}
          </p>
        ) : null}
        <div
          style={{
            display: 'flex',
            marginBottom: 0,
            flexWrap: 'wrap',
            gap: '0.875rem',
            flexDirection: rtl ? 'row-reverse' : 'row',
          }}
        >
          {colorDomain.map((d, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '0.25rem',
                alignItems: 'center',
                flexDirection: rtl ? 'row-reverse' : 'row',
              }}
            >
              <div
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '1rem',
                  backgroundColor: colors[i % colors.length],
                }}
              />
              <p
                className={`${
                  rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
                }undp-viz-typography`}
                style={{
                  marginBottom: 0,
                  marginTop: '2px',
                  fontSize: '0.875rem',
                }}
              >
                {d}
              </p>
            </div>
          ))}
          {showNAColor ? (
            <div
              style={{
                display: 'flex',
                gap: '0.25rem',
                alignItems: 'center',
                flexDirection: rtl ? 'row-reverse' : 'row',
              }}
            >
              <div
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '1rem',
                  backgroundColor: UNDPColorModule.graphGray,
                }}
              />
              <p
                className={`${
                  rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
                }undp-viz-typography`}
                style={{
                  marginTop: '2px',
                  marginBottom: 0,
                  fontSize: '0.875rem',
                }}
              >
                {rtl ? (language === 'he' ? 'לא זמין' : 'غير متوفر') : 'NA'}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
