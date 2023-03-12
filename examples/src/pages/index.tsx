import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const ExampleLink = ({
  href,
  title,
  description
}: { href: string; title: string; description: string }) => {
  return <Link href={href}>
    <div className="text-2xl">{title}</div>
    <div className="text-sm">{description}</div>
  </Link>
}

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Signal Examples</title>
        <meta name="description" content="Signals by Natalie Basille" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/a11y-dark.css" />
      </Head>
      <main className="container m-8">
        <h1 className="text-4xl text-secondary">Basic</h1>
        <div className="flex flex-col gap-2 mt-2">
          <ExampleLink href="/counter" title="Counter" description="See how a react component using useState is rendered vs one that uses signals" />
        </div>
        <div className="divider" />
        <h1 className="text-4xl text-secondary">Advance</h1>
        <div className="flex flex-col gap-2 mt-2">
          <ExampleLink href="/clock" title="Clock" description="" />
        </div>
      </main>
    </>
  );
};

export default Home;
