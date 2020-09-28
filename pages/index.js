import Head from 'next/head'
import Maker from '../scenes/maker';
import styles from '../styles/Home.module.css'
import Panel from "../shared/Panel";
import React, {useState} from "react";

export default function Home() {
  const [panelContent, setPanelContent] = useState(null);
  const closePanel = () => setPanelContent(null);

  return (
    <div>
      <Panel content={panelContent} closePanel={closePanel} />

      <div className="container">
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <h1 className={styles.title}>
            Let's Make A Public Safety
          </h1>

          <Maker setPanelContent={setPanelContent} />
        </main>

        <footer className={styles.footer}>
          Good.
        </footer>

      </div>
    </div>
  )
}
