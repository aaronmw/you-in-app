import { AppContext } from '@/pages/_app';
import { useContext } from 'react';

const HomePage = () => {
  const { dispatch, state } = useContext(AppContext);

  return <div>Done!</div>;
};

export default HomePage;
