import type { NextApiRequest, NextApiResponse } from 'next'

/// Fetches all relevant issues for the repository - Only required due to convention
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<number[]>
) {
  res.status(500).end()
}
