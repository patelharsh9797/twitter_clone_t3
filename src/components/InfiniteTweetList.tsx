import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingPage, LoadingSpinner } from "./Loading";

type Tweet = {
  id: string;
  content: string;
  cratedAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; name: string | null; image: string | null };
};

type InfiniteTweetListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  fetchNewTweets: () => Promise<unknown>;
  tweets?: Tweet[];
};

const InfiniteTweetList = ({
  tweets,
  isError,
  isLoading,
  fetchNewTweets,
  hasMore,
}: InfiniteTweetListProps) => {
  if (isLoading) return <LoadingPage />;

  if (isError) return <div>Error....</div>;

  if (tweets == null || tweets.length == 0)
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">
        No Tweets Found.
      </h2>
    );

  return (
    <ul>
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={hasMore}
        loader={<LoadingSpinner size={60} />}
      >
        {tweets.map((tweet) => {
          return <div key={tweet.id}>{tweet.content}</div>;
        })}
      </InfiniteScroll>
    </ul>
  );
};

export default InfiniteTweetList;
