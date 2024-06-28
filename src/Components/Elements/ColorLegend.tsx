import UNDPColorModule from 'undp-viz-colors';

interface Props {
  colors: string[];
  colorDomain: string[];
  colorLegendTitle?: string;
  showNAColor?: boolean;
  width?: number;
}

export function ColorLegend(props: Props) {
  const { colorLegendTitle, colorDomain, colors, showNAColor, width } = props;

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
      <div className='flex-div margin-bottom-00 flex-wrap'>
        {colorDomain.map((d, i) => (
          <div className='flex-div gap-03 flex-vert-align-center' key={i}>
            <div
              style={{
                width: '0.75rem',
                height: '0.75rem',
                borderRadius: '1rem',
                backgroundColor: colors[i],
              }}
            />
            <p className='undp-typography margin-bottom-00 small-font'>{d}</p>
          </div>
        ))}
        {showNAColor ? (
          <div className='flex-div gap-03 flex-vert-align-center'>
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
