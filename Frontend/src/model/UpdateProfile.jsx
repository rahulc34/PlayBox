import { useState } from "react";
import { ImageIcon, UserCircle } from "lucide-react";
import { axiosPrivate } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import {
  FormLabel,
  FormFileInput,
  ModalStatus,
} from "../components/ui/FormField";

function ImageUploadSection({
  label,
  hint,
  currentUrl,
  previewUrl,
  onFileChange,
  onUpload,
  uploading,
  variant = "banner",
}) {
  const displayUrl = previewUrl || currentUrl;
  const isAvatar = variant === "avatar";

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <FormLabel>{label}</FormLabel>
      <p className="mb-3 text-xs text-muted-foreground">{hint}</p>

      <div className="mb-4 flex justify-center">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt=""
              className={
                isAvatar
                  ? "h-28 w-28 object-cover"
                  : "h-28 w-full min-w-[240px] object-cover sm:h-32 sm:min-w-[320px]"
              }
            />
          ) : (
            <div
              className={
                isAvatar
                  ? "flex h-28 w-28 items-center justify-center bg-muted text-muted-foreground"
                  : "flex h-28 w-full min-w-[240px] items-center justify-center bg-muted text-muted-foreground sm:min-w-[320px] sm:h-32"
              }
            >
              {isAvatar ? (
                <UserCircle size={48} strokeWidth={1.25} />
              ) : (
                <ImageIcon size={48} strokeWidth={1.25} />
              )}
            </div>
          )}
        </div>
      </div>

      <FormFileInput accept="image/png,image/jpeg,image/jpg" onChange={onFileChange} />
      <Button
        type="button"
        className="mt-3 w-full"
        disabled={!previewUrl || uploading}
        onClick={onUpload}
        text={uploading ? "Uploading…" : `Save ${label.toLowerCase()}`}
      />
    </div>
  );
}

const UpdateProfile = ({ onClose }) => {
  const { user, setUser } = useAuth();
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(null);

  const handleFile = (e, setFile, setPreview) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/png", "image/jpg", "image/jpeg"];
    const max = 10 * 1024 * 1024;
    if (!allowed.includes(file.type)) {
      setError("Use PNG or JPG only");
      return;
    }
    if (file.size >= max) {
      setError("Image must be under 10 MB");
      return;
    }
    setError("");
    setSuccess("");
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async (kind) => {
    const isAvatar = kind === "avatar";
    const file = isAvatar ? avatarFile : bannerFile;
    const url = isAvatar ? "/api/v1/users/avatar" : "/api/v1/users/coverImage";
    const field = isAvatar ? "avatar" : "coverImage";

    if (!file) {
      setError(`Choose a ${isAvatar ? "profile photo" : "cover image"} first`);
      return;
    }

    try {
      setUploading(kind);
      setError("");
      setSuccess("");
      const formData = new FormData();
      formData.append(field, file);
      const response = await axiosPrivate.patch(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setUser({ ...user, ...response.data.data });
        setSuccess(isAvatar ? "Profile photo updated" : "Cover image updated");
        if (isAvatar) {
          setAvatarFile(null);
          setAvatarPreview(null);
        } else {
          setBannerFile(null);
          setBannerPreview(null);
        }
      }
      setUploading(null);
    } catch (err) {
      setUploading(null);
      setError(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground">
          Edit profile
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your cover image and profile photo.
        </p>
      </div>

      <ImageUploadSection
        label="Cover image"
        hint="Recommended wide image, max 10 MB"
        currentUrl={user?.coverImage}
        previewUrl={bannerPreview}
        variant="banner"
        uploading={uploading === "banner"}
        onFileChange={(e) => handleFile(e, setBannerFile, setBannerPreview)}
        onUpload={() => uploadImage("banner")}
      />

      <ImageUploadSection
        label="Profile photo"
        hint="Square image works best, max 10 MB"
        currentUrl={user?.avatar}
        previewUrl={avatarPreview}
        variant="avatar"
        uploading={uploading === "avatar"}
        onFileChange={(e) => handleFile(e, setAvatarFile, setAvatarPreview)}
        onUpload={() => uploadImage("avatar")}
      />

      {error && <ModalStatus error={error} />}
      {success && <ModalStatus success successText={success} />}

      {onClose && (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => onClose(false)}
          text="Done"
        />
      )}
    </div>
  );
};

export default UpdateProfile;
