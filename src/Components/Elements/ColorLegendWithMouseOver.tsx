import UNDPColorModule from 'undp-viz-colors';

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
      }}
    >
      {colorLegendTitle ? (
        <p
          className='undp-typography'
          style={{ fill: 'var(--gray-700)', fontSize: '0.875rem' }}
        >
          {colorLegendTitle}
        </p>
      ) : null}
      <div className='flex-div margin-bottom-00 flex-wrap gap-06'>
        {colorDomain.map((d, i) => (
          <div
            className='flex-div gap-03 flex-vert-align-center'
            key={i}
            onMouseEnter={() => {
              setSelectedColor(colors[i]);
            }}
            onMouseLeave={() => {
              setSelectedColor(undefined);
            }}
            style={{ cursor: 'pointer' }}
          >
            <div
              style={{
                width: '0.75rem',
                height: '0.75rem',
                borderRadius: '1rem',
                backgroundColor: colors[i],
              }}
            />
            <p
              className='undp-typography margin-bottom-00 small-font'
              style={{ marginTop: '3px' }}
            >
              {d}
            </p>
          </div>
        ))}
        {showNAColor ? (
          <div
            className='flex-div gap-03 flex-vert-align-center'
            onMouseEnter={() => {
              setSelectedColor(UNDPColorModule.graphGray);
            }}
            onMouseLeave={() => {
              setSelectedColor(undefined);
            }}
            style={{ cursor: 'pointer' }}
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
              className='undp-typography margin-bottom-00 small-font'
              style={{ marginTop: '3px' }}
            >
              NA
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
