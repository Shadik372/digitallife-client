export default function Loading({ fullScreen = false }) {
  const spinner = (
    <div className="w-10 h-10 rounded-full border-4 border-[--border] border-t-[--accent] animate-spin"></div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center w-full">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex justify-center p-8 w-full">
      {spinner}
    </div>
  );
}