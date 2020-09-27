import Head from 'next/head'
import Maker from '../scenes/maker';
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Let's Make A Public Safety
        </h1>

        <Maker />
      </main>

      <footer className={styles.footer}>
        Good.
      </footer>
    </div>
  )
}
