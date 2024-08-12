interface Props {
  text: string;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
}

export function GraphTitle(props: Props) {
  const { text, rtl, language } = props;
  return (
    <p
      className={`${
        rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
      }undp-viz-typography`}
      style={{
        marginBottom: 0,
        textAlign: rtl ? 'right' : 'left',
      }}
    >
      {text}
    </p>
  );
}
