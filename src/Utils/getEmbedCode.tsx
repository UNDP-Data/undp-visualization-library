const ArrToString = (d: string[] | number[]) => {
  let stringValTemp = '';
  d.forEach(el => {
    stringValTemp += `~${`${el}`.replace(/ /g, '+')}`;
  });
  const stringVal = stringValTemp.substring(1);
  return stringVal;
};

interface ParamsProps {
  id: string;
  value: string | boolean | number | string[] | number[];
}

export function getEmbedLink(link: string, params: ParamsProps[]) {
  let queryParams = '';
  params.forEach(d => {
    let paramToString = '';
    switch (typeof d.value) {
      case 'number':
        paramToString = `${d.value}`;
        break;
      case 'boolean':
        paramToString = `${d.value}`;
        break;
      case 'object':
        paramToString = ArrToString(d.value as string[] | number[]);
        break;
      default:
        paramToString = `${d}`;
    }
    queryParams += `&${d.id}=${paramToString
      .replace(/ /g, '+')
      .replaceAll("'", '_')}`;
  });
  return `${link}?${queryParams}`;
}

export function getIframeCode(link: string, params: ParamsProps[]) {
  return `<iframe src="${getEmbedLink(
    link,
    params,
  )}" loading="lazy" style="width: 100%; border: 0px none"></iframe>`;
}
