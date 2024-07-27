import { numberFormattingFunction } from '../../Utils/numberFormattingFunction';

interface Props {
  colors: string[];
  colorDomain: number[];
  colorLegendTitle?: string;
  width?: number;
}

export function LinearColorLegend(props: Props) {
  const { colorLegendTitle, colorDomain, colors, width } = props;
  return (
    <div
      className='flex-div gap-00 flex-wrap flex-hor-align-center'
      style={{
        lineHeight: 0,
        maxWidth: width || 'none',
      }}
    >
      {colorLegendTitle ? (
        <p
          className='undp-typography margin-bottom-03'
          style={{
            fill: 'var(--gray-700)',
            fontSize: '0.875rem',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {colorLegendTitle}
        </p>
      ) : null}

      <div
        className='flex-div gap-00 flex-wrap flex-hor-align-center'
        style={{
          lineHeight: 0,
          width: '100%',
          maxWidth: '360px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '360px',
            background: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
            marginBottom: '4px',
            height: '1rem',
          }}
        />
        <div
          style={{
            width: '100%',
            maxWidth: '360px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <p className='undp-typography small-font margin-bottom-00'>
            {numberFormattingFunction(colorDomain[0], '', '')}
          </p>
          <p className='undp-typography small-font margin-bottom-00'>
            {numberFormattingFunction(colorDomain[1], '', '')}
          </p>
        </div>
      </div>
    </div>
  );
}
