import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import InfiniteTweetList from "~/components/InfiniteTweetList";

const TABS = ["Recent", "Following"] as const;

import NewTweetForm from "~/components/NewTweetForm";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Recent");

  const session = useSession();
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white p-4 dark:bg-black">
        <h1 className="text-2xl font-bold">Home</h1>
        {session.status === "authenticated" && (
          <div className="flex pt-2">
            {TABS.map((tab) => {
              return (
                <button
                  key={tab}
                  className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 dark:hover:bg-slate-800 dark:focus-visible:bg-slate-800 ${
                    tab === selectedTab
                      ? "border-b-4 border-b-blue-500 font-bold"
                      : ""
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}
      </header>
      <main>
        <NewTweetForm />
        {selectedTab === "Recent" ? <RecentTweets /> : <FollowingTweets />}
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
      hasMore={tweets.hasNextPage || false}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}

function FollowingTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: true },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage || false}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}

export default Home;
