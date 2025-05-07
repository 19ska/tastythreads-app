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
