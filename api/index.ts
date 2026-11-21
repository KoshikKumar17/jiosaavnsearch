// Vercel entry (all routes are rewritten here by vercel.json)
import app from '../src/app.js'

export default { fetch: app.fetch }
