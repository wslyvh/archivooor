import fetch from 'cross-fetch'

export async function Redeploy() {
  if (process.env.VERCEL_DEPLOY_KEY === undefined) throw new Error('VERCEL_DEPLOY_KEY not set')

  const result = await fetch(`https://api.vercel.com/v1/integrations/deploy/${process.env.VERCEL_DEPLOY_KEY}`, {
    method: 'POST',
  })
  const data = await result.json()
  await new Promise((r) => setTimeout(r, 60000))
}
