import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import '@/styles/global.css';
import { User } from '@firebase/auth';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { NextComponentType } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import {
  createContext,
  Reducer,
  useContext,
  useEffect,
  useReducer,
} from 'react';

config.autoAddCss = false;

export interface Person extends PublicUserData {
  email: string;
  id: string;
  isAdmin?: boolean;
  status?: 'active' | 'inactive';
}

export interface PublicUserData {
  bio: string;
  location?: string;
  name: {
    first: string;
    last?: string;
  };
  socials?: {
    email?: string;
    facebook?: string;
    linkedIn?: string;
    telegram?: string;
    twitter?: string;
    discord?: string;
    phone?: string;
  };
  timezone?: string;
}

export interface PageProps {}

export interface AppState {
  authenticatedUser?: User;
}

export interface AppContextObject {
  dispatch: (action: AppStateAction) => void;
  state: AppState;
}

export type AppStateAction =
  | {
      type: 'logOut';
    }
  | {
      type: 'setAuthenticatedUser';
      authenticatedUser: User;
    };

const initialState: AppState = {
  authenticatedUser: undefined,
};

const appStateReducer: Reducer<AppState, AppStateAction> = (state, action) => {
  switch (action.type) {
    case 'logOut': {
      return {
        ...state,
        authenticatedUser: undefined,
      };
    }

    case 'setAuthenticatedUser': {
      return {
        ...state,
        authenticatedUser: action.authenticatedUser,
      };
    }

    default:
      return { ...state };
  }
};

export const AppContext = createContext<AppContextObject>({
  dispatch: () => null,
  state: initialState,
});

const App = ({ Component, pageProps }: AppProps<PageProps>) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  const { user } = useFirebaseAuth();

  const appContext = {
    dispatch,
    state,
  };

  return (
    <AppContext.Provider value={appContext}>
      <Head>
        <title>You In?</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div>
        {!!user ? <AppLoggedIn Component={Component} /> : <AppLoggedOut />}
      </div>
    </AppContext.Provider>
  );
};

const AppLoggedOut = () => {
  const { dispatch, state } = useContext(AppContext);

  const { user, signIn } = useFirebaseAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    dispatch({
      type: 'setAuthenticatedUser',
      authenticatedUser: user,
    });
  }, [dispatch, user]);

  return (
    <div className="bg-blue-900">
      <Button onClick={signIn} variant="primary">
        <Icon name="google" />
        <div>Sign In With Google</div>
      </Button>
    </div>
  );
};

const AppLoggedIn = ({ Component }: { Component: NextComponentType }) => {
  const { dispatch, state } = useContext(AppContext);

  const { signOut } = useFirebaseAuth();

  const handleClickLogOut = () => {
    signOut();

    dispatch({
      type: 'logOut',
    });
  };

  return (
    <div>
      <button onClick={handleClickLogOut}>Log Out</button>
      <Component />
    </div>
  );
};

export default App;
