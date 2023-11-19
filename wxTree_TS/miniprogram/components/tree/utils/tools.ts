/**
 * 函数防抖
 * @param fn 
 * @param interval 
 */
function debounceFn(fn: (...args: any[]) => void, interval?: number): (...args: any[]) => void {
  let timer: number;

  const gapTime = interval || 1000;

  return function (this: any, ...args: any[]): void {
    clearTimeout(timer);

    const context = this;

    timer = setTimeout(() => {
      fn.call(context, ...args);
    }, gapTime);
  };
}

export const debounce = debounceFn;