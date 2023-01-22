import {dbService} from "../fbase";
import {collection, query, onSnapshot, orderBy} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";

const Home = (props) => {
    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        const q = query(
            collection(dbService, "nweets"),
            orderBy("createdAt", "desc")
        );

        onSnapshot(q, (snapshot) => {
            const nweetArr = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setNweets(nweetArr);
        });
    }, []);

    return (
        <>
            <div className="container route">
                <NweetFactory userObj={props.userObj}/>
                <div style={{marginTop: 30}}>
                    {nweets.map((nweet) => (
                        <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === props.userObj.uid}/>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Home;