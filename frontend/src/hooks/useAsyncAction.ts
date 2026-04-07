import { useCallback, useState } from 'react';
import { getErrorMessage } from '../lib/errors';

type RunAsync = (work: () => Promise<void>) => void;

export function useAsyncAction(): {
  errorMessage: string;
  isBusy: boolean;
  runAsync: RunAsync;
} {
  const [errorMessage, setErrorMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const runAsync = useCallback<RunAsync>((work) => {
    void (async () => {
      setIsBusy(true);
      setErrorMessage('');
      try {
        await work();
      } catch (e) {
        setErrorMessage(getErrorMessage(e));
      } finally {
        setIsBusy(false);
      }
    })();
  }, []);

  return { errorMessage, isBusy, runAsync };
}
