import { updateProfile } from "@firebase/auth";
import { addDoc, collection, getDocs, query, where } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { authService, dbService, storageService } from "fbase";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { v4 as uuidv4 } from "uuid";

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [profile, setProfile] = useState("");
  const [url, setUrl] = useState("");

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  //내가 쓴 tweet과 profiles가져오기
  const getMyTweets = useCallback(async () => {
    const myTeets = query(
      collection(dbService, "tweets"),
      where("creatorId", "==", userObj.uid)
    );
    const myProfile = query(
      collection(dbService, "profiles"),
      where("creatorId", "==", userObj.uid)
    );
    await getDocs(myTeets);
    const querySnapshot = await getDocs(myProfile);
    querySnapshot.forEach((doc) => {
      if (doc.data().profileUrl) {
        setUrl((prev) => [doc.data().profileUrl, ...prev]);
      }
    });
  }, [userObj]);

  useEffect(() => {
    getMyTweets();
  }, [getMyTweets]);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (newDisplayName === "") {
      return;
    }
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, { displayName: newDisplayName });
    }

    event.preventDefault();
    let profileUrl = "";
    if (profile !== "") {
      //파일 경로 참조 만들기
      const profileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      //storage 참조 경로로 파일 업로드 하기
      const uploadProfile = await uploadString(profileRef, profile, "data_url");
      //storage에 있는 파일 URL로 다운로드 받기
      profileUrl = await getDownloadURL(uploadProfile.ref);
    }
    const profileInfo = {
      creatorId: userObj.uid,
      profileUrl,
      creatorProfile: userObj.displayName,
    };

    await addDoc(collection(dbService, "profiles"), profileInfo);
    setProfile("");

    refreshUser();
  };

  const profileChange = (event) => {
    const {
      target: { files },
    } = event;
    const profileImage = files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setProfile(result);
    };
    fileReader.readAsDataURL(profileImage);
  };

  const clearProfile = () => setProfile(null);

  return (
    <div className="container">
      {url && <img src={url[0]} alt="profile" className="profile__image" />}
      {profile && (
        <div className="preview">
          <img src={profile} alt="profile" />
          <button onClick={clearProfile}>Clear</button>
        </div>
      )}
      <input type="file" accept="image/*" onChange={profileChange} />
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          autoFocus
          placeholder="Display name"
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
