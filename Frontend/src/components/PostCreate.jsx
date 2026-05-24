import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import UserAvatar from "./UserAvatar";
import Button from "./ui/Button";

function PostCreate({ submitHandler, placeholder = "Add a comment…" }) {
  const { user } = useAuth();
  const [openEmoji, setOpenEmoji] = useState(false);
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    submitHandler(content.trim());
    setContent("");
    setOpenEmoji(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <UserAvatar src={user?.avatar} name={user?.username} size="md" />
        <span className="font-semibold text-foreground">@{user?.username}</span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full resize-none rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-ring/30"
      />

      <div className="relative mt-3 flex items-center justify-between">
        <div className="relative">
          <button
            type="button"
            aria-label="Add emoji"
            onClick={() => setOpenEmoji((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Smile size={20} />
          </button>
          {openEmoji && (
            <div className="absolute left-0 top-full z-50 mt-2">
              <EmojiPicker
                open={openEmoji}
                lazyLoadEmojis
                width={300}
                onEmojiClick={(emoji) =>
                  setContent((prev) => prev + emoji.emoji)
                }
              />
            </div>
          )}
        </div>
        <Button type="button" size="sm" text="Post" onClick={handleSubmit} />
      </div>
    </div>
  );
}

export default PostCreate;
