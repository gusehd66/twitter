import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import Tweet from "components/Tweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import TweetFactory from "components/TweetFactory";

const Home = ({ userObj }) => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    onSnapshot(
      query(collection(dbService, "tweets"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const tweetArr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTweets(tweetArr);
      }
    );
  }, []);
  return (
    <div className="container">
      <TweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
