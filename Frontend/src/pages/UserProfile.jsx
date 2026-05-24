import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../api/axios.js";
import Profile from "../components/Profile.jsx";
import VideoList from "../components/VideoList.jsx";
import ProfileNavDetail from "../components/ProfileNavDetail.jsx";
import ProfileNavButton from "../components/ProfileNavButton.jsx";

function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  const [state, setState] = useState("videos");

  const getUserProfile = async () => {
    try {
      const response = await axiosPrivate.get(`/api/v1/users/C/${username}`);
      const data = response.data;
      if (data.success) {
        setUser(data.data);
        setUserId(data.data?._id);
        setState("videos");
      }
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [username]);

  return (
    <div className="space-y-2">
      <Profile {...user} setUser={setUser} user={user} />
      <ProfileNavButton state={state} setState={setState} />
      <ProfileNavDetail state={state} userId={userId} />
    </div>
  );
}

export default UserProfile;
