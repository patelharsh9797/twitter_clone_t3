import { type NextPage } from "next";

import NewTweetForm from "~/components/NewTweetForm";

const Home: NextPage = () => {
  return (
    <>
      <header className="sticky border-b p-4">
        <h1 className="text-2xl font-bold">Home</h1>
      </header>
      <main className="">
        <NewTweetForm />
      </main>
    </>
  );
};

export default Home;
