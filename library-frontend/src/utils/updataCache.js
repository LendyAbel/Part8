const uniqByTitle = a => {
  let seen = new Set()
  return a.filter(item => {
    let k = item.title
    return seen.has(k) ? false : seen.add(k)
  })
}

export const updateCacheAllBooks = (cache, query, addedBook) => {
  cache.updateQuery(query, data => {
    if (!data || !data.allBooks) {
      console.log('UPDATING DATA NULL')
      return data
    }

    return {
      allBooks: uniqByTitle(data.allBooks.concat(addedBook)),
    }
  })
}
