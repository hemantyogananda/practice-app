import { useAddReactionMutation } from "./PostSlice";
import { useRef } from "react";

const reactionEmoji = {
    thumbsUp: '👍',
    wow: '😮',
    heart: '❤️',
    rocket: '🚀',
    coffee: '☕'
}

const ReactionButton = ({post}) => {
  const [addReaction] = useAddReactionMutation();
  const effectRan = useRef(false);

  const reactionButtons = Object.entries(reactionEmoji).map(([name,emoji]) => {
    return (
        <button
            key = {name}
            type="button"
            className="reactionButton"
            onClick={() => {
                if(effectRan.current === false) {
                    const newValue = post.reactions[name] + 1;
                    addReaction({ postId: post.id, reactions: {...post.reactions, [name]: newValue}})
                    }
                }
            }
        >
            {emoji} {post.reactions[name]}
        </button>
    )
  })
  

  return <div> {reactionButtons}</div>
  

}

export default ReactionButton;