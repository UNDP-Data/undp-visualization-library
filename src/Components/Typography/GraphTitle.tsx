interface Props {
  text: string;
}

export function GraphTitle(props: Props) {
  const { text } = props;
  return (
    <p className='undp-viz-typography' style={{ marginBottom: 0 }}>
      {text}
    </p>
  );
}
