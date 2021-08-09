import type { NextApiRequest, NextApiResponse } from 'next'
import { Octokit } from 'octokit'

/// Fetches single issue info
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<object>
) {
    const { number } = req.query
    const typed = number as unknown as number //Make this less nightmarish
    const default_repo = process.env.GITHUB_REPO || "tgstation"
    const default_owner = process.env.GITHUB_REPO_OWNER  || "tgstation"
    const api_key = process.env.GITHUB_API_KEY || "Missing API key"
    
    const octokit = new Octokit({auth:api_key});
    
    const chosen_issue = await octokit.rest.issues.get({owner:default_owner,repo:default_repo,issue_number:typed})

    res.status(200).json(chosen_issue.data)
}