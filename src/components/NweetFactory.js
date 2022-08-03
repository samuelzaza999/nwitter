import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fBase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useRef, useState } from "react";

// 코드 이주: 모듈화 하면서 복사할 것과 가져올 요소 구분하기
export default function NweetFactory({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const fileInput = useRef(); // Clear 이후에도 남아있는 이미지 파일명 지우기

  // 작업 순서: 사진을 올리고 -> 사진의 url을 받아 -> nweet에 추가
  const onSubmit = async (e) => {
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
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={nweet}
        onChange={onChange}
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={fileInput} // 파일명 지우기 용도
      />
      <input type="submit" value="Nweet" />
      {attachment && (
        <div>
          <img src={attachment} alt="sans" width="50px" height="50px" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
}
