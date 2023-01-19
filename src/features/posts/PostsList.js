import { useSelector } from "react-redux";
import { selectPostIds, getPostStatus, postError } from "./PostSlice";
import PostsExcerpt from "./PostsExcerpt";



const PostsList = () => {
    // const dispatch = useDispatch();
    // const effectRan = useRef(false);

    const orderPostIds = useSelector(selectPostIds);
    const postStatus = useSelector(getPostStatus);
    const error = useSelector(postError);

    // useEffect(() => {
    //     console.log("useEffect started");
    //     if(effectRan.current === true) {
    //         console.log("useEffect middle");
    //         if(postStatus === "idle") {
    //             dispatch(fetchPosts());
    //         }
    //     }
    //     return () => {
    //         effectRan.current = true;
    //         console.log("useEffect cleanup");
    //     }
        
    // }, [postStatus, dispatch])

    let content;
    if(postStatus === 'loading') {
        content = <p>Loading...</p>
    } else if(postStatus === 'succeeded') {
        content = orderPostIds.map(postId => <PostsExcerpt key={postId} postId={postId} />)
    } else if (postStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section>
            {content}
        </section>
    )
}

export default PostsList;