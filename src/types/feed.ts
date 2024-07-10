export interface Season {
  seasonNumber?: number
  monitored?: boolean
}

export interface Series {
  title: string
  tvdbId?: number
  seasons?: Season[]
}

export type SeriesList = Series[]
