interface Props {
  colors: string[];
  colorDomain: string[];
  colorLegendTitle?: string;
}

export function ColorLegend(props: Props) {
  const { colorLegendTitle, colorDomain, colors } = props;

  return (
    <div
      style={{
        lineHeight: 0,
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
      </div>
    </div>
  );
}
