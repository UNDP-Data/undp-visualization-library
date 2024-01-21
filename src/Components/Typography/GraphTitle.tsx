interface Props {
  text: string;
}

export function GraphTitle(props: Props) {
  const { text } = props;
  return <p className='undp-typography margin-bottom-00'>{text}</p>;
}
