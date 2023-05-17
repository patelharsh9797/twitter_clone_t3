import { type NextPage } from "next";
import InfiniteTweetList from "~/components/InfiniteTweetList";

import NewTweetForm from "~/components/NewTweetForm";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  return (
    <>
      <header className="sticky border-b p-4">
        <h1 className="text-2xl font-bold">Home</h1>
      </header>
      <main className="">
        <NewTweetForm />
        <RecentTweets />
      </main>
    </>
  );
};

function RecentTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}

export default Home;
