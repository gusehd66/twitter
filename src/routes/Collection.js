import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { dbService } from "fbase";
import React, { useCallback, useEffect, useState } from "react";

const Collection = () => {
  const [tweets, setTweets] = useState([]);
  const [click, setClick] = useState({ clickId: "", check: "" });
  const [checkId, setCheckId] = useState(true);
  const [search, setSearch] = useState("");

  const onSubmit = () => {
    if (search !== "") {
      snapShot(where("creatorProfile", "==", search));
    } else {
      snapShot(orderBy("createdAt", "desc"));
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setSearch(value);
  };

  const snapShot = useCallback((condition) => {
    onSnapshot(
      query(collection(dbService, "tweets"), condition),
      (snapshot) => {
        const tweetArr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTweets(tweetArr);
      }
    );
  }, []);

  useEffect(() => {
    snapShot(orderBy("createdAt", "desc"));
  }, [snapShot]);

  const clickImage = (event) => {
    const clickId = event.target.parentElement.id;
    setCheckId(!checkId);
    const check = checkId;
    setClick({ clickId, check });
  };

  return (
    <div className="collection">
      <form onSubmit={onSubmit} className="form">
        <input
          type="text"
          placeholder="Search ID"
          value={search}
          className="formInput"
          onChange={onChange}
        />
        <input
          type="submit"
          value="검색"
          className="formBtn"
          style={{
            marginTop: 10,
            marginBottom: 30,
          }}
        />
      </form>
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
