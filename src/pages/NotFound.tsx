const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-3xl font-bold">404 - Not Found</h1>
      <p className="mt-4 text-lg">The page you are looking for does not exist.</p>
      <p className="mt-6">Go back <a href="/" className="underline"> home</a></p>
    </div>
  );
};

export default NotFound;
