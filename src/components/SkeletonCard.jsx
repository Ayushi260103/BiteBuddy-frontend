export function OrderSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 space-y-5 animate-pulse">
      
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>

      <div className="flex gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-40 shrink-0 space-y-2">
            <div className="h-24 bg-gray-200 rounded-lg" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-3 border-t">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-8 w-28 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
