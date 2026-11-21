export interface Param {
  name: string
  in: 'query' | 'path'
  required?: boolean
  default?: string
  description: string
  example?: string
  options?: string[]
}

export interface EndpointDoc {
  group: string
  method: 'GET'
  path: string
  title: string
  description: string
  params: Param[]
}

const pagination: Param[] = [
  { name: 'page', in: 'query', default: '1', description: 'Page number.', example: '1' },
  { name: 'limit', in: 'query', default: '10', description: 'Results per page.', example: '10' },
]

const idOrLink = (type: string, id: string, link: string): Param[] => [
  { name: 'id', in: 'query', description: `${type} id. Use either id or link, not both.`, example: id },
  { name: 'link', in: 'query', description: `Full jiosaavn.com ${type} URL. Use either id or link, not both.`, example: link },
]

const listParams: Param[] = [
  { name: 'page', in: 'query', default: '1', description: 'Page number.', example: '1' },
  { name: 'category', in: 'query', description: 'Sort category.', options: ['', 'latest', 'alphabetical'] },
  { name: 'sort', in: 'query', description: 'Sort order.', options: ['', 'asc', 'desc'] },
]

export const endpoints: EndpointDoc[] = [
  {
    group: 'Search',
    method: 'GET',
    path: '/search/all',
    title: 'Search everything',
    description: 'Search songs, albums, artists, playlists and top queries in one request.',
    params: [{ name: 'query', in: 'query', required: true, description: 'Search text.', example: 'arijit singh' }],
  },
  {
    group: 'Search',
    method: 'GET',
    path: '/search/songs',
    title: 'Search songs',
    description: 'Search songs. Each result includes image links and download links for every bitrate.',
    params: [{ name: 'query', in: 'query', required: true, description: 'Search text.', example: 'kesariya' }, ...pagination],
  },
  {
    group: 'Search',
    method: 'GET',
    path: '/search/albums',
    title: 'Search albums',
    description: 'Search albums by name.',
    params: [{ name: 'query', in: 'query', required: true, description: 'Search text.', example: 'brahmastra' }, ...pagination],
  },
  {
    group: 'Search',
    method: 'GET',
    path: '/search/artists',
    title: 'Search artists',
    description: 'Search artists by name.',
    params: [{ name: 'query', in: 'query', required: true, description: 'Search text.', example: 'arijit' }, ...pagination],
  },
  {
    group: 'Search',
    method: 'GET',
    path: '/search/playlists',
    title: 'Search playlists',
    description: 'Search playlists by name.',
    params: [{ name: 'query', in: 'query', required: true, description: 'Search text.', example: 'workout' }, ...pagination],
  },
  {
    group: 'Details',
    method: 'GET',
    path: '/songs',
    title: 'Song details',
    description: 'Get one or more songs. For several songs pass comma separated ids.',
    params: idOrLink('song', 'dN1_hCXP', 'https://www.jiosaavn.com/song/kesariya/AgIAQyBeWlI'),
  },
  {
    group: 'Details',
    method: 'GET',
    path: '/albums',
    title: 'Album details',
    description: 'Get an album with its songs.',
    params: idOrLink('album', '23241654', 'https://www.jiosaavn.com/album/brahmastra/xq4v9ZFC9iA_'),
  },
  {
    group: 'Details',
    method: 'GET',
    path: '/artists',
    title: 'Artist details',
    description: 'Get an artist profile with top songs and albums.',
    params: idOrLink('artist', '459320', 'https://www.jiosaavn.com/artist/arijit-singh-songs/LlRWpHzy3Hk_'),
  },
  {
    group: 'Details',
    method: 'GET',
    path: '/artists/{artistId}/songs',
    title: 'Artist songs',
    description: 'Paginated list of songs by an artist.',
    params: [{ name: 'artistId', in: 'path', required: true, description: 'Artist id.', example: '459320' }, ...listParams],
  },
  {
    group: 'Details',
    method: 'GET',
    path: '/artists/{artistId}/albums',
    title: 'Artist albums',
    description: 'Paginated list of albums by an artist.',
    params: [{ name: 'artistId', in: 'path', required: true, description: 'Artist id.', example: '459320' }, ...listParams],
  },
  {
    group: 'Details',
    method: 'GET',
    path: '/artists/{artistId}/recommendations/{songId}',
    title: 'Artist recommendations',
    description: 'Other top songs by the artist, relative to a given song.',
    params: [
      { name: 'artistId', in: 'path', required: true, description: 'Artist id.', example: '459320' },
      { name: 'songId', in: 'path', required: true, description: 'Song id to exclude / base on.', example: 'dN1_hCXP' },
      { name: 'language', in: 'query', default: 'english', description: 'Language.', example: 'hindi' },
    ],
  },
  {
    group: 'Details',
    method: 'GET',
    path: '/playlists',
    title: 'Playlist details',
    description: 'Get a playlist with its songs.',
    params: [{ name: 'id', in: 'query', required: true, description: 'Playlist id.', example: '82914609' }],
  },
  {
    group: 'Other',
    method: 'GET',
    path: '/lyrics',
    title: 'Lyrics',
    description: 'Lyrics for a song. Returns 404 when the song has none.',
    params: [{ name: 'id', in: 'query', required: true, description: 'Song id.', example: 'dN1_hCXP' }],
  },
  {
    group: 'Other',
    method: 'GET',
    path: '/modules',
    title: 'Browse modules',
    description: 'Home page modules: trending, new releases, charts, playlists and albums.',
    params: [{ name: 'language', in: 'query', default: 'english', description: 'Language.', example: 'hindi' }],
  },
  {
    group: 'Other',
    method: 'GET',
    path: '/health',
    title: 'Health check',
    description: 'Returns ok. Useful for uptime monitors and platform health checks.',
    params: [],
  },
]
