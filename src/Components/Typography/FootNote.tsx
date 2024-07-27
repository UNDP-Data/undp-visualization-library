import { UNDPColorModule } from '../ColorPalette';

interface Props {
  text: string;
}

export function FootNote(props: Props) {
  const { text } = props;
  return (
    <p
      className='undp-viz-typography'
      style={{
        color: UNDPColorModule.grays['gray-600'],
        fontSize: '0.875rem',
        marginBottom: 0,
      }}
    >
      {text}
    </p>
  );
}
