import Head from "next/head"
import React from "react"
import styles from "../../styles/Home.module.css"
import { ErrorStateBackground, ErrorStateText, Footer } from "../atoms"

type LayoutProps = {
  copyright?: string
  scriptTrackingUrl?: string
  errorTitle?: string
  errorText: string
  children?: React.ReactNode
}
export const Layout = ({ children, copyright, errorTitle, errorText, scriptTrackingUrl }: LayoutProps) => {
  const showChildren = !errorTitle && !errorText
  return (
    <div className={styles.body}>
      <Head>
        <title>Audius Live Lyrics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
      {errorTitle || errorText && (
        <>
          <ErrorStateBackground />
          <ErrorStateText errorTitle={errorTitle} text={errorText} />
        </>
      )}
      {showChildren && children}
      <Footer copyright={copyright}/>
      {scriptTrackingUrl && <script type="text/javascript" src={scriptTrackingUrl} /> }
    </div>
  </div>
  )
}