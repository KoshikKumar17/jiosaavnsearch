import { PayloadService } from './payload.service.js'
import type { PlaylistRequest, PlaylistResponse } from '../interfaces/playlist.interface.js'

export class PlaylistsService extends PayloadService {
  constructor() {
    super()
  }

  public detailsById = async (id: string): Promise<PlaylistResponse> => {
    // api v4 does not contain media_preview_url
    const response = await this.http<PlaylistRequest>(this.endpoints.playlists.id, false, {
      listid: id,
    })

    const playlistResults = this.playlistPayload(response)

    return playlistResults
  }
}
