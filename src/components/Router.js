import {HashRouter as Router, Route, Routes} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Navigation from "./Navigation";
import Profile from "../routes/Profile";

const AppRouter = (props) => {
    return (
        <Router>
            {props.isLoggedIn && <Navigation userObj={props.userObj}/>}
            <Routes>
                {props.isLoggedIn ? (
                    <>
                        <Route path="/" element={<Home userObj={props.userObj}/>}/>
                        <Route path="/profile" element={<Profile refreshUser={props.refreshUser} userObj={props.userObj}/>}/>
                    </>
                ) : (
                    <Route path="/" element={<Auth/>}/>
                )}
            </Routes>
        </Router>
    );
}

export default AppRouter;