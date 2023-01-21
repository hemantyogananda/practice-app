import { useState } from "react";
import { useSelector } from "react-redux";
import { selectPostById } from "./PostSlice";
import { useParams, useNavigate } from "react-router-dom";
import { selectAllUsers } from "../users/UserSlice";
import { useUpdatePostMutation, useDeletePostMutation } from "./PostSlice";

const EditPostForm = () => {
    const {postId} = useParams();
    const navigate = useNavigate();
    const [updatePost, {isLoading}] = useUpdatePostMutation();
    const [deletePost] = useDeletePostMutation();

    const post = useSelector((state) => selectPostById(state, Number(postId)));
    const users = useSelector(selectAllUsers);

    const [title,setTitle] = useState(post?.title)
    const [content,setContent] = useState(post?.body)
    const [userId,setUserId] = useState(post?.userId)

    if(!post) {
        return (
            <section>Post not found!</section>
        )
    }

    const onTitleChange = e => setTitle(e.target.value);
    const onContentChange = e => setContent(e.target.value);
    const onAuthorChange = e => setUserId(Number(e.target.value));

    const canSave = [title,content,userId].every(Boolean) && !isLoading

    const onSavePostClicked = async () => {
        if(canSave) {
            try {

                await updatePost( {id: post.id, title, body: content, userId}).unwrap()
                setTitle('');
                setContent('');
                setUserId('');
                navigate(`/post/${postId}`)
            } catch(err) {
                console.error("Failed to save the post", err);
            } 
        }
    }

    const userOptions = users.map(user => {
        return <option key={user.id} value={user.id}>
            {user.name}
        </option>
    })

    const onDeletePostClicked = async () => {
        try {

                await deletePost( {id: post.id}).unwrap()
                setTitle('');
                setContent('');
                setUserId('');
                navigate('/')
            } catch(err) {
                console.error("Failed to delete the post", err);
            }
    }

  return (
    <section>
        <h2>Edit Post</h2>
        <form>
            <label htmlFor="postTitle">Post Title : </label>
            <input type="text" id="postTitle" name="postTitle" value={title} onChange={onTitleChange} />
            <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChange}>
                    <option value=""></option>
                    {userOptions}
                </select>
            <label htmlFor="postContent">Post Content : </label>
            <textarea id="postContent" name="postContent" value={content} onChange={onContentChange} />
            <button type="button" onClick={onSavePostClicked} disabled={!canSave}>Save Post</button>
            <button className="deleteButton" type="button" onClick={onDeletePostClicked}>Delete Post</button>
        </form>
    </section>
  )
}

export default EditPostForm