import { HttpExceptionError } from '../exceptions/http.exception.js'
import { PayloadService } from '../services/payload.service.js'
import type { LyricsRequest } from '../interfaces/lyrics.interface.js'

export class LyricsService extends PayloadService {
  public songLyrics = async (songId: string) => {
    const response = await this.http<LyricsRequest>(this.endpoints.lyrics, true, { lyrics_id: songId })

    if (!response.lyrics) throw new HttpExceptionError(404, 'lyrics not found')

    const lyrics = this.lyricsPayload(response)
    return lyrics
  }
}
