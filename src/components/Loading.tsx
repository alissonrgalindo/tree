interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Loading tree..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <div className="text-gray-500 flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
        <span>{message}</span>
      </div>
    </div>
  );
}