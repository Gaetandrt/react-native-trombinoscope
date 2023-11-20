import { useState, useEffect } from 'react';

function useSleep(ms) {
  const [isSleeping, setIsSleeping] = useState(true);

  useEffect(() => {
    let timer;

    const sleep = async () => {
      timer = setTimeout(() => {
        setIsSleeping(false);
      }, ms);
    };

    sleep();

    return () => {
      clearTimeout(timer); // Cleanup timer when the component unmounts
    };
  }, [ms]);

  return isSleeping;
}

export default useSleep;
