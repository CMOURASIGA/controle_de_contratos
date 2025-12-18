export default function PaginaCarregando() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-5 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="flex gap-4 border-b mb-6">
        <div className="h-8 w-28 bg-gray-200 rounded-t-md animate-pulse"></div>
        <div className="h-8 w-40 bg-gray-100 rounded-t-md animate-pulse"></div>
        <div className="h-8 w-32 bg-gray-100 rounded-t-md animate-pulse"></div>
        <div className="h-8 w-44 bg-gray-100 rounded-t-md animate-pulse"></div>
        <div className="h-8 w-36 bg-gray-100 rounded-t-md animate-pulse"></div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="h-6 w-40 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
        </div>

        <div>
          <div className="h-6 w-44 bg-gray-200 rounded mb-4 animate-pulse"></div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-2 h-10 bg-gray-100 rounded animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-10 w-16 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-10 w-16 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="h-6 w-20 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-6 w-28 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-6 w-20 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
