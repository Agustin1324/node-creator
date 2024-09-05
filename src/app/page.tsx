import Head from 'next/head'
import FlowEditor from '@/components/FlowEditor'

export default function Home() {
  return (
    <>
      <Head>
        <title>Reactflow Test</title>
        <meta name="description" content="Reactflow custom node editor and generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <FlowEditor />
      </main>
    </>
  )
}