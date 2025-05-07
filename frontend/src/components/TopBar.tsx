// src/components/TopBar.tsx

type TopBarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onLogout: () => void;
  onAddRestaurant: () => void;
};

const TopBar = ({ searchTerm, setSearchTerm, onLogout, onAddRestaurant }: TopBarProps) => {
  return (
    <div className="top-bar">
      <button onClick={onAddRestaurant}>Add Restaurant</button>
      <input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "6px", width: "200px" }}
      />
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default TopBar;