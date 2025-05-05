import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TabMenu from "../components/Discussion";


// --- Interfaces ---
interface MenuItem {
  name: string;
  price: number;
  description: string;
}

interface Reply {
  _id: string;
  reply: string;
  user: string;
}

interface ThreadItem {
  _id: string;
  post: string;
  user: string;
  imageUrl?: string;
  replies: Reply[];
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
  const [image, setImage] = useState<File | null>(null);
  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchThreads = () => {
    if (!id) return;
    fetch(`http://localhost:4000/api/restaurants/${id}/threads`)
      .then((res) => res.json())
      .then((data) => setThreads(data))
      .catch((err) => console.error("Failed to fetch threads:", err));
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:4000/api/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRestaurant({
          ...data,
          menu: data.menu || [],
          threads: data.threads || [],
        });
        fetchThreads();
      })
      .catch((err) => console.error("Error fetching restaurant:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePostThread = () => {
    if (!post.trim() || !id) return;

    const formData = new FormData();
    formData.append("post", post);
    formData.append("user", "You");
    if (image) formData.append("image", image);

    fetch(`http://localhost:4000/api/restaurants/${id}/threads`, {
      method: "POST",
      body: formData, // DO NOT add headers manually
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to post thread");
        return res.json();
      })
      .then(() => {
        setPost("");
        setImage(null);
        fetchThreads();
      })
      .catch((err) => console.error("Failed to post thread:", err));
  };

  const handleReply = (threadId: string, reply: string) => {
    if (!reply.trim() || !id) return;

    fetch(`http://localhost:4000/api/restaurants/${id}/threads/${threadId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply, user: "You" }),
    })
      .then((res) => res.json())
      .then(() => fetchThreads())
      .catch((err) => console.error("Failed to post reply:", err));
  };

  if (loading || !restaurant) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "1rem" }}>
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
          style={{
            width: "100%",
            maxHeight: 300,
            objectFit: "cover",
            borderRadius: 8,
            margin: "1em 0",
          }}
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
          {/* Thread post form */}
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImage(file);
              }}
              style={{ display: "block", marginBottom: "0.5rem" }}
            />

            <textarea
              value={post}
              onChange={(e) => setPost(e.target.value)}
              placeholder="Start a food thread..."
              rows={3}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                resize: "vertical",
              }}
            />

            <button
              onClick={handlePostThread}
              style={{
                marginTop: "0.5rem",
                padding: "8px 16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Post
            </button>
          </div>

          {/* Thread display */}
          {threads.map((t) => (
            <div
              key={t._id}
              style={{
                backgroundColor: "#2d2d2d",
                color: "white",
                padding: "15px",
                borderRadius: "6px",
                marginBottom: "1rem",
              }}
            >
              <strong>{t.post}</strong> — <em>{t.user}</em>

              {t.imageUrl && (
                <div style={{ marginTop: 10 }}>
                  <img
                    src={t.imageUrl}
                    alt="thread"
                    style={{ maxWidth: "100%", borderRadius: "8px" }}
                  />
                </div>
              )}

              <div style={{ marginTop: "10px" }}>
                {t.replies.map((r) => (
                  <div key={r._id} style={{ marginLeft: 20, marginTop: 6 }}>
                    ↳ {r.reply} — {r.user}
                  </div>
                ))}
              </div>

              <ReplyBox onReply={(reply) => handleReply(t._id, reply)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Reply Box Component ---
const ReplyBox = ({ onReply }: { onReply: (reply: string) => void }) => {
  const [reply, setReply] = useState("");

  return (
    <div style={{ marginTop: "10px" }}>
      <textarea
        rows={2}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Type your reply..."
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #777",
          backgroundColor: "#444",
          color: "white",
          resize: "vertical",
        }}
      />
      <button
        onClick={() => {
          onReply(reply);
          setReply("");
        }}
        style={{
          marginTop: "0.5rem",
          padding: "6px 14px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Reply
      </button>
    </div>
  );
};

export default RestaurantDetails;
