import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

import { wait } from "./utils/wait";

interface IPost {
  id: number;
  title: string;
}

const POSTS: IPost[] = [
  { id: 1, title: "Post 1" },
  { id: 2, title: "Post 2" },
];

const App = () => {
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(1000).then(() => [...POSTS]),
  });

  const postMutation = useMutation({
    mutationFn: (title: string) =>
      wait(1000).then(() =>
        POSTS.push({ id: POSTS[POSTS.length - 1].id + 1, title: title }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (postsQuery.isLoading) return <h1>Loading...</h1>;

  if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>;

  return (
    <div>
      {postsQuery.data.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button
        disabled={postMutation.isLoading}
        onClick={() => postMutation.mutate("new post")}
      >
        Create post
      </button>
    </div>
  );
};

export default App;
