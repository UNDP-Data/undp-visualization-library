interface Props {
  text: string;
}

export function FootNote(props: Props) {
  const { text } = props;
  return (
    <p
      className='undp-typography margin-bottom-00'
      style={{
        color: 'var(--gray-500)',
        fontSize: '0.875rem',
      }}
    >
      {text}
    </p>
  );
}
