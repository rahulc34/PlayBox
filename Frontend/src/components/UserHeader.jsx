import { Plus } from "lucide-react";
import Button from "./ui/Button";

function UserHeader({
  count,
  title,
  isClose,
  actionLabel = "Create",
  onAction,
}) {
  const handleAction = onAction || (isClose ? () => isClose(true) : null);

  return (
    <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
      <h1 className="font-display text-xl font-bold text-foreground">
        {count != null && (
          <span className="mr-2 text-primary">{count}</span>
        )}
        {title}
      </h1>
      {handleAction && (
        <Button
          variant="primary"
          size="sm"
          onClick={handleAction}
          className="gap-1.5"
        >
          <Plus size={16} />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default UserHeader;
