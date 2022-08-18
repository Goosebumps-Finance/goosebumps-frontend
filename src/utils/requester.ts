export const getAsyncData = (url, params) => {
  if (params !== undefined && params !== null) {
    url = `${url}?${new URLSearchParams(params)}`
  }
  // console.log('getAsyncData url = ', url, ' params=', params)
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json().then((j) => j))
}

export const postAsyncData = (url, params, data) => {
  if (params !== undefined && params !== null) {
    url = `${url}?${new URLSearchParams(params)}`
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => res.json().then((j) => j))
}
