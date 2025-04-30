import "./RestaurantCard.css";

type Props = {
    name: string;
    image: string;
    description: string;
  };
  
  const RestaurantCard = ({ name, image, description }: Props) => {
    return (
      <div className="card">
        <img src={image} alt={name} className="card-img" />
        <div className="card-body">
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
      </div>
    );
  };
  
  export default RestaurantCard;