import React from "react";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useAuth } from "../contexts/AuthContext";
import emojiIcon from "../assests/smile.png";

function PostCreate({ submitHandler }) {
  const { user } = useAuth();
  const [openEmoji, setOpenEmoji] = useState(false);

  const [content, setContent] = useState("");

  const onEmojiClick = (imogi) => {
    setContent((prev) => {
      return prev + imogi.emoji;
    });
  };

  return (
    <div
      style={{
        border: "1px solid black",
        margin: "0 20px 0 10px",
        padding: "8px 16px",
        borderRadius: "10px",
        backgroundColor: "white",
        maxWidth: "740px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "0 0 10px 0",
        }}
      >
        <div className="dashboardButton">
          <p>{user.username[0].toUpperCase()}</p>
        </div>
        <span style={{ fontWeight: "700" }}>{user.username}</span>
      </div>
      <input
        type="text"
        style={{
          border: "0",
          borderBottom: "1px solid black",
          width: "100%",
          padding: "8px 16px",
          fontSize: "1.1rem",
        }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        <button
          onClick={() => {
            setOpenEmoji((prev) => !prev);
          }}
          style={{ border: "none", backgroundColor: "inherit" }}
        >
          <img src={emojiIcon} alt="emoji" width="25px" />
        </button>
        <div style={{ position: "absolute", zIndex: "29", marginTop: "30px" }}>
          <EmojiPicker
            open={openEmoji}
            lazyLoadEmojis={true}
            width={300}
            onEmojiClick={onEmojiClick}
          />
        </div>
        <button
          style={{
            padding: "8px 16px",
            borderRadius: "16px",
            border: "none",
            backgroundColor: "blue",
            color: "white",
          }}
          onClick={(e) => {
            submitHandler(content);
            setContent("");
            setOpenEmoji(false);
          }}
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default PostCreate;
