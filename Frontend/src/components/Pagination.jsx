import { cn } from "../lib/cn";

function Pagination({ page, setPage, totalPage }) {
  const showbtnLimit = totalPage > 2 + page ? 2 + page : totalPage;
  const btnarr = [];
  for (let i = page; i <= showbtnLimit; i++) {
    btnarr.push(i);
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
        disabled={page <= 1}
        onClick={() => page > 1 && setPage(page - 1)}
      >
        Prev
      </button>
      <div className="flex gap-1">
        {btnarr.map((btnNum) => (
          <button
            key={btnNum}
            type="button"
            className={cn(
              "flex h-9 min-w-9 items-center justify-center rounded-xl text-sm font-semibold transition",
              page === btnNum
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            onClick={() => setPage(btnNum)}
          >
            {btnNum}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
        onClick={() => setPage(page + 1 > totalPage ? 1 : page + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
