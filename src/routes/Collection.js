import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Collection = () => {
  const [tweets, setTweets] = useState([]);
  const [click, setClick] = useState({ clickId: "", check: "" });
  const [checkId, setCheckId] = useState(true);

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
    const clickId = event.target.parentElement.id;
    setCheckId(!checkId);
    const check = checkId;
    setClick({ clickId, check });
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
                click.check && tweet.id === click.clickId
                  ? "clickImage"
                  : "tweetImage"
              }
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Collection;
