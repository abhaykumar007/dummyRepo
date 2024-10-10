// const userDefineFieldTypeConversion = (obj) => {
//   const newObj = obj
//   if (
//     newObj.type === 'array-int' ||
//     newObj.type === 'int' ||
//     newObj.type === 'float' ||
//     newObj.type === 'array-float'
//   ) {
//     if (newObj.listOfValues) {
//       newObj.listOfValues = newObj.listOfValues.map((listOfValue) => {
//         if (Number.isFinite(+listOfValue)) return +listOfValue
//         return listOfValue
//       })
//     }
//     if (Array.isArray(newObj.defaultValue)) {
//       newObj.defaultValue = newObj.defaultValue.map((value) => {
//         if (Number.isFinite(+value)) return +value
//         return value
//       })
//     }
//     if (newObj.value && Array.isArray(newObj.value)) {
//       newObj.value = newObj.value.map((data) => {
//         if (Number.isFinite(+data)) return +data
//         return data
//       })
//     }
//   }
//   return newObj
// }

// export const findAddedAndRemovedEle = (oldArr, newArr) => {
//   const removedElements = oldArr.filter((oldEle) => !newArr.includes(oldEle))
//   const addedElements = newArr.filter((newEle) => !oldArr.includes(newEle))
//   return {
//     add: addedElements,
//     remove: removedElements,
//   }
// }
// export const capitalizedString = (string) =>
//   string
//     ? `${string.charAt(0).toUpperCase()}${string.slice(1, string.length).toLowerCase()}`
//     : string

// export const valueToKey = (obj, value) => Object.keys(obj).find((k) => obj[k] === value)

// export const valuesToKeys = (obj, values) => Object.keys(obj).filter((k) => values.includes(obj[k]))

export const arrayToString = (value:any) => {
    if (value) {
      let newValue = value
      if (Array.isArray(value)) {
        newValue = value.map((data, i) => {
          if (i === value.length - 1) return data
          return `${data},  `
        })
      } else if (value.toString() === 'true') newValue = 'Yes'
      else if (value.toString() === 'false') newValue = 'No'
      return newValue
    }
    return value
  }
  
  // export default userDefineFieldTypeConversion
  
  // export const stringifyBool = (v) => (v ? 'Yes' : 'No')
