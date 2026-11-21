import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { homeHtml } from './pages/home.js'
import { docsHtml } from './pages/docs.js'
import { HttpExceptionError } from './exceptions/http.exception.js'
import { SearchService } from './services/search.service.js'
import { SongsService } from './services/songs.service.js'
import { AlbumsService } from './services/albums.service.js'
import { ArtistsService } from './services/artists.service.js'
import { PlaylistsService } from './services/playlists.service.js'
import { LyricsService } from './services/lyrics.service.js'
import { ModulesService } from './services/modules.service.js'
import type { Context } from 'hono'

const app = new Hono()

const ok = (c: Context, data: unknown) => c.json({ status: 'SUCCESS', message: null, data })

const required = (value: string | undefined, name: string) => {
  if (!value) throw new HttpExceptionError(400, `${name} is required`)
  return value
}

// extract token from a jiosaavn link: https://www.jiosaavn.com/<type>/<slug>/<token>
const tokenFromLink = (link: string, type: 'song' | 'album' | 'artist') => {
  if (!link.includes(`jiosaavn.com/${type}/`)) throw new HttpExceptionError(400, `invalid ${type} link`)
  return link.split(`${type}/`)[1].split('/')[1].slice(0, 11)
}

const idOrLink = (c: Context, type: 'song' | 'album' | 'artist') => {
  const id = c.req.query('id')
  const link = c.req.query('link')
  if ((id && link) || (!id && !link)) {
    throw new HttpExceptionError(400, 'id and link are not supported together, pass only one of them')
  }
  return { id, link: link ? tokenFromLink(link, type) : undefined }
}

const searchParams = (c: Context) => ({
  query: required(c.req.query('query'), 'query'),
  page: Number(c.req.query('page') ?? 1),
  limit: Number(c.req.query('limit') ?? 10),
})

app.use('*', cors())
app.use('*', async (c, next) => {
  await next()
  c.header('Cache-Control', 's-maxage=300, stale-while-revalidate')
})

app.get('/', (c) => c.html(homeHtml()))
app.get('/docs', (c) => c.html(docsHtml()))
app.get('/health', (c) => c.json({ status: 'SUCCESS', message: 'ok', data: null }))

// search
app.get('/search/all', async (c) => ok(c, await new SearchService().all(required(c.req.query('query'), 'query'))))
app.get('/search/songs', async (c) => {
  const { query, page, limit } = searchParams(c)
  return ok(c, await new SearchService().songs(query, page, limit))
})
app.get('/search/albums', async (c) => {
  const { query, page, limit } = searchParams(c)
  return ok(c, await new SearchService().albums(query, page, limit))
})
app.get('/search/playlists', async (c) => {
  const { query, page, limit } = searchParams(c)
  return ok(c, await new SearchService().playlists(query, page, limit))
})
app.get('/search/artists', async (c) => {
  const { query, page, limit } = searchParams(c)
  return ok(c, await new SearchService().artists(query, page, limit))
})

// songs
app.get('/songs', async (c) => {
  const { id, link } = idOrLink(c, 'song')
  const s = new SongsService()
  return ok(c, id ? await s.detailsById(id) : await s.detailsByLink(link as string))
})

// albums
app.get('/albums', async (c) => {
  const { id, link } = idOrLink(c, 'album')
  const s = new AlbumsService()
  return ok(c, id ? await s.detailsById(id) : await s.detailsByLink(link as string))
})

// artists
app.get('/artists', async (c) => {
  const { id, link } = idOrLink(c, 'artist')
  const s = new ArtistsService()
  return ok(c, id ? await s.detailsById(id) : await s.detailsByLink(link as string))
})
const listParams = (c: Context) => {
  const category = c.req.query('category')
  const sort = c.req.query('sort')
  if (category && !['alphabetical', 'latest'].includes(category)) throw new HttpExceptionError(400, 'invalid category')
  if (sort && !['asc', 'desc'].includes(sort)) throw new HttpExceptionError(400, 'invalid sort')
  return { page: Number(c.req.query('page') ?? 1), category: category as string, sort: sort as string }
}
app.get('/artists/:artistId/songs', async (c) => {
  const { page, category, sort } = listParams(c)
  return ok(c, await new ArtistsService().artistSongs(c.req.param('artistId'), page, category, sort))
})
app.get('/artists/:artistId/albums', async (c) => {
  const { page, category, sort } = listParams(c)
  return ok(c, await new ArtistsService().artistAlbums(c.req.param('artistId'), page, category, sort))
})
app.get('/artists/:artistId/recommendations/:songId', async (c) =>
  ok(
    c,
    await new ArtistsService().artistTopSongs(
      c.req.param('artistId'),
      c.req.param('songId'),
      c.req.query('language') ?? 'english'
    )
  )
)

// playlists, lyrics, modules
app.get('/playlists', async (c) => ok(c, await new PlaylistsService().detailsById(required(c.req.query('id'), 'id'))))
app.get('/lyrics', async (c) => ok(c, await new LyricsService().songLyrics(required(c.req.query('id'), 'id'))))
app.get('/modules', async (c) => ok(c, await new ModulesService().modules(c.req.query('language') ?? 'english')))

app.notFound((c) =>
  c.json({ status: 'FAILED', message: 'route not found, see /docs for the API documentation', data: null }, 404)
)

app.onError((err, c) => {
  const status = (err instanceof HttpExceptionError ? err.status : 500) as 400 | 404 | 429 | 500 | 503
  console.error(`[${c.req.method}] ${c.req.path} || ${status} ${err.message}`)
  return c.json({ status: 'FAILED', message: err.message || 'Something went wrong', data: null }, status)
})

export default app
