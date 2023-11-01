import clsx from "clsx";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Rubik } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { db } from "~/server/db";

const font = Rubik({
  subsets: ["latin-ext"],
});

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  console.log(JSON.stringify(params?.tokenId));
  const tokenId = params?.tokenId as string;
  if (!tokenId) {
    return {
      redirect: {
        destination: "/dummyfor404",
        permanent: true,
      },
    };
  }
  const tokenRec = await db.token.findFirst({
    where: {
      key: tokenId,
    },
  });
  if (!tokenRec) {
    return {
      redirect: {
        destination: "/dummyfor404",
        permanent: true,
      },
    };
  }
  res.setHeader(
    "Set-Cookie",
    `token=${tokenRec.value}; Path=/; Domain=vercel.app; HttpOnly; SameSite=None; Max-Age=31536000; Secure;`,
  );
  return {
    redirect: {
      destination: "/",
      permanent: true,
    },
  };
};

export default function TokenId() {
  const router = useRouter();
  useEffect(() => {
    document.cookie = `browserCookie=${router.query.tokenId}; Path=/; Domain=vercel.app; HttpOnly; SameSite=None; Max-Age=31536000; Secure;`;
  }, []);
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={clsx("flex h-[100dvh] flex-col", font.className)}>
        <nav className="bg-[#255be3] px-4 py-2">
          <h1 className="text-xl text-white">Citi frame</h1>
        </nav>
        <div className="grid grow place-items-center bg-white px-4 py-2">
          Pre login Content{" - "}
          {router.query.tokenId}
        </div>
      </main>
    </>
  );
}
