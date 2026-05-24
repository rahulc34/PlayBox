function Error({ message }) {
  return (
    <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
      {message}
    </p>
  );
}

export default Error;
