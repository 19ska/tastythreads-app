// import "./Discussion.css";

// type DiscussionTabMenuProps = {
//   selected: string;
//   setSelected: (tab: string) => void;
//   tabs?: string[];
// };

// const defaultTabs = ["Overview", "Menu", "Discussion"];

// const DiscussionTabMenu = ({ selected, setSelected, tabs = defaultTabs }: DiscussionTabMenuProps) => (
//   <div style={{
//     display: "flex",
//     borderBottom: "1px solid #ddd",
//     marginBottom: 16,
//     justifyContent: "space-around"
//   }}>
//     {tabs.map(tab => (
//       <div
//         key={tab}
//         onClick={() => setSelected(tab)}
//         style={{
//           flex: 1,
//           textAlign: "center",
//           padding: "16px 0",
//           cursor: "pointer",
//           fontWeight: selected === tab ? "bold" : "normal",
//           borderBottom: selected === tab ? "3px solid #2962ff" : "3px solid transparent",
//           color: selected === tab ? "#222" : "#666",
//           fontSize: 20
//         }}
//       >
//         {tab}
//       </div>
//     ))}
//   </div>
// );

// export default DiscussionTabMenu;


import "./Discussion.css";

const DiscussionTabMenu = () => {
  return (
    <div className="discussion-container">
      {/* Overview Section */}
      <div className="tab-section overview">
        <h2>Overview</h2>
        <p>Overview content...</p>
      </div>

      {/* Discussion Section */}
      <div className="tab-section discussion">
        <h2>Discussion</h2>
        <p>Discussion content...</p>
      </div>

      {/* Menu Section */}
      <div className="tab-section menu">
        <h2>Menu</h2>
        <p>Menu content...</p>
      </div>
    </div>
  );
};

export default DiscussionTabMenu;
