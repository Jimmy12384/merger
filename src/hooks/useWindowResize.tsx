import { useEffect, useState } from 'react';

interface WindowProperties {
  width: number;
  height: number;
}
const useWindowSize = (): WindowProperties => {
  const [windowSize, setWindowSize] = useState({
    width: 1920,
    height: 1080,
  } as WindowProperties);

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
};
export default useWindowSize;
