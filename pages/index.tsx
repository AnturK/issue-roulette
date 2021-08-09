import Head from 'next/head'
import { Octokit } from 'octokit'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import IssueDetail from './issue/[id]'
import { useState } from 'react'

export default function Home({ issues }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [chosenIssueNumber,setChosenIssueNumber] = useState(0)


  const rollRandomIssue = () =>{
    const chosen_number = Array.from(issues).sort(() => 0.5 - Math.random()).pop() || 0;
    setChosenIssueNumber(chosen_number)
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
          {chosenIssueNumber !== 0 && <IssueDetail id={chosenIssueNumber}/>}
        </div>
      </main>
    </div>
  )
}

export const getStaticProps = async(context : GetStaticPropsContext) => {
  //All issue list refreshed every 30 minutes.
  const default_repo = process.env.GITHUB_REPO || "tgstation"
  const default_owner = process.env.GITHUB_REPO_OWNER  || "tgstation"
  const api_key = process.env.GITHUB_API_KEY || "Missing API key"
  
  const octokit = new Octokit({auth:api_key});

  const all_valid_issues = await octokit.paginate(
    "GET /repos/{owner}/{repo}/issues",
    {
      owner: default_owner,
      repo: default_repo,
      state: 'open',
      labels: "Bug",
      per_page: 100,
    },
    (response) => response.data.map((issue) => issue.number)
  );

  return {
    props :{
      issues : all_valid_issues
    },
    revalidate: 30*60 //every 30 minutes
  }
}
