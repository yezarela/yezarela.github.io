import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import styles from "./styles.module.css";
import BlogPostItem from "@theme/BlogPostItem";
import { BlogPostProvider } from "@docusaurus/plugin-content-blog/client";
import { useDateTimeFormat } from "@docusaurus/theme-common/internal";

function HomepageHeader() {
  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container col col--8 col--offset-2">
        <h1 className="hero__title">Hi, I'm Yesa</h1>
        <p className={clsx(styles.subtitle)}>
          I'm a software engineer who thrives on building full-stack solutions.
          I'm passionate about leveraging cloud infrastructure to create
          scalable and innovative applications. ☁️{" "}
        </p>

        <p className={clsx(styles.subtitle)}>
          Sometimes I write things.
          You can find my most recent articles below.
        </p>
      </div>
    </header>
  );
}

function RecentBlogPostCard({ recentPost, date }) {
  const { metadata } = recentPost;
  return (
    <article className={styles.postCard}>
      <header>
        <h2>
          <a href="/blog/optimizing-costs-of-google-kubernetes-engine">
            {metadata.title}
          </a>
        </h2>
        <div className="container_node_modules-@docusaurus-theme-classic-lib-theme-BlogPostItem-Header-Info-styles-module margin-vert--md">
          <time>{date}</time> ·{" " + Math.ceil(metadata.readingTime)} min read
        </div>
      </header>
    </article>
  );
}

export default function Home({ recentPosts }) {
  const { siteConfig } = useDocusaurusContext();
  const dateTimeFormat = useDateTimeFormat({
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const formatDate = (blogDate: string) =>
    dateTimeFormat.format(new Date(blogDate));

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main
        style={{ padding: 30, marginTop: 10 }}
        className="col col--6 col--offset-3"
      >
        <section>
          {recentPosts.map((recentPost, index) => (
            <RecentBlogPostCard
              key={index}
              recentPost={recentPost}
              date={formatDate(recentPost.metadata.frontMatter.date)}
            />
          ))}
          {/* {recentPosts.map(({ content: BlogPostContent }) => (
              <BlogPostProvider
                key={BlogPostContent.metadata.permalink}
                content={BlogPostContent}
              >
                <BlogPostItem>
                  <BlogPostContent />
                </BlogPostItem>
              </BlogPostProvider>
            ))} */}
        </section>
      </main>
    </Layout>
  );
}
