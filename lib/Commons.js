export function filterList (list, props) {
  const filterKeys = Object.keys(props)
  return list.filter(item => {
    return filterKeys.every(key => {
      if (typeof props[key] === 'function') {
        return props[key](item[key])
        // return props[key]
      }
      if (typeof props[key] === 'string') {
        return props[key] === item[key]
      }
      if (typeof props[key] === 'number') {
        return props[key] === item[key]
      }
      if (typeof props[key] === 'object') {
        return true
      }
      return false
    })
  })
}

export function mapValues (list, key) {
  return list.map(item => { return item[key] })
}
