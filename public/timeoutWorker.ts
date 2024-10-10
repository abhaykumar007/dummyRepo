onmessage = (e) => {
  setTimeout(() => postMessage('timed out'), e.data.time)
}
