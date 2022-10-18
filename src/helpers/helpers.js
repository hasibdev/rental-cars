const debounch = function (fn, delay) {
  let timeoutId

  return function () {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn()
    }, delay)
  }
}


export default {
  debounch
}

