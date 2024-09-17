import xss from 'xss';
import { numberFormattingFunction } from './numberFormattingFunction';

function getDescendantProp(data: any, desc: string) {
  const dataStr = desc.split('.')[0].split('[')[0];
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const func = new Function(dataStr, `return ${desc}`);
  return typeof func(data) === 'number'
    ? numberFormattingFunction(func(data), '', '')
    : func(data);
}

export const string2HTML = (htmlString: string, data: any) => {
  // Custom XSS filter configuration
  const options = {
    whiteList: {
      b: ['class', 'id', 'style'],
      i: ['class', 'id', 'style'],
      strong: ['class', 'id', 'style'],
      em: ['class', 'id', 'style'],
      u: ['class', 'id', 'style'],
      small: ['class', 'id', 'style'],
      sub: ['class', 'id', 'style'],
      sup: ['class', 'id', 'style'],
      mark: ['class', 'id', 'style'],
      br: ['class', 'id', 'style'],
      hr: ['class', 'id', 'style'],
      p: ['class', 'id', 'style'],
      div: ['class', 'id', 'style'],
      span: ['class', 'id', 'style'],
      blockquote: ['class', 'id', 'style'],
      pre: ['class', 'id', 'style'],
      code: ['class', 'id', 'style'],
      h1: ['class', 'id', 'style'],
      h2: ['class', 'id', 'style'],
      h3: ['class', 'id', 'style'],
      h4: ['class', 'id', 'style'],
      h5: ['class', 'id', 'style'],
      h6: ['class', 'id', 'style'],
      ul: ['class', 'id', 'style'],
      ol: ['class', 'id', 'style'],
      li: ['class', 'id', 'style'],
      dl: ['class', 'id', 'style'],
      dt: ['class', 'id', 'style'],
      dd: ['class', 'id', 'style'],
      table: ['class', 'id', 'style'],
      thead: ['class', 'id', 'style'],
      tbody: ['class', 'id', 'style'],
      tfoot: ['class', 'id', 'style'],
      tr: ['class', 'id', 'style'],
      th: ['class', 'id', 'style'],
      td: ['class', 'id', 'style'],
      caption: ['class', 'id', 'style'],
      img: ['class', 'id', 'style', 'src', 'alt', 'width', 'height'],
      figure: ['class', 'id', 'style'],
      figcaption: ['class', 'id', 'style'],
      a: ['class', 'id', 'style', 'href', 'title'],
      abbr: ['class', 'id', 'style', 'title'],
      cite: ['class', 'id', 'style'],
      dfn: ['class', 'id', 'style'],
      kbd: ['class', 'id', 'style'],
      samp: ['class', 'id', 'style'],
    },
  };
  const sanitizedString = xss(htmlString, options);
  const replacedString = sanitizedString.replace(
    /{{(.*?)}}/g,
    (_, str) => getDescendantProp(data, str) || 'NA',
  );
  return replacedString;
};
