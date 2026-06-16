type CommentWithUser = {
    userId: string;
    content: string;
    id: string;
    parentId: string | null;
    user: {
      id: string;
      username: string;
      imageUrl: string | null;
      fullName: string;
    };
};


export type NestedComment = CommentWithUser & {
    replies: NestedComment[];
};

export const buildCommentTree =(comments: CommentWithUser[]) => {
    const commentMap: Record<string, NestedComment> = {};

    comments.forEach(comment => {
     commentMap[comment.id] = {...comment, replies: []};   
    });

    const roots: NestedComment[] = [];

    comments.forEach(comment => {
        const mappedComment = commentMap[comment.id];

        if (mappedComment.parentId === null) {
            roots.push(mappedComment);
        } else {
            const parent = commentMap[mappedComment.parentId];
            if(parent) parent.replies.push(mappedComment);
        }
    })

    return roots;
}

