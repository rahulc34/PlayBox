import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "../lib/cn";

function Filter({ setUploadDate, setDuration, setShortBy, getVideos }) {
  const [showFilter, setShowFilter] = useState(false);

  const fields = [
    {
      id: "type",
      label: "Type",
      defaultValue: "video",
      options: [{ value: "video", label: "Video" }],
    },
    {
      id: "uploadDate",
      label: "Upload date",
      onChange: setUploadDate,
      options: [
        { value: "hour", label: "Last hour" },
        { value: "today", label: "Today" },
        { value: "week", label: "This week" },
        { value: "month", label: "This month" },
        { value: "year", label: "This year" },
      ],
    },
    {
      id: "shortBy",
      label: "Sort by",
      onChange: setShortBy,
      options: [
        { value: "CreatedAt", label: "Upload date" },
        { value: "views", label: "Views" },
      ],
    },
    {
      id: "duration",
      label: "Duration",
      onChange: setDuration,
      options: [
        { value: "short", label: "Under 4 minutes" },
        { value: "medium", label: "4–20 minutes" },
        { value: "long", label: "Over 20 minutes" },
      ],
    },
  ];

  return (
    <div className="relative flex-1">
      <button
        type="button"
        aria-label="Toggle filters"
        aria-expanded={showFilter}
        onClick={() => setShowFilter((prev) => !prev)}
        className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted lg:hidden"
      >
        <SlidersHorizontal size={18} />
      </button>

      <div
        className={cn(
          "flex flex-wrap items-end gap-3",
          "max-lg:absolute max-lg:left-0 max-lg:right-0 max-lg:top-full max-lg:z-50 max-lg:mt-2 max-lg:rounded-2xl max-lg:border max-lg:border-border max-lg:bg-card max-lg:p-4 max-lg:shadow-xl",
          !showFilter && "max-lg:hidden"
        )}
      >
        {fields.map(({ id, label, options, onChange, defaultValue }) => (
          <div key={id} className="flex min-w-[130px] flex-1 flex-col gap-1.5">
            <label
              htmlFor={id}
              className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              {label}
            </label>
            <select
              id={id}
              defaultValue={defaultValue}
              onChange={onChange ? (e) => onChange(e.target.value) : undefined}
              className="rounded-xl border border-border bg-input px-3 py-2 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-ring/30"
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={getVideos}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition hover:opacity-90"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default Filter;
