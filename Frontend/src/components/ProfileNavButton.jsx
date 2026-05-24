import { cn } from "../lib/cn";

function ProfileNavButton({ state, setState }) {
  const tabs = [
    { id: "videos", label: "Videos" },
    { id: "playlists", label: "Playlists" },
    { id: "posts", label: "Posts" },
    { id: "subscribers", label: "Subscribers" },
    { id: "suscribedTo", label: "Subscribed To" },
  ];

  return (
    <ul className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
      {tabs.map((tab) => (
        <li key={tab.id}>
          <button
            type="button"
            onClick={() => setState(tab.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              state === tab.id
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ProfileNavButton;
