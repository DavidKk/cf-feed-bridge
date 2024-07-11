export interface Season {
  /** 季度 */
  seasonNumber?: number
  /** 监控 */
  monitored?: boolean
}

export type MovieId = string | number

export interface Series {
  /** 标题 */
  title: string
  /** thetvdb.com */
  tvdbId?: MovieId
  /** themoviedb.org */
  tmdbId?: MovieId
  /** imdb.com */
  imdbId?: MovieId
  /** douban.com 仅用于标记 */
  doubanId?: MovieId
  /** 季度 */
  seasons?: Season[]
}

export type SeriesList = Series[]
