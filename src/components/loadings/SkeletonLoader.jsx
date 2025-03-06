import PropTypes from "prop-types";

export const SkeletonCard = ({
  skeletonColor = "bg-gray-500",
  linesOnly = false,
}) => (
  <div className="flex w-52 flex-col gap-4">
    {/* Render the image placeholder only if linesOnly is false */}
    {!linesOnly && (
      <div className={`${skeletonColor} h-32 w-full animate-pulse`}></div>
    )}
    {/* For lines-only variant, increase width by 20% (from 7rem to 8.4rem) */}
    <div
      className={`${skeletonColor} h-4 animate-pulse`}
      style={{ width: linesOnly ? "8.4rem" : "7rem" }}
    ></div>
    <div className={`${skeletonColor} h-4 w-full animate-pulse`}></div>
    <div className={`${skeletonColor} h-4 w-full animate-pulse`}></div>
  </div>
);

SkeletonCard.propTypes = {
  skeletonColor: PropTypes.string,
  linesOnly: PropTypes.bool,
};

const SkeletonLoader = ({ count = 6, skeletonColor, linesOnly = false }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard
          key={idx}
          skeletonColor={skeletonColor}
          linesOnly={linesOnly}
        />
      ))}
    </div>
  );
};

SkeletonLoader.propTypes = {
  count: PropTypes.number,
  skeletonColor: PropTypes.string,
  linesOnly: PropTypes.bool,
};

export default SkeletonLoader;

//
