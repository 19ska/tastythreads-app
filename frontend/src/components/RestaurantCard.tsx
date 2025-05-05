import { Link } from "react-router-dom";
import "./RestaurantCard.css";

type Props = {
  _id: string;
  name: string;
  image: string;
  description: string;
};

const RestaurantCard = ({ _id, name, image, description }: Props) => {
  return (
    <Link to={`/restaurants/${_id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="card">
        <img src={image} alt={name} className="card-img" />
        <div className="card-body">
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;