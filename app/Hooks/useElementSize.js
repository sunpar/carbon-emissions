import { useState, useCallback, useLayoutEffect } from 'react';

// helper function to get width and height
const getElementSize = el => {
  if (!el) {
    return {
      width: 0,
      height: 0
    };
  }
  return {
    width: el.clientWidth,
    height: el.clientHeight
  };
};

const useElementSize = ref => {
  const [ElementSize, setElementSize] = useState(
    getElementSize(ref ? ref.current : {})
  );

  const handleResize = useCallback(
    () => {
      if (ref.current) {
        setElementSize(getElementSize(ref.current));
      }
    },
    [ref]
  );

  useLayoutEffect(
    () => {
      console.log(ref.current);

      if (!ref.current) {
        return;
      }
      setTimeout(() => handleResize(), 1000);

      if (typeof ResizeObserver === 'function') {
        let resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(ref.current);

        return () => {
          resizeObserver.disconnect(ref.current);
          resizeObserver = null;
        };
      }
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    },
    [ref.current]
  );

  return ElementSize;
};

export default useElementSize;
