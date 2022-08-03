import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fBase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

// 코드 이주: 모듈화 하면서 복사할 것과 가져올 요소 구분하기
export default function NweetFactory({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const fileInput = useRef(); // Clear 이후에도 남아있는 이미지 파일명 지우기

  // 작업 순서: 사진을 올리고 -> 사진의 url을 받아 -> nweet에 추가
  const onSubmit = async (e) => {
    if (nweet === "") {
      return;
    }
    e.preventDefault();

    let attachmentUrl = "";
    // 사진을 등록할 때만
    if (attachment !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`); // 파일에 대한 레퍼런스
      const res = await uploadString(fileRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(res.ref);
      console.log(res);
    }

    const nweetObj = {
      text: nweet, // nweet의 value
      createdAt: Date.now(),
      createrId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "nweets"), nweetObj);
    setNweet("");
    setAttachment("");
  };
  const onChange = (e) => {
    // event 내 target의 value를 달라.
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  const onFileChange = (e) => {
    // console.log(e.target.files); // 파일 형식 찾기
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    // console.log(theFile);

    const reader = new FileReader();
    reader.readAsDataURL(theFile); // 파일 읽기
    reader.onloadend = (finishedEvent) => {
      // 읽기 끝나면 결과 받기, currentTarget.result에 아주 긴 url이 생성되어 이미지 볼 수 있게 한다.
      // console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
  };
  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current.value = null; // 파일명 지우기
  };

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label for="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
}
