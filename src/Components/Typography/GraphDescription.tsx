import { UNDPColorModule } from '../ColorPalette';

interface Props {
  text: string;
}

export function GraphDescription(props: Props) {
  const { text } = props;
  return (
    <p
      className='undp-viz-typography'
      style={{
        color: UNDPColorModule.grays['gray-600'],
        marginBottom: 0,
        fontSize: '0.875rem',
      }}
    >
      {text}
    </p>
  );
}
