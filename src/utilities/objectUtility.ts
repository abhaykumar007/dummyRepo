const removeNestedEmpty = (initialObj: any): any => {
  const obj = initialObj;
  Object.keys(obj).forEach((key) => {
    if (
      obj[key] === null ||
      obj[key] === 0 ||
      obj[key] === "" ||
      obj[key] === undefined
    )
      delete obj[key];
    else if (Array.isArray(obj[key]) && obj[key].length === 0) delete obj[key];
    else if (
      Object.keys(obj[key]).length === 0 &&
      obj[key].constructor === Object
    )
      delete obj[key];
    else if (obj[key] && typeof obj[key] === "object")
      removeNestedEmpty(obj[key]);
  });
  return obj;
};
const removeEmpty = (obj: any): any => {
  return removeNestedEmpty(removeNestedEmpty(obj));
};

export const isObj = (obj: any): boolean => {
  if (obj) return Object.keys(obj).length !== 0 && obj.constructor === Object;
  return false;
};

export const changgeToQueryString =(obj:Record<string, string>):string=>{
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
}
export default removeEmpty;
