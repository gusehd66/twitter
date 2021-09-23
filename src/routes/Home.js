import { addDoc, collection, getDocs, onSnapshot, orderBy, query } from '@firebase/firestore';
import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);

  // const getTweets = async () => {
  //   const dbTweets = await getDocs(collection(dbService, "tweets"));
  //   dbTweets.forEach(document => {
  //     const tweetObject = {
  //       ...document.data(),
  //       id: document.id,
  //     }
  //     setTweets(prev => [tweetObject, ...prev]);
  //   });
  // }

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
    await addDoc(collection(dbService, "tweets"), {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    })
    setTweet("");
  };
  const onChange = (event) => {
    const { target: { value } } = event;
    setTweet(value);
  }
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
        <input
          type="submit"
          value="tweet"
        />
      </form>
      <div>
        {tweets.map(tweet => {
          return (
            <div key={tweet.id}>
              <h4>
                {tweet.text}
              </h4>
            </div>
          )
        }
        )}
      </div>
    </div>
  )

};

export default Home;