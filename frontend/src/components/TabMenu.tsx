import "./TabMenu.css";

const tabs = ["Recommended", "All"];

const TabMenu = ({ selected, setSelected }: any) => {
  return (
    <div className="tab-menu">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={selected === tab ? "active" : ""}
          onClick={() => setSelected(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabMenu;