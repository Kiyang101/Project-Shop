import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
type Props = {
  rating: number; // product.rating (double)
};

export default function StarRating({ rating }: Props) {
  const totalStars = 5;

  return (
    <div className="flex items-center">
      {Array.from({ length: totalStars }, (_, index) => {
        const starNumber = index + 1;

        if (rating >= starNumber) {
          // Full star
          return (
            <span key={index} className="text-yellow-400 ">
              <FontAwesomeIcon
                icon={faStarSolid}
                className="text-amber-300 text-sm"
              />
            </span>
          );
        } else if (rating >= starNumber - 0.5) {
          // Half star
          return (
            <span key={index} className="text-yellow-400 ">
              <FontAwesomeIcon
                icon={faStarHalfStroke}
                className="text-amber-300 text-sm"
              />
            </span>
          );
        } else {
          // Empty star
          return (
            <span key={index} className="text-gray-300 ">
              <FontAwesomeIcon
                icon={faStarRegular}
                className="text-amber-300 text-sm"
              />
            </span>
          );
        }
      })}
      <span className="ml-2 text-md text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}
