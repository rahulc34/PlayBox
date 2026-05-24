import { Film } from "lucide-react";

function EmptyPage({ title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Film size={32} />
      </div>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {desc && <p className="mt-2 max-w-sm text-sm text-slate-500">{desc}</p>}
    </div>
  );
}

export default EmptyPage;
