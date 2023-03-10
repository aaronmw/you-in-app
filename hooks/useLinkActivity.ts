import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const useLinkActivity = (href: string) => {
  const [isActiveExcludingHash, setIsActiveExcludingHash] = useState(false);
  const [isActiveIncludingHash, setIsActiveIncludingHash] = useState(false);

  const { asPath, isReady } = useRouter();

  useEffect(() => {
    if (isReady) {
      const { hash: linkHash, pathname: linkPath } = new URL(
        href,
        location.href
      );

      const { hash: activeLinkHash, pathname: activeLinkPath } = new URL(
        asPath,
        location.href
      );

      const newIsActiveExcludingHash = linkPath === activeLinkPath;

      const newIsActiveIncludingHash =
        newIsActiveExcludingHash &&
        (linkHash ? linkHash === activeLinkHash : true);

      if (newIsActiveExcludingHash !== isActiveExcludingHash) {
        setIsActiveExcludingHash(newIsActiveExcludingHash);
      }

      if (newIsActiveIncludingHash !== isActiveIncludingHash) {
        setIsActiveIncludingHash(newIsActiveIncludingHash);
      }
    }
  }, [asPath, href, isActiveExcludingHash, isActiveIncludingHash, isReady]);

  return {
    isActive: isActiveIncludingHash,
    isActiveExcludingHash,
    isActiveIncludingHash,
  };
};

export { useLinkActivity };
