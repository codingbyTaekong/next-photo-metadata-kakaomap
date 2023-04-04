import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styled from 'styled-components'
import EXIF from 'exif-js'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const onChangeFile = (e : React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {

      const file : any = e.target.files[0];
      EXIF.getData(file, function(){

        console.log(EXIF.getAllTags(file))
        // var exifLong = EXIF.getTag(file, "GPSLongitude");
        // var exifLat = EXIF.getTag(file, "GPSLatitude");
        // var exifLongRef = EXIF.getTag(file, "GPSLongitudeRef");
        // var exifLatRef = EXIF.getTag(file, "GPSLatitudeRef");
        // //계산식 적용이유는 해당라이브러리가 위도경도를 도분초 단위로 출력하기 때문
        // var latitude = 0
        // var longitude = 0
        // let wtmX = 0
        // let wtmY = 0
        // if (exifLatRef == "S") {
        //     latitude = (exifLat[0]*-1) + (( (exifLat[1]*-60) + (exifLat[2]*-1) ) / 3600);						
        // } else {
        //     latitude = exifLat[0] + (( (exifLat[1]*60) + exifLat[2] ) / 3600);
        // }

        // if (exifLongRef == "W") {
        //     longitude = (exifLong[0]*-1) + (( (exifLong[1]*-60) + (exifLong[2]*-1) ) / 3600);						
        // } else {
        //     longitude = exifLong[0] + (( (exifLong[1]*60) + exifLong[2] ) / 3600);
        // }

        // wtmX = latitude,
        // wtmY = longitude;

        // // var make = EXIF.getTag(file, "Make");
        // // var model = EXIF.getTag(file, "Model");
        // console.log("좌표정보", wtmX, wtmY)
        // console.log(model)
      })
    }
  }
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <input type="file" name="" id="" onChange={onChangeFile} />
    </>
  )
}
