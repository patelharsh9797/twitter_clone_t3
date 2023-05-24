import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";
import { useState } from "react";

import "~/styles/globals.css";
import Head from "next/head";

import SideNave from "~/components/SideNav";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  return (
    <SessionProvider session={session}>
      <div className={darkMode ? "dark" : ""}>
        <Head>
          <title>Twitter Clone | T3 Stack</title>
          <meta name="description" content="Twitter clone using the T3 Stack" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="dark:bg-black dark:text-slate-100">
          <div className="container mx-auto flex items-start sm:pr-4">
            <SideNave darkMode={darkMode} setDarkMode={setDarkMode} />
            <div className="h-screen flex-grow overflow-y-auto border-x">
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
