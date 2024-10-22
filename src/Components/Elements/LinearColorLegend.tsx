import { numberFormattingFunction } from '../../Utils/numberFormattingFunction';
import { UNDPColorModule } from '../ColorPalette';

interface Props {
  colors: string[];
  colorDomain: number[];
  colorLegendTitle?: string;
  width?: number;
  mode: 'dark' | 'light';
}

export function LinearColorLegend(props: Props) {
  const { colorLegendTitle, colorDomain, colors, width, mode } = props;
  return (
    <div
      style={{
        display: 'flex',
        gap: 0,
        flexWrap: 'wrap',
        justifyContent: 'center',
        lineHeight: 0,
        maxWidth: width || 'none',
      }}
    >
      {colorLegendTitle && colorLegendTitle !== '' ? (
        <p
          className='undp-viz-typography'
          style={{
            fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
            fontSize: '0.875rem',
            width: '100%',
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
          gap: 0,
          flexWrap: 'wrap',
          justifyContent: 'center',
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
          <p
            className='undp-viz-typography'
            style={{ marginBottom: 0, fontSize: '0.875rem' }}
          >
            {numberFormattingFunction(colorDomain[0], '', '')}
          </p>
          <p
            className='undp-viz-typography'
            style={{ marginBottom: 0, fontSize: '0.875rem' }}
          >
            {numberFormattingFunction(colorDomain[1], '', '')}
          </p>
        </div>
      </div>
    </div>
  );
}
