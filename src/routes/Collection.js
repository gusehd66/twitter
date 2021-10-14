import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Collection = () => {
  const [tweets, setTweets] = useState([]);
  const [click, setClick] = useState({ a: "", b: "" });
  const [check, setCheck] = useState(true);

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

  const clickImage = (event) => {
    const a = event.target.parentElement.id;
    setCheck(!check);
    const b = check;
    setClick({ a, b });
    console.log(click);
  };

  return (
    <div className="collection">
      {tweets.map((tweet) => (
        <div key={tweet.id} onClick={clickImage} id={tweet.id}>
          {tweet.attachmentUrl && (
            <img
              src={tweet.attachmentUrl}
              alt="tweetImage"
              className={
                click.b && tweet.id === click.a ? "clickImage" : "tweetImage"
              }
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Collection;
