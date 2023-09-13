export function isset(property: any): boolean {
  return typeof property !== 'undefined' && property != null;
}

export function isNullOrEmpty(property: any): boolean {
  if (!isset(property)) {
    return true;
  }

  if (typeof property === 'string') {
    return property.trim().length < 1;
  }

  if (typeof property.length !== 'number') {
    return false;
  }

  return property.length < 1;
}

export function tpl(template: string, data: any): string {
  return template.replace(/\{([\w\.]*)\}/g, function (str, key) {
    const keys = key.split('.');
    let v = data[keys.shift()];
    for (let i = 0, l = keys.length; i < l; i++) {
      v = v[keys[i]];
    }

    return typeof v !== 'undefined' && v !== null ? v : '{' + key + '}';
  });
}
