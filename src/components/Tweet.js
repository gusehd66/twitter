import { deleteDoc, doc, updateDoc } from '@firebase/firestore';
import { dbService } from 'fbase';
import React, { useState } from 'react';

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  const onDeleteClick = async () => {
    const okDelete = window.confirm("Are you sure you want to delete this tweet?")
    if (okDelete) {
      //delete tweet
      // await dbService.doc(`tweets/${tweetObj.id}`).delete();
      await deleteDoc(doc(dbService, `tweets/${tweetObj.id}`));
    }
  }

  const toggleEditing = () => setEditing(prev => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(tweetObj, newTweet)
    await updateDoc(doc(dbService, `tweets/${tweetObj.id}`), {
      text: newTweet,
    });
    setEditing(false);
  }
  const onChange = (event) => {
    const { target: { value } } = event;
    setNewTweet(value);
  }

  return (
    <div>
      {
        editing
          ?
          <>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Edit your tweet"
                value={newTweet}
                required
                onChange={onChange}
              />
              <input type="submit" value="Update tweet" />
            </form>
            <button onClick={toggleEditing}>Cancel</button>
          </>
          :
          <>
            <h4>
              {tweetObj.text}
            </h4>
            {isOwner && (
              <>
                <button onClick={onDeleteClick}>Delete Tweet</button>
                <button onClick={toggleEditing}>Edit Tweet</button>
              </>
            )}
          </>
      }
    </div>
  )
}

export default Tweet;