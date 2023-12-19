interface StarRatingProps {
  numStars: number;
}

const StarRating: React.FC<StarRatingProps> = ({ numStars }) => {
  const sanitizedNumStars = Math.max(1, Math.min(numStars, 5));
  const starsArray = Array.from(
    { length: sanitizedNumStars },
    (_, index) => index + 1
  );

  return (
    <div>
      {starsArray.map((starNumber) => (
        <img
          key={starNumber}
          width="25"
          height="25"
          src="https://img.icons8.com/3d-fluency/94/star.png"
          alt={`star ${starNumber}`}
        />
      ))}
    </div>
  );
};

export default StarRating;
