function CenterDiv({ children }) {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      {children}
    </div>
  );
}

export default CenterDiv;
