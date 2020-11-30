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
          <title>Public Safety Planning</title>
        </Head>

        <main>
          <h1 className={styles.title}>
            Public Safety Plans
          </h1>

          <div className="row">
            <Maker setPanelContent={setPanelContent} />
          </div>

          <div className="row about">
            <h5>About this visualization</h5>
            <p>This experiment follows the question: what if we started by understanding the harms and risks that people
            in Minneapolis face, and then proposed public safety policy proposals that addressed those harms? I'm a
            visual thinker, so I wanted to see plans like the
              {" "}<a href="https://docs.google.com/document/d/16-3SKF5E040Zax0nemxedPWRRsv3FJgStKO4s0lCeWw/edit" target="_blank">People's Budget</a>
              {" "}or <a href="https://beta.documentcloud.org/documents/20417659-2020-11-27-minneapolis-safety-for-all-budget-proposal" target="_blank">Safety For All</a>
              {" "}mapped out and related to the harms they hope to address.
            </p>
            <p>I took some liberties with shorter names for certain proposals, and major liberty in describing the harms
            these proposals address. If the harms listed here are incomplete or inaccurate, that's my fault, not the
            original authors. This is 100% an independent project.</p>
            <p>What would it look like if residents described the harms they face, and ideas for solutions that mitigate
            those harms? A future version of this experiment could allow visitors to modify and safe their own safety plans.</p>
          </div>
        </main>

        <footer className={styles.footer}>
          <a href="https://www.minneapolissafetydata.com">minneapolissafetydata.com</a>
        </footer>

      </div>
    </div>
  )
}
