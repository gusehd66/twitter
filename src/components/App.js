import { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import { updateProfile } from '@firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged(async (user) => {
      if (user) {
        if (user.displayName === null) {
          await updateProfile(user, {
            displayName: "Anymous",
          });
        }
        setUserObj({ ...user });
        setUserObj(user);
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, [])

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({ ...user });
    setUserObj(user);
  };

  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initialize..."}
      <footer>&copy; Twitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
