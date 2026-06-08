export default function Loading() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center font-sans">
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-gray-200 dark:border-gray-800"></div>
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
        
        {/* Inner pulse dot */}
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-ping"></div>
      </div>
      <p className="mt-6 text-sm font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase animate-pulse">
        Sedang memuat...
      </p>
    </div>
  );
}
