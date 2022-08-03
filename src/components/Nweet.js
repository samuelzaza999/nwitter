import { dbService, storageService } from "fBase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

export default function Nweet({ nweetObj, isOwner }) {
  const [editing, setEditing] = useState(false); // 수정창 유무
  const [newNweet, setNewNweet] = useState(nweetObj.text); // text 업데이트
  let nweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`); // nweet.id 위치
  let imageUrl = ref(storageService, nweetObj.attachmentUrl); // 올린 이미지의 url 받기

  const onDeleteClick = async () => {
    const ok = window.confirm("삭제하시겠습니다?");
    if (ok) {
      try {
        await deleteDoc(nweetTextRef);
        if (nweetObj.attachmentUrl !== "") {
          await deleteObject(imageUrl);
        }
      } catch (e) {
        window.alert("삭제 실패");
      }
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(nweetTextRef, {
      text: newNweet,
    });
    setEditing(false);
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };
  const toggleEditing = () => setEditing((prev) => !prev);

  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="Edit"
              value={newNweet}
              onChange={onChange}
              required
            />
            <input type="submit" value="Update" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4> {/** addDoc에서 이름을 nweet으로 줬다 */}
          {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
          {/** nweetObj 안에 attachmentUrl 존재 */}
          {isOwner && (
            <div class="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
