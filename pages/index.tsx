import Head from 'next/head'
import next, { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import IssueDetail from './issue/[id]'
import { useState } from 'react'
import { request, gql } from 'graphql-request'

export type IssueInfo = {
  title: string,
  url: string,
  number: number
}

export default function Home({ issues }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [chosenIssue, setChosenIssue] = useState(undefined as unknown as IssueInfo)

  const rollRandomIssue = () => {
    const chosen = Array.from(issues).sort(() => 0.5 - Math.random()).pop() || undefined;
    if (chosen !== undefined)
      setChosenIssue(chosen)
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Issue Roulette</title>
        <meta name="description" content="Pick random issue to fix during the freeze." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-md w-full space-y-8">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Roll for issues.
        </h1>
        <div className="">
          <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={rollRandomIssue}>Roll</button>
        </div>
        <div className="">
          {chosenIssue !== undefined && <IssueDetail issue={chosenIssue} />}
        </div>
      </main>
    </div>
  )
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  //All issue list refreshed every 30 minutes.
  const default_repo = process.env.GITHUB_REPO || "tgstation"
  const default_owner = process.env.GITHUB_REPO_OWNER || "tgstation"
  const api_key = process.env.GITHUB_API_KEY || "Missing API key"

  const endpoint = 'https://api.github.com/graphql'

  // Grab all open issues with "Bug" label
  const query = gql`
  query GetIssues($page_cursor: String){
    repository(owner:"${default_owner}", name:"${default_repo}") {
      issues(states:OPEN,first:100,labels:"Bug",after:$page_cursor) {
        pageInfo{
          hasNextPage
          endCursor
        }
        edges {
          node {
            title
            url
            number
          }
        }
      }
    }
  }`

  type QueryData = {
    repository: {
      issues: {
        pageInfo: {
          hasNextPage: boolean,
          endCursor: string
        }
        edges: {
          node: IssueInfo
        }[]
      }
    }
  }

  const requestHeaders = {
    authorization: `bearer ${api_key}`
  }

  var filtered = [] as IssueInfo[]
  var has_next_page = false;
  var cursor = null as unknown as string;
  do {
    const variables = {
      page_cursor: cursor
    }
    const result = await request<QueryData>(endpoint, query, variables, requestHeaders)
    const data = result.repository.issues.edges.map(x => x.node)
    filtered.push(...data)
    has_next_page = result.repository.issues.pageInfo.hasNextPage
    cursor = result.repository.issues.pageInfo.endCursor
  } while (has_next_page)

  return {
    props: {
      issues: filtered
    },
    revalidate: 30 * 60 //every 30 minutes
  }
}
