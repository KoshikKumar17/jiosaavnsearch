import { PayloadService } from './payload.service.js'
import type { AlbumRequest, AlbumResponse } from '../interfaces/album.interface.js'

export class AlbumsService extends PayloadService {
  constructor() {
    super()
  }

  public detailsById = async (id: string): Promise<AlbumResponse> => {
    // api v4 does not contain media_preview_url
    const response = await this.http<AlbumRequest>(this.endpoints.albums.id, false, {
      albumid: id,
    })

    const albumResults = this.albumPayload(response)

    return albumResults
  }

  public detailsByLink = async (link: string): Promise<AlbumResponse> => {
    // api v4 does not contain media_preview_url
    const response = await this.http<AlbumRequest>(this.endpoints.albums.link, false, {
      token: link,
      type: 'album',
    })

    const albumResults = this.albumPayload(response)

    return albumResults
  }
}
