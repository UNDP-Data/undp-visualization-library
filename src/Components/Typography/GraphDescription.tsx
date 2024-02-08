interface Props {
  text: string;
}

export function GraphDescription(props: Props) {
  const { text } = props;
  return (
    <p
      className='undp-typography small-font margin-bottom-00'
      style={{ color: 'var(--gray-600)' }}
    >
      {text}
    </p>
  );
}
