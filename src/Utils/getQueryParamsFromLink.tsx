interface ParameterInterface {
  param: string;
  value: string | string[];
}

export function getQueryParamsFromLink() {
  const params: ParameterInterface[] = [];
  new URL(window.location.href).searchParams.forEach((value, param) => {
    params.push({
      param,
      value:
        value.replaceAll('+', ' ').replaceAll('_', "'").split('~').length > 1
          ? value.replaceAll('+', ' ').replaceAll('_', "'").split('~')
          : value.replaceAll('+', ' ').replaceAll('_', "'"),
    });
  });
  return params;
}
