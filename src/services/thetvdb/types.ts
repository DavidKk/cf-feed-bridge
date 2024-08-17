export type Genre = string

export type MovieType = 'movie' | 'series'

export interface Overview {
  /** 翻译概述的语言键值对 */
  [key: string]: string
}

export interface Translation {
  /** 翻译标题的语言键值对 */
  [key: string]: string
}

export interface RemoteID {
  /** 远程资源的唯一标识符 */
  id: string
  /** 远程资源的类型编码 */
  type: number
  /** 远程资源来源的名称 */
  sourceName: string
}

export interface Movie {
  /** TheTVDB 对象的唯一标识符 */
  objectID: string
  /** 电影或剧集的国家 */
  country: string
  /** 扩展标题，可能包含更多信息 */
  extended_title: string
  /** 电影或剧集的类型 */
  genres: Genre[]
  /** TheTVDB ID 或其他标识符 */
  id: string
  /** 海报或宣传图片的 URL */
  image_url: string
  /** 电影或剧集的名称 */
  name: string
  /** 概述或简介 */
  overview: string
  /** 主要语言 */
  primary_language: string
  /** 主要类型，例如电影或系列 */
  primary_type: string
  /** 当前状态，例如 "已完结" */
  status: string
  /** 内容类型，例如电影或系列 */
  type: MovieType
  /** TVDB ID */
  tvdb_id: string
  /** 发行年份 */
  year: string
  /** 友好的 URL 片段 */
  slug: string
  /** 各种语言的概述 */
  overviews: Overview
  /** 各种语言的标题翻译 */
  translations: Translation
  /** 播出网络或平台 */
  network: string
  /** 远程资源的标识符列表 */
  remote_ids: RemoteID[]
  /** 缩略图的 URL */
  thumbnail: string
}
