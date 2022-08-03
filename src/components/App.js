import React, { useEffect, useState } from "react";
import AppRouter from "components/Routes"; // jsconfig에 src로 절대 경로 지정
import { authService } from "fBase";
import {
  getAuth,
  onAuthStateChanged,
  updateCurrentUser,
  updateProfile,
} from "firebase/auth";

function App() {
  console.log(authService.currentUser);
  const [init, setInit] = useState(false); // false일 때 라우터 숨겨 로그인 구별
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  const [userObj, setUserObj] = useState(null); // App에서 유저 정보 알기 -> Routes -> Home 걸쳐 정보 전달

  useEffect(() => {
    // const auth = getAuth();
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
        // setUserObj({
        //   displayName: user.displayName,
        //   uid: user.uid,
        //   updateProfile: (args) =>
        //     updateProfile(user, { displayName: user.displayName }),
        // });
        setUserObj(user);
        if (user.displayName === null) {
          const name = user.email.split("@")[0];
          user.displayName = name;
        }
      } else {
        setIsLoggedIn(false);
        setUserObj(null); // 로그아웃
      }
      setInit(true);
    });
  }, []);

  // user 새로고침: userObj가 여기저기 팔려나감 -> Profile에서 유저 정보 업데이트할 때
  const refreshUser = async () => {
    // const user = authService.currentUser;
    // setUserObj({
    //   displayName: user.displayName,
    //   uid: user.uid,
    //   updateProfile: (args) =>
    //     updateProfile(user, { displayName: user.displayName }),
    // });
    await updateCurrentUser(authService, authService.currentUser);
    setUserObj(authService.currentUser);
  };

  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={/*isLoggedIn*/ Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        "Initializing..."
      )}
      <br />
      <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
