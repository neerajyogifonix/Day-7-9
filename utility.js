// Debounce Function

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Throttle Function

function throttle(fn, delay) {
  let lastTime = 0;
  return function (...args) {
    let now = Date.now();

    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

//Exporting both functions
export { debounce, throttle };
