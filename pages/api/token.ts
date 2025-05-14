import type { NextApiRequest, NextApiResponse } from 'next'

// Enable CORS
function allowCors(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    return await handler(req, res)
  }
}

// Main handler
const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const params = new URLSearchParams()
  params.append('grant_type', 'client_credentials')
  params.append('client_id', process.env.AZURE_AD_CLIENT_ID || '')
  params.append('client_secret', process.env.AZURE_AD_CLIENT_SECRET || '')
  params.append('resource', process.env.AZURE_RESOURCE || '') // or 'scope' for newer endpoints

  try {
    const response = await fetch(
      `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    )

    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error_description || 'Token fetch failed' })
    }

    return res.status(200).json({ token: data.access_token })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error })
  }
}

export default allowCors(handler)
