interface SourceProps {
  text: string;
  link?: string;
}

export function Source(props: SourceProps) {
  const { text, link } = props;
  return (
    <p
      style={{
        fontSize: '1rem',
        color: 'var(--gray-500)',
        font: 'var(--fontFamily)',
      }}
    >
      Source:{' '}
      {link ? (
        <a
          className='undp-style'
          style={{ color: 'var(--gray-500)' }}
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
