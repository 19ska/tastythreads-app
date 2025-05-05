import "./TabMenu.css";

type TabMenuProps = {
  selected: string;
  setSelected: (tab: string) => void;
  tabs?: string[];
};

const defaultTabs = ["Overview", "Menu", "Discussion"];

const TabMenu = ({ selected, setSelected, tabs = defaultTabs }: TabMenuProps) => (
  <div style={{
    display: "flex",
    borderBottom: "1px solid #ddd",
    marginBottom: 16,
    justifyContent: "space-around"
  }}>
    {tabs.map(tab => (
      <div
        key={tab}
        onClick={() => setSelected(tab)}
        style={{
          flex: 1,
          textAlign: "center",
          padding: "16px 0",
          cursor: "pointer",
          fontWeight: selected === tab ? "bold" : "normal",
          borderBottom: selected === tab ? "3px solid #2962ff" : "3px solid transparent",
          color: selected === tab ? "#222" : "#666",
          fontSize: 20
        }}
      >
        {tab}
      </div>
    ))}
  </div>
);

export default TabMenu;