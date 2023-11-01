import Head from "next/head";
import { Rubik } from "next/font/google";
import clsx from "clsx";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useEffect } from "react";

const font = Rubik({
  subsets: ["latin-ext"],
});

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const { req, res } = ctx;
  const cookieValue = req.cookies.token;
  console.log(cookieValue);
  return {
    props: {
      cookieToken: cookieValue,
    },
  };
};

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  useEffect(() => {
    document.cookie = `browserCookie=test; Path=/; Domain=vercel.app; HttpOnly; SameSite=None; Max-Age=31536000; Secure;`;
  }, []);
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={clsx(
          font.className,
          "flex min-h-screen flex-col items-center justify-center",
        )}
      >
        {`Cookie is - ${props.cookieToken}`}
      </main>
    </>
  );
}
