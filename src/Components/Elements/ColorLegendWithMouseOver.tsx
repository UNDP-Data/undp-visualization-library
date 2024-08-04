import { UNDPColorModule } from '../ColorPalette';

interface Props {
  colors: string[];
  colorDomain: string[];
  colorLegendTitle?: string;
  showNAColor?: boolean;
  setSelectedColor: (_d?: string) => void;
  width?: number;
}

export function ColorLegendWithMouseOver(props: Props) {
  const {
    colorLegendTitle,
    colorDomain,
    colors,
    setSelectedColor,
    showNAColor,
    width,
  } = props;

  return (
    <div
      style={{
        lineHeight: 0,
        maxWidth: width || 'none',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div>
        {colorLegendTitle ? (
          <p
            className='undp-viz-typography'
            style={{
              fill: UNDPColorModule.grays['gray-700'],
              fontSize: '0.875rem',
              textAlign: 'center',
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
            gap: '1.5rem',
          }}
        >
          {colorDomain.map((d, i) => (
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              key={i}
              onMouseEnter={() => {
                setSelectedColor(colors[i % colors.length]);
              }}
              onMouseLeave={() => {
                setSelectedColor(undefined);
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
                className='undp-viz-typography'
                style={{
                  marginTop: '3px',
                  marginBottom: 0,
                  fontSize: '0.875rem',
                }}
              >
                {d}
              </p>
            </div>
          ))}
          {showNAColor ? (
            <div
              onMouseEnter={() => {
                setSelectedColor(UNDPColorModule.graphGray);
              }}
              onMouseLeave={() => {
                setSelectedColor(undefined);
              }}
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                cursor: 'pointer',
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
                className='undp-viz-typography'
                style={{
                  marginTop: '3px',
                  marginBottom: 0,
                  fontSize: '0.875rem',
                }}
              >
                NA
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
