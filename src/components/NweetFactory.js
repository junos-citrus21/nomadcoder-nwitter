import React, {useState} from "react";
import {v4} from "uuid";
import {storageService, dbService} from "../fbase";
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {addDoc, collection} from "firebase/firestore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";

const NweetFactory = (props) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onFileChange = (event) => {
        const {target: {files}} = event;
        const theFile = files[0];
        const reader = new FileReader();

        reader.onloadend = (finishedEvent) => {
            const {currentTarget: {result}} = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
        }

        event.preventDefault();
        let attachmentUrl = "";

        //이미지 첨부하지 않고 텍스트만 올리고 싶을 때도 있기 때문에 attachment가 있을때만 아래 코드 실행
        //이미지 첨부하지 않은 경우엔 attachmentUrl=""이 된다.
        if (attachment !== "") {
            //파일 경로 참조 만들기
            const attachmentRef = ref(storageService, `${props.userObj.uid}/${v4()}`);
            //storage 참조 경로로 파일 업로드 하기
            const response = await uploadString(attachmentRef, attachment, "data_url");
            //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
            attachmentUrl = await getDownloadURL(response.ref);
        }

        //트윗 오브젝트
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: props.userObj.uid,
            attachmentUrl
        };

        //트윗하기 누르면 nweetObj 형태로 새로운 document 생성하여 nweets 콜렉션에 넣기
        await addDoc(collection(dbService, "nweets"), nweetObj);

        //state 비워서 form 비우기
        setNweet("");

        //파일 미리보기 img src 비워주기
        setAttachment("");
    };

    //첨부 파일 url 넣는 state인 attachment 비워서 프리뷰 img src 없애기
    const onClearAttachment = () => {
        //null에서 빈 값("")으로 수정, 트윗할 때 텍스트만 입력시 이미지 url ""로 비워두기 위함
        setAttachment("");
    };
    const onChange = (event) => {
        const {target: {value}} = event;
        setNweet(value);
    };

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input className="factoryInput__input" value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
                <input type="submit" value="&rarr;" className="factoryInput__arrow"/>
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus}/>
            </label>
            <input id="attach-file" type="file" accept="image/*" onChange={onFileChange} style={{opacity: 0,}} />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img src={attachment} style={{backgroundImage: attachment}} alt="img" />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
}

export default NweetFactory;