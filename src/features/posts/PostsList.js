import { useSelector } from "react-redux";
import { selectPostIds, useGetPostsQuery } from "./PostSlice";
import PostsExcerpt from "./PostsExcerpt";



const PostsList = () => {
    const {
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery()

    const orderPostIds = useSelector(selectPostIds);

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
    if(isLoading) {
        content = <p>Loading...</p>
    } else if(isSuccess) {
        content = orderPostIds.map(postId => <PostsExcerpt key={postId} postId={postId} />)
    } else if (isError) {
        content = <p>{error}</p>
    }

    return (
        <section>
            {content}
        </section>
    )
}

export default PostsList;