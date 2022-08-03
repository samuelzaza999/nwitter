import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { dbService, storageService } from "fBase";
import Nweet from "components/Nweet";
import { getDownloadURL, ref, uploadString } from "@firebase/storage"; // 레퍼런스를 통한 파일 업/다운로드와 삭제 등
import { v4 as uuidv4 } from "uuid"; // 랜덤 id 생성
import NweetFactory from "components/NweetFactory";

// 일단 기능을 만든 뒤에 코드를 정리하기
export default function Home({ userObj }) {
  // const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  // const [attachment, setAttachment] = useState("");
  // const fileInput = useRef(); // Clear 이후에도 남아있는 이미지 파일명 지우기

  // 이거는 구식
  // const getNweets = async () => {
  //   const q = query(collection(dbService, "nweets"));
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.data());
  //     const nweetObj = {
  //       ...doc.data(),
  //       id: doc.id,
  //     };
  //     setNweets((prev) => [nweetObj, ...prev]); // 이전값으로 전달
  //   });
  // };
  // useEffect(() => {
  //   // 별개 함수로 분리
  //   getNweets();
  // }, []);

  // 이게 요즘거
  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc") // createdAt 기준 순서대로 나타내기
    );
    // 실시간 정보 취득, queue와 달리 docs를 가짐
    onSnapshot(q, (snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, []);

  // // 작업 순서: 사진을 올리고 -> 사진의 url을 받아 -> nweet에 추가
  // const onSubmit = async (e) => {
  //   e.preventDefault();

  //   let attachmentUrl = "";
  //   // 사진을 등록할 때만
  //   if (attachment !== "") {
  //     const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`); // 파일에 대한 레퍼런스
  //     const res = await uploadString(fileRef, attachment, "data_url");
  //     attachmentUrl = await getDownloadURL(res.ref);
  //     console.log(res);
  //   }

  //   const nweetObj = {
  //     text: nweet, // nweet의 value
  //     createdAt: Date.now(),
  //     createrId: userObj.uid,
  //     attachmentUrl,
  //   };
  //   await addDoc(collection(dbService, "nweets"), nweetObj);
  //   setNweet("");
  //   setAttachment("");
  // };
  // const onChange = (e) => {
  //   // event 내 target의 value를 달라.
  //   const {
  //     target: { value },
  //   } = e;
  //   setNweet(value);
  // };

  // const onFileChange = (e) => {
  //   // console.log(e.target.files); // 파일 형식 찾기
  //   const {
  //     target: { files },
  //   } = e;
  //   const theFile = files[0];
  //   // console.log(theFile);

  //   const reader = new FileReader();
  //   reader.readAsDataURL(theFile); // 파일 읽기
  //   reader.onloadend = (finishedEvent) => {
  //     // 읽기 끝나면 결과 받기, currentTarget.result에 아주 긴 url이 생성되어 이미지 볼 수 있게 한다.
  //     // console.log(finishedEvent);
  //     const {
  //       currentTarget: { result },
  //     } = finishedEvent;
  //     setAttachment(result);
  //   };
  // };
  // const onClearAttachment = () => {
  //   setAttachment("");
  //   fileInput.current.value = null; // 파일명 지우기
  // };

  console.log(nweets);

  return (
    <div className="container">
      {/* <form onSubmit={onSubmit}>
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
      </form> */}
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          // <div key={nweet.id}>
          //   <h4>{nweet.text}</h4> {/** addDoc에서 이름을 nweet으로 줬다 */}
          // </div>
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.createrId === userObj.uid}
          /> // createrId와 userObj.uid를 비교해 같으면 삭제, 수정 가능하게
        ))}
      </div>
    </div>
  );
}
