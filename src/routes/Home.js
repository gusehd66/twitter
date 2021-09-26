import { addDoc, collection, onSnapshot, orderBy, query } from '@firebase/firestore';
import Tweet from 'components/Tweet';
import { dbService, storageService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    onSnapshot(query(collection(dbService, 'tweets'), orderBy("createdAt", "desc")), snapshot => {
      const tweetArr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTweets(tweetArr);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      //파일 경로 참조 만들기
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      //storage 참조 경로로 파일 업로드 하기
      const uploadFile = await uploadString(attachmentRef, attachment, "data_url");
      //storage에 있는 파일 URL로 다운로드 받기
      attachmentUrl = await getDownloadURL(uploadFile.ref);
    }
    const tweetPosting = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await addDoc(collection(dbService, "tweets"), tweetPosting);
    setTweet("");
    setAttachment("");
  };


  const onChange = (event) => {
    const { target: { value } } = event;
    setTweet(value);
  }

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result)
    }
    reader.readAsDataURL(theFile);
  }

  const onClearAttachment = () => setAttachment("")

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input
          type="submit"
          value="tweet"
        />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" alt="img" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {tweets.map(tweet => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        )
        )}
      </div>
    </div>
  )

};

export default Home;