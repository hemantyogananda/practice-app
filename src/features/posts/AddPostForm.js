import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


import { addNewPost } from "./PostSlice";
import { selectAllUsers } from "../users/UserSlice";

const AddPostForm = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');
    const [addRequestStatus, setAddRequestStatus] = useState('idle');
    
    const users = useSelector(selectAllUsers);
    const onTitleChange = e => setTitle(e.target.value);
    const onContentChange = e => setContent(e.target.value);
    const onAuthorChange = e => setUserId(e.target.value);
    
    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';
    
    const onSavePostClicked = () => {
        if(canSave) {
            try {
                setAddRequestStatus('pending')
                dispatch( addNewPost( {title, body: content, userId})).unwrap()
                setTitle('');
                setContent('');
                setUserId('');
                navigate('/');
            } catch(err) {
                console.error("Failed to save the post", err);
            } finally {
                setAddRequestStatus('idle');
            }
        }
    }


    const userOptions = users.map(user => {
        return <option key={user.id} value={user.id}>
            {user.name}
        </option>
    })
    console.log(userOptions);

  return (
    <section>
        <h2>Add a New Post</h2>
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
        </form>
    </section>
  )
}

export default AddPostForm;