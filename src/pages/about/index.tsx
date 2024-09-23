import React from "react";
import Layout from "@theme/Layout";

export default function About() {
  return (
    <Layout>
      <main
        style={{ padding: 30, marginTop: 50 }}
        className="col col--6 col--offset-3"
      >
        <section>
          <div className="container">
            <h1 className="title">About Me</h1>
            <p className="subtitle">
              Hi, I'm Yesa 👋, I'm a software engineer with a full-stack
              toolkit. Whether it's crafting sleek mobile apps, building dynamic
              web interfaces, or architecting the backend magic that makes it
              all work, I'm in my element. I also love wrangling cloud
              infrastructure – it's like solving a giant puzzle! ☁️
            </p>
            <p className="subtitle">
              I've been in software engineering for over 8 years now. Currently,
              I'm a Staff Software Engineer, Platform at Gravel Technology,
              where I get to build the foundation for awesome things.
            </p>
            <p>
              I am open to all sorts of collaboration. Feel free to contact me
              via any channel listed below.
              <ul>
                <li>
                  Email:{" "}
                  <a href="mailto:yezarela@gmail.com">yezarela@gmail.com</a>
                </li>
                <li>
                  LinkedIn:{" "}
                  <a href="https://linkedin.com/in/yesarela-ritonga">
                    https://linkedin.com/in/yesarela-ritonga
                  </a>
                </li>
                <li>
                  Github:{" "}
                  <a href="https://github.com/yezarela">
                    https://github.com/yezarela
                  </a>
                </li>
                <li>
                  Medium:{" "}
                  <a href="https://medium.com/@yesaritonga">
                    https://medium.com/@yesaritonga
                  </a>
                </li>
              </ul>
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
