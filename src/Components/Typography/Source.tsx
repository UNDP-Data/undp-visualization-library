import { UNDPColorModule } from '../ColorPalette';

interface SourceProps {
  text: string;
  link?: string;
}

export function Source(props: SourceProps) {
  const { text, link } = props;
  return (
    <p
      className='undp-viz-typography'
      style={{
        color: UNDPColorModule.grays['gray-600'],
        fontSize: '0.875rem',
        marginBottom: 0,
      }}
    >
      Source:{' '}
      {link ? (
        <a
          className='undp-viz-style'
          style={{ color: UNDPColorModule.grays['gray-600'] }}
          href={link}
          target='_blank'
          rel='noreferrer'
        >
          {text}
        </a>
      ) : (
        text
      )}
    </p>
  );
}
