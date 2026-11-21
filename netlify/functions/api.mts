// Netlify entry (Functions v2, handles every path)
import app from '../../src/app.js'

export default async (req: Request) => app.fetch(req)

export const config = { path: '/*' }
