import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}
// http://isure.stream.qqmusic.qq.com/C400000PcSos12VDrz.m4a?guid=3393108710&vkey=E4E207AC61AB53E14DAFB21EB46D6E74DA2085F6175E31B7500FC405FA9F29940C1AA0BE8CED0971BFBD50CDBD3BAB5AC9A0F44F90C5A0E4&uin=0&fromtag=66
// http://isure.stream.qqmusic.qq.com/C400000PcSos12VDrz.m4a?guid=3393108710&vkey=8878811A1A2D0DE676413F4DE20B8C741CF6BA9D59790FFEA8E79BCC8562DE482330AAC08B26090D29DFDDD910D3E9FFC2F05D3C1B3F8559&uin=0&fromtag=66
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    url: `http://isure.stream.qqmusic.qq.com/C400${musicData.strMediaMid}.m4a?guid=3393108710&vkey=8878811A1A2D0DE676413F4DE20B8C741CF6BA9D59790FFEA8E79BCC8562DE482330AAC08B26090D29DFDDD910D3E9FFC2F05D3C1B3F8559&uin=0&fromtag=66`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

