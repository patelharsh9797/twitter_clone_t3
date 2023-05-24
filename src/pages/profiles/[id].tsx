import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { ssgHelper } from "~/server/helpers/ssghelper";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import Link from "next/link";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { VscArrowLeft } from "react-icons/vsc";
import ProfileImage from "~/components/ProfileImage";
import InfiniteTweetList from "~/components/InfiniteTweetList";
import Button from "~/components/Button";
import { useSession } from "next-auth/react";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const { data: profile } = api.profile.getById.useQuery({ id });
  const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const trpcUtils = api.useContext();
  const { mutate, isLoading } = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      trpcUtils.profile.getById.setData({ id }, (oldData) => {
        if (oldData == null) return;

        const countModifier = addedFollow ? 1 : -1;
        
        return {
          ...oldData,
          isFollowing:addedFollow,
          followersCount: oldData.followersCount + countModifier
        }
      });
    },
  });

  if (profile == null || profile.name == null)
    return <ErrorPage statusCode={404} />;
  return (
    <>
      <Head>
        <title>{`${profile.name} Profile`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b bg-white p-4 dark:bg-black">
        <Link href=".." className="mr-2">
          <IconHoverEffect>
            <VscArrowLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={profile.image} className="flex-shrink-0" />
        <div className="flex-grow">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <div className="flex gap-4 text-gray-500">
            <span>
              {profile.tweetsCount}{" "}
              {getPlural(profile.tweetsCount, "Tweet", "Tweets")}
            </span>
            <span>
              {profile.followersCount}{" "}
              {getPlural(profile.followersCount, "Follower", "Followers")}
            </span>
            <span>{profile.followsCount} Following</span>
          </div>
        </div>
        <div>
          <FollowButton
            isFollowing={profile.isFollowing}
            isLoading={isLoading}
            userId={id}
            onClick={() => mutate({ userId: id })}
          />
        </div>
      </header>
      <main>
        <InfiniteTweetList
          tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
          isError={tweets.isError}
          isLoading={tweets.isLoading}
          hasMore={tweets.hasNextPage || false}
          fetchNewTweets={tweets.fetchNextPage}
        />
      </main>
    </>
  );
};

const pluralRules = new Intl.PluralRules();
function getPlural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) === "one" ? singular : plural;
}

function FollowButton({
  isFollowing,
  isLoading,
  userId,
  onClick,
}: {
  isFollowing: boolean;
  isLoading: boolean;
  userId: string;
  onClick: () => void;
}) {
  const ses = useSession();

  if (ses.status !== "authenticated" || ses.data.user.id === userId)
    return null;

  return (
    <Button disabled={isLoading} onClick={onClick} gray={isFollowing}>
      {!isFollowing ? "Follow" : "Unfollow"}
    </Button>
  );
}

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;

  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
