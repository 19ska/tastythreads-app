exports.getPostsByThread = async (req, res) => {
    const { threadId } = req.params;
    try {
      const posts = await Post.find({ threadId })
        .populate('createdBy', 'fullName')
        .lean();
  
      // Attach score manually for sorting
      const scoredPosts = posts.map(post => ({
        ...post,
        score: (post.upvotes?.length || 0) - (post.downvotes?.length || 0)
      }));
  
      // Sort descending by score
      scoredPosts.sort((a, b) => b.score - a.score);
  
      res.json(scoredPosts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  };

  