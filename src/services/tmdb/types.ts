export type MediaType = 'movie' | 'tv'

export interface BaseSearchResult {
  /** 是否为成人内容 */
  adult: boolean
  /** 背景图片的路径，可能为 null */
  backdrop_path: string | null
  /** 类型 ID 列表 */
  genre_ids: number[]
  /** TMDb 唯一标识符 */
  id: number
  /** 原始语言 */
  original_language: string
  /** 概述或简介 */
  overview: string
  /** 流行度评分 */
  popularity: number
  /** 海报图片的路径，可能为 null */
  poster_path: string | null
  /** 平均评分 */
  vote_average: number
  /** 评分总数 */
  vote_count: number
  /** 媒体类型（电影或电视） */
  media_type: MediaType
}

export interface MovieSearchResult extends BaseSearchResult {
  /** 媒体类型为电影 */
  media_type: 'movie'
  /** 原始标题 */
  original_title: string
  /** 发行日期 */
  release_date: string
  /** 标题 */
  title: string
  /** 是否有视频 */
  video: boolean
}

export interface TVSearchResult extends BaseSearchResult {
  /** 媒体类型为电视 */
  media_type: 'tv'
  /** 电视节目的名称 */
  name: string
  /** 原始名称 */
  original_name: string
  /** 首播日期 */
  first_air_date: string
  /** 制作国家列表 */
  origin_country: string[]
}

export type SearchResult = MovieSearchResult | TVSearchResult
