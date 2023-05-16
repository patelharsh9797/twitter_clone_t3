import { type NextPage } from "next";
import InfiniteTweetList from "~/components/InfiniteTweetList";

import NewTweetForm from "~/components/NewTweetForm";

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
  const tweets = [];

  return <InfiniteTweetList tweets={tweets} />;
}

export default Home;
