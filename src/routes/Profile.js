import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {authService, dbService} from "../fbase";
import {collection, getDocs, query, where} from "firebase/firestore";
import {updateProfile} from "firebase/auth";

const Profile = (props) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(props.userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut().then();
        navigate("/");
    };
    const onChange = (event) => {
        const {target: {value}} = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();

        if (props.userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, {displayName: newDisplayName});
            props.refreshUser();
        }
    }
    const getMyNweets = async () => {
        const q = query(
            collection(dbService, "nweets"),
            where("creatorId", "==", props.userObj.uid)
        );
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    };

    useEffect(() => {
        getMyNweets();
    }, [getMyNweets]);

    return (
        <div className="container route">
            <form onSubmit={onSubmit} className="profileForm">
                <input onChange={onChange} type="text" autoFocus placeholder="Display name" value={newDisplayName} className="formInput"/>
                <input type="submit" value="Update Profile" className="formBtn" style={{marginTop: 10,}}/>
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>Log Out</span>
        </div>
    );
}

export default Profile;