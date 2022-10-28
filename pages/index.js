import { collection, doc, onSnapshot, query } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Post from "../components/Post";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/home.module.css";
import { db } from "../utils/firebase";

const { hommeWrapper } = styles;

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);

  const { user } = useContext(AuthContext);
  const route = useRouter();

  useEffect(() => {
    // Get all posts
    const unsubscribe = onSnapshot(
      collection(db, "posts"),
      snapShot => {
        let posts = [];
        snapShot.forEach(doc => {
          posts.push({ ...doc.data(), id: doc.id });
          setAllPosts(posts);
        });
      },
      error => {
        console.log(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <div>
      <Head>
        <title>Creative Minds</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={hommeWrapper}>
        <span className="h5">See what people are saying</span>
        <div className="d-flex flex-column mt-2">
          {allPosts
            ?.sort((a, b) => b.date - a.date)
            .map((post, index) => (
              <Post key={index} post={post}>
                <Link href={{ pathname: `/${post.id}`, query: post }}>
                  <span className="mt-4 pointer text-decoration-underline">
                    {post.comments.length}
                    {+post.comments.length === 1 ? " comment" : " comments"}
                  </span>
                </Link>
              </Post>
            ))}
        </div>
      </div>
    </div>
  );
}
