interface Props {
  text: string;
}

export function FootNote(props: Props) {
  const { text } = props;
  return (
    <p
      style={{
        fontSize: '1rem',
        color: 'var(--gray-500)',
        font: 'var(--fontFamily)',
      }}
    >
      {text}
    </p>
  );
}
