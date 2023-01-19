import { useSelector } from "react-redux";
import { selectPostById } from "./PostSlice";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor"
import TimeAgo from "./TimeAgo";
import ReactionButton from "./ReactionButton";

const SinglePostPage = () => {

    const {postId} = useParams();

    const post = useSelector((state) =>selectPostById(state, Number(postId)));

    if(!post) {
        return <section>
            <h2>Post not found</h2>
        </section>
    }


  return (
    <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <p className="postCredit">
                <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
                <PostAuthor userId={post.userId}></PostAuthor>
                <TimeAgo timeStamp={post.date}></TimeAgo>
            </p>
            <ReactionButton post={post}/>
        </article>
  )
}

export default SinglePostPage