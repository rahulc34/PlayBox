import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import EmptyPage from "./EmptyPage";
import UserHeader from "./UserHeader";
import { useAuth } from "../contexts/AuthContext";
import Model from "../model/Model";
import CreatePlaylist from "../model/CreatePlaylist";
import { DeletePlaylist } from "../model/DeletePlaylist";
import CenterDiv from "./CenterDiv";
import CollectionCard from "./CollectionCard";
import PageHeader from "./PageHeader";

function PlaylistCard({ userId }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState(null);
  const [playlistDeleteId, setPlaylistDeleteId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const navigate = useNavigate();

  const getAllPlaylist = async () => {
    try {
      const respose = await axiosPrivate.get(`/api/v1/playlist/user/${userId}`);
      if (respose.data.success) {
        setPlaylists(respose.data.data || []);
      }
    } catch {
      setPlaylists([]);
    }
  };

  useEffect(() => {
    getAllPlaylist();
  }, [userId]);

  const isOwner = userId === user._id;

  return (
    <>
      {isOwner ? (
        <UserHeader
          title="Collections"
          count={playlists?.length}
          isClose={setIsOpen}
          actionLabel="New collection"
        />
      ) : (
        <PageHeader
          title="Collections"
          subtitle={
            playlists?.length
              ? `${playlists.length} playlist${playlists.length === 1 ? "" : "s"}`
              : "Curated video lists"
          }
        />
      )}

      {playlists === null ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : playlists.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => (
            <CollectionCard
              key={playlist._id}
              name={playlist.name}
              description={playlist.description}
              totalVideos={playlist.totalVideos}
              isPrivate={playlist.isPrivate}
              imageUrl={playlist.imageUrl}
              showDelete={isOwner}
              onClick={() => navigate(`/playlist/${playlist._id}`)}
              onDelete={() => {
                setPlaylistDeleteId(playlist._id);
                setIsOpenDelete(true);
              }}
            />
          ))}
        </div>
      ) : (
        <CenterDiv>
          <EmptyPage
            title="No collections yet"
            desc={
              isOwner
                ? "Create a collection to group your favorite videos."
                : "This channel hasn't created any collections yet."
            }
          />
        </CenterDiv>
      )}

      <Model isOpen={isOpen} isClose={setIsOpen}>
        <CreatePlaylist setPlaylists={setPlaylists} playlists={playlists || []} />
      </Model>
      <Model isOpen={isOpenDelete} isClose={setIsOpenDelete}>
        <DeletePlaylist
          playlistId={playlistDeleteId}
          setPlaylists={setPlaylists}
          playlists={playlists || []}
        />
      </Model>
    </>
  );
}

export default PlaylistCard;
