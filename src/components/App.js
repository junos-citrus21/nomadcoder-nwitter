import React, {useState, useEffect} from "react";
import AppRouter from "./Router";
import {authService} from "../fbase";
import {updateProfile} from "firebase/auth";

function App() {
    const [init, setInit] = useState(false);
    const [userObj, setUserObj] = useState(null);

    //로그인이 되어있는지 감지
    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setUserObj({
                    displayName: user.displayName,
                    uid: user.uid,
                    updateProfile: () => updateProfile(user, {displayName: user.displayName}),
                });
            } else {
                setUserObj(null);
            }

            setInit(true);
        });
    }, []);
    const refreshUser = () => {
        const user = authService.currentUser;

        setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: () => updateProfile(user, {displayName: user.displayName}),
        });
    };

    return (
        <>
            {init ? (
                <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj}/>
            ) : (
                "Initializing..."
            )}
            <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
        </>
    );
}

export default App;