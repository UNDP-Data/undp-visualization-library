import * as sanitizeHtml from 'sanitize-html';
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
  const sanitizedString = sanitizeHtml(htmlString);
  const replacedString = sanitizedString.replace(
    /{{(.*?)}}/g,
    (_, str) => getDescendantProp(data, str) || 'NA',
  );
  return replacedString;
};
