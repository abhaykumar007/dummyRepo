/**
 * This function coverts a DOM Tree into JavaScript Object.
 * @param srcDOM: DOM Tree to be converted.
 */
export default function XMLToJSON(srcDOM: any): any {
  const children = [...srcDOM.children];

  // base case for recursion.
  if (!children.length) {
    return srcDOM.innerHTML;
  }

  // initializing object to be returned.
  const jsonResult: { [key: string]: any } = {};

  children.map((child) => {
    // checking is child has siblings of same name.
    const childIsArray =
      children.filter((eachChild) => eachChild.nodeName === child.nodeName)
        .length > 1;

    // if child is array, save the values as array, else as strings.
    if (childIsArray) {
      if (jsonResult[child.nodeName] === undefined) {
        jsonResult[child.nodeName] = [XMLToJSON(child)];
      } else {
        jsonResult[child.nodeName].push(XMLToJSON(child));
      }
    } else {
      jsonResult[child.nodeName] = XMLToJSON(child);
    }
    return null;
  });

  return jsonResult;
}
