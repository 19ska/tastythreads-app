import "./RestaurantCard.css";

type Props = {
  name: string;
  image?: string; // optional because sometimes menuPhotos might be missing
  description: string;
};

const RestaurantCard = ({ name, image, description }: Props) => {
  return (
    <div className="card">
      {image ? (
        <img src={image} alt={name} className="card-img" />
      ) : (
        <div className="card-img placeholder">No Image</div>
      )}
      <div className="card-body">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;
