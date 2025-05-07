import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./RestaurantDetails.css";

interface MenuItem {
  name: string;
  price: number;
  description: string;
}

interface Reply {
  _id: string;
  reply: string;
  user: string;
  userId?: string;
}

interface ThreadItem {
  _id: string;
  post: string;
  user: string;
  userId?: string;
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
  const [post, setPost] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const username = localStorage.getItem("username") || "Anonymous";
  const userId = localStorage.getItem("userId") || "";

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
        setRestaurant({ ...data, menu: data.menu || [], threads: data.threads || [] });
        fetchThreads();
      })
      .catch((err) => console.error("Error fetching restaurant:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePostThread = () => {
    if (!post.trim() || !id) return;
    const formData = new FormData();
    formData.append("post", post);
    formData.append("user", username);
    formData.append("userId", userId);
    if (image) formData.append("image", image);

    fetch(`http://localhost:4000/api/restaurants/${id}/threads`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to post thread");
        return res.json();
      })
      .then(() => {
        setPost("");
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchThreads();
      })
      .catch((err) => console.error("Failed to post thread:", err));
  };

  const handleReply = (threadId: string, reply: string) => {
    if (!reply.trim() || !id) return;

    fetch(`http://localhost:4000/api/restaurants/${id}/threads/${threadId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply, user: username, userId }),
    })
      .then((res) => res.json())
      .then(() => fetchThreads())
      .catch((err) => console.error("Failed to post reply:", err));
  };

  if (loading || !restaurant) return <div>Loading...</div>;

  return (
    <div className="restaurant-page">
      <div className="hero">
        {restaurant.menuPhotos?.[0] && (
          <img src={restaurant.menuPhotos[0]} alt={restaurant.name} />
        )}
        <h1>{restaurant.name}</h1>
        <p className="location-text">{restaurant.location}</p>
      </div>
  
      <div className="main-section">
        <div className="overview">
          <h2>About</h2>
          <p>{restaurant.overview}</p>
          <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
          <p><strong>Price Range:</strong> {restaurant.priceRange}</p>
        </div>
  
        <div className="discussion">
          <h2>Diner Discussions</h2>
  
          <div className="thread-input">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImage(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
            />
  
            {imagePreview && (
              <div>
                <img src={imagePreview} alt="Preview" />
                <button
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="cancel-btn"
                >
                  Cancel Upload
                </button>
              </div>
            )}
  
            <textarea
              placeholder="Start a discussion..."
              value={post}
              onChange={(e) => setPost(e.target.value)}
              rows={3}
            />
            <button onClick={handlePostThread}>Post</button>
          </div>
  
          {threads.map((t) => (
            <div key={t._id} className="thread-card">
              <strong>{t.post}</strong> — <em>{t.userId === userId ? "You" : t.user}</em>
              {t.imageUrl && <img src={t.imageUrl} alt="Thread" />}
              <div>
                {t.replies.map((r) => (
                  <div key={r._id} style={{ marginLeft: 20, marginTop: 6 }}>
                    ↳ {r.reply} — <em>{r.userId === userId ? "You" : r.user}</em>
                  </div>
                ))}
                <ReplyBox onReply={(reply) => handleReply(t._id, reply)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );    
};

const ReplyBox = ({ onReply }: { onReply: (reply: string) => void }) => {
  const [reply, setReply] = useState("");

  return (
    <div style={{ marginTop: "10px" }}>
      <textarea
        rows={2}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Type your reply..."
        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #777", backgroundColor: "#444", color: "white", resize: "vertical" }}
      />
      <div style={{ textAlign: "right" }}>
        <button
          onClick={() => {
            onReply(reply);
            setReply("");
          }}
          style={{ marginTop: "0.5rem", padding: "6px 14px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default RestaurantDetails;