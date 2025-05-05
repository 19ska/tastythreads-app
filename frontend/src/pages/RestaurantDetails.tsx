import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TabMenu from "../components/TabMenu";

interface MenuItem {
  name: string;
  price: number;
  description: string;
}

interface ThreadItem {
  post: string;
  user: string;
  replies: { reply: string; user: string }[];
}

interface Restaurant {
  _id: string;
  name: string;
  location?: string;
  cuisine?: string;
  priceRange?: string;
  overview?: string;
  menuPhotos?: string[];
  menu?: MenuItem[];
  threads?: ThreadItem[];
}

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [post, setPost] = useState("");
  const [threads, setThreads] = useState<ThreadItem[]>([]);

  useEffect(() => {
    if (!id) {
      console.warn("No restaurant ID in URL");
      return;
    }

    console.log("Fetching restaurant with ID:", id);

    fetch(`http://localhost:4000/api/restaurants/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch restaurant");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched restaurant data:", data);
        setRestaurant({
          ...data,
          menu: data.menu || [],
          threads: data.threads || [],
        });
      })
      .catch((err) => {
        console.error("Error fetching restaurant:", err);
      });

    fetch(`http://localhost:4000/api/restaurants/${id}/threads`)
      .then((res) => res.json())
      .then((data) => setThreads(data));
  }, [id]);

  if (!restaurant) return <div>Loading...</div>;

  const handlePostThread = () => {
    if (!post.trim() || !id) return;
    fetch(`http://localhost:4000/api/restaurants/${id}/threads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post, user: "You" }),
    })
      .then(() => {
        setPost("");
        fetch(`http://localhost:4000/api/restaurants/${id}/threads`)
          .then((res) => res.json())
          .then((data) => setThreads(data));
      });
  };

  const handleReply = (threadId: string, reply: string) => {
    if (!reply.trim() || !id) return;
    fetch(`http://localhost:4000/api/restaurants/${id}/threads/${threadId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply, user: "You" }),
    })
      .then(() => {
        fetch(`http://localhost:4000/api/restaurants/${id}/threads`)
          .then((res) => res.json())
          .then((data) => setThreads(data));
      });
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>{restaurant.name}</h1>
      <div style={{ textAlign: "center", color: "#666" }}>
        {restaurant.location && <div>{restaurant.location}</div>}
        {restaurant.cuisine && <div>{restaurant.cuisine}</div>}
        {restaurant.priceRange && <div>{restaurant.priceRange}</div>}
      </div>

      {restaurant.menuPhotos?.[0] && (
        <img
          src={restaurant.menuPhotos[0]}
          alt={restaurant.name}
          style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 8, margin: "1em 0" }}
        />
      )}

      <TabMenu selected={selectedTab} setSelected={setSelectedTab} />

      {selectedTab === "Overview" && <p>{restaurant.overview}</p>}

      {selectedTab === "Menu" && (
        <ul>
          {(restaurant.menu || []).map((item, i) => (
            <li key={i}>
              <strong>{item.name}</strong> - ${item.price}
              <br />
              {item.description}
            </li>
          ))}
        </ul>
      )}

      {selectedTab === "Discussion" && (
        <div>
          <input
            value={post}
            onChange={(e) => setPost(e.target.value)}
            placeholder="Start a food thread..."
          />
          <button onClick={handlePostThread}>Post</button>

          {threads.map((t) => (
            <div key={t._id}>
              <strong>{t.post}</strong> — <em>{t.user}</em>
              {t.replies.map((r) => (
                <div key={r._id} style={{ marginLeft: 20 }}>
                  ↳ {r.reply} — {r.user}
                </div>
              ))}
              <ReplyBox onReply={(reply) => handleReply(t._id!, reply)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ReplyBox = ({ onReply }: { onReply: (reply: string) => void }) => {
  const [reply, setReply] = useState("");
  return (
    <div>
      <input
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Type your reply..."
      />
      <button onClick={() => { onReply(reply); setReply(""); }}>Reply</button>
    </div>
  );
};

export default RestaurantDetails;
