/**
 * 브라우져 크롬 여부
 * @return boolean
 */
export const isChrome = () => {
  return /chrome/i.test(navigator.userAgent) && !/edge|opr|brave/i.test(navigator.userAgent);
};

/**
 * 브라우져 firefox 여부
 * @return boolean
 */
export const isFirefox = () => {
  return /firefox/i.test(navigator.userAgent);
};
