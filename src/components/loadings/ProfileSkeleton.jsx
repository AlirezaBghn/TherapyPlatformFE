const ProfileSkeleton = () => {
  return (
    <div className="flex w-52 flex-col gap-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="skeleton h-16 w-16 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="flex flex-col gap-2">
          <div className="skeleton h-4 w-20 bg-gray-300 dark:bg-gray-600"></div>
          <div className="skeleton h-4 w-28 bg-gray-300 dark:bg-gray-600"></div>
        </div>
      </div>
      <div className="skeleton h-32 w-full bg-gray-300 dark:bg-gray-600"></div>
    </div>
  );
};

export default ProfileSkeleton;
