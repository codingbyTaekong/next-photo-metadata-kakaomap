import { AREA } from "@/src/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import { Map as KakaoMap, MapMarker, Circle, Rectangle, DrawingManager, Polygon, CircleProps } from "react-kakao-maps-sdk";
import EXIF from 'exif-js'

type DrawingManagerType = kakao.maps.drawing.DrawingManager<
    | kakao.maps.drawing.OverlayType.CIRCLE
    | kakao.maps.drawing.OverlayType.ELLIPSE
    | kakao.maps.drawing.OverlayType.MARKER
    | kakao.maps.drawing.OverlayType.POLYLINE
    | kakao.maps.drawing.OverlayType.RECTANGLE
    | kakao.maps.drawing.OverlayType.POLYGON
  >



const fetchArea =async ({queryKey} : any) => {
    return await (await axios.get('/api/area')).data
}

const Map : NextPage = () => {
    const ContainerRef = useRef<any>();
    const testPosition = {
        lat : 37.857248988949266,
        lng : 127.72709140606275
    }
    const [load, setLoad] = useState(false);
    const [overlayData, setOverlayData] = useState<AREA>();
    const [areas, setAreas] = useState<AREA[]>([]);
    const {data, isLoading, isError} = useQuery(['area'], fetchArea, {
        enabled : true,
        onSuccess : (data : AREA[]) => {
            // console.log(data)
            setAreas(data)
            console.log("어디서 실행?2")
            if (data.length >= 1 && !overlayData) setOverlayData(data[0])
        },
        
    })
    

    /** 구역 옵션 변경 핸들러 */
    const onChangeArea = (e : React.ChangeEvent<HTMLSelectElement>) => {
        console.log("어디서 실행?1")
        setOverlayData(areas.filter((area=> area.idx === parseInt(e.target.value)))[0])
    }


    const FileRef = useRef<HTMLInputElement>(null);
    const RectangleRef = useRef<kakao.maps.Rectangle | null>(null);
    const PolygonRef = useRef<kakao.maps.Polygon | null>(null);
    const CircleRef = useRef<kakao.maps.Circle | null>(null);
    const [upload,setUpload] = useState(false);
    const [uploadCoordinate, setUploadCoordinate] = useState({
        lat : 0,
        lng : 0
    })
    /**
     * 폴리곤 내 여부 확인
     */
    const checkInside = useCallback((point : number[], vs : any) => {
        const x = point[0];
        const y = point[1];
        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            // const xi = vs[i].getLat()
            // const yi = vs[i].getLng()
            // const xj = vs[j].getLat()
            // const yj = vs[j].getLng()
            const xi = vs[i].y
            const yi = vs[i].x
            const xj = vs[j].y
            const yj = vs[j].x
            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside
    },[])
    /** 파일 업로드 핸들러 */
    const onChangeFile = (e : React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const file : any = e.target.files[0];
          EXIF.getData(file, function(){
    
            const exifLong = EXIF.getTag(file, "GPSLongitude");
            const exifLat = EXIF.getTag(file, "GPSLatitude");
            const exifLongRef = EXIF.getTag(file, "GPSLongitudeRef");
            const exifLatRef = EXIF.getTag(file, "GPSLatitudeRef");
            //계산식 적용이유는 해당라이브러리가 위도경도를 도분초 단위로 출력하기 때문
            let latitude = 0
            let longitude = 0
            let wtmX = 0
            let wtmY = 0
            if (EXIF.getAllTags(file) && exifLatRef && exifLongRef) {
              if (exifLatRef === "S") {
                  latitude = (exifLat[0]*-1) + (( (exifLat[1]*-60) + (exifLat[2]*-1) ) / 3600);						
              } else {
                  latitude = exifLat[0] + (( (exifLat[1]*60) + exifLat[2] ) / 3600);
              }
      
              if (exifLongRef == "W") {
                  longitude = (exifLong[0]*-1) + (( (exifLong[1]*-60) + (exifLong[2]*-1) ) / 3600);						
              } else {
                  longitude = exifLong[0] + (( (exifLong[1]*60) + exifLong[2] ) / 3600);
              }
            } else {
                setUpload(false);
                window.alert("EXIF 정보가 존재하지 않습니다");
            }
    
            wtmX = latitude,
            wtmY = longitude;
            
            console.log("좌표정보", wtmX, wtmY)
            let isInside = false;
            /** 원이 있는 경우 */
            if (overlayData?.circle && overlayData.circle.length > 0 && CircleRef.current) {
                overlayData.circle.forEach(_circle => {
                    const center = new kakao.maps.LatLng(_circle.centerY, _circle.centerX);
                    const path = [new kakao.maps.LatLng(wtmX, wtmY), center];
                    const polyLine = new kakao.maps.Polyline({
                        path : path,
                    })
                    console.log(polyLine.getLength())
                    if (polyLine.getLength() <= _circle.radius && !isInside) {
                        isInside = true
                    }
                })
            }
            /** 폴리곤이 있는 경우 */
            if (overlayData?.polygon && overlayData.polygon.length > 0) {
                overlayData.polygon.forEach((_poly) => {
                    // const PolyPath = _poly.points
                    const result = checkInside([wtmX, wtmY], _poly.points)
                if (!isInside && result) {
                    isInside = true
                }
                })
                // const polygonPath = PolygonRef.current?.getPath()
                // const result = checkInside([wtmX, wtmY], polygonPath)
                // if (!isInside && result) {
                //     isInside = true
                // }
                // const polygonPath = PolygonRef.current?.getPath()
                // const result = checkInside([wtmX, wtmY], polygonPath)
                // if (!isInside && result) {
                //     isInside = true
                // }
            }
            /** 사각형인 경우 */
            if (overlayData?.rectangle && overlayData.rectangle.length > 0 && RectangleRef.current) {
                overlayData.rectangle.forEach((_rect) => {
                    const sw = new kakao.maps.LatLng(_rect.sPointX, _rect.sPointY)
                    const ne = new kakao.maps.LatLng(_rect.ePointX, _rect.ePointY)
                    const lb = new kakao.maps.LatLngBounds(sw,ne);
                    // const bounds = RectangleRef.current.getBounds()
                    const point = new kakao.maps.LatLng(wtmX, wtmY)
                    console.log(lb.contain(point))
                    if (lb.contain(point) && !isInside) {
                        isInside = true
                    }
                })
            }
            if (isInside) {
                setUploadCoordinate({
                    lat : wtmX,
                    lng : wtmY
                })
                setUpload(true);
            } else {
                window.alert("!!")
            }
          })
        }
      }
    useEffect(()=> {
        kakao.maps.load(()=> {
            setLoad(true)
            // const Circle = new kakao.maps.Circle({
            //     radius : 50,
            //     center : new kakao.maps.LatLng(center.lat, center.lng),
            // })
            // console.log(CircleRef.current)
            // const circleCenter = Circle.getPosition();
            // const circleRadius = Circle.getRadius();
            // const path = [new kakao.maps.LatLng(testPosition.lat, testPosition.lng), circleCenter];
            // const polyLine = new kakao.maps.Polyline({
            //     path : path,
            // })
            // if (polyLine.getLength() >= circleRadius) {
            //     console.log("범위 안에 없음")
            // } else {
            //     console.log("범위 안에 있음")
            // }
        })
    },[])
    
    return (
        <>  
            <div>
                <label htmlFor="">
                    <span>파일 업로드</span>
                    <input ref={FileRef} type="file" name="" id="" onChange={onChangeFile} accept="image/png, image/jpeg"/>
                </label>
            </div>
            <select name="" id="" onChange={onChangeArea} value={overlayData?.idx}>
                {areas.map((area, i)=> {
                    return <option key={i} value={area.idx}>{area.name}</option>
                })}
            </select>
            {load && overlayData &&

                <KakaoMap ref={ContainerRef} center={{lat: 37.85732475646546,
                    lng: 127.72576266710679}} level={3} style={{ width: "100%", height: "600px" }} onLoad={()=> console.log("로딩 완료")}>
                    { uploadCoordinate.lat !== 0 && uploadCoordinate.lng !== 0 && upload &&
                              <MapMarker // 마커를 생성합니다
                              position={{
                                // 마커가 표시될 위치입니다
                                lat: uploadCoordinate.lat,
                                lng: uploadCoordinate.lng,
                              }}
                              onCreate={()=> {}}
                            />
                    }
                    {
                        overlayData?.circle.map((circle, i) => {
                            return <Circle
                            center={{
                            lat: circle.centerY, //y
                            lng: circle.centerX, //x
                            }}
                            key={i}
                            radius={circle.radius}
                            strokeWeight={5} // 선의 두께입니다
                            strokeColor={"#75B8FA"} // 선의 색깔입니다
                            strokeOpacity={2} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                            strokeStyle={"dash"} // 선의 스타일 입니다
                            fillColor={"#CFE7FF"} // 채우기 색깔입니다
                            fillOpacity={0.7} // 채우기 불투명도 입니다
                            onCreate={(circle)=> CircleRef.current = circle}
                        /> 
                        })
                    }
                    {
                        overlayData?.rectangle.map((rectangle, i) => {
                            return <Rectangle
                                key={i}
                                bounds={{
                                    sw : {
                                        lat : rectangle.sPointY,
                                        lng : rectangle.sPointX
                                    },
                                    ne : {
                                        lat : rectangle.ePointY,
                                        lng : rectangle.ePointX
                                    }
                                }}
                                strokeWeight={5} // 선의 두께입니다
                                strokeColor={"#75B8FA"} // 선의 색깔입니다
                                strokeOpacity={2} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                                strokeStyle={"dash"} // 선의 스타일 입니다
                                fillColor={"#CFE7FF"} // 채우기 색깔입니다
                                fillOpacity={0.7} // 채우기 불투명도 입니다
                                onCreate={(rectangle)=> RectangleRef.current = rectangle}
                             />
                        })
                    }
                    {
                        overlayData.polygon.map((polygon, i) => {
                        return  <Polygon
                            key={i}
                            path={polygon.points.map((point)=> ({lat : point.y, lng : point.x}))}
                            strokeWeight={3} // 선의 두께입니다
                            strokeColor={"#39DE2A"} // 선의 색깔입니다
                            strokeOpacity={0.8} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                            strokeStyle={"longdash"} // 선의 스타일입니다
                            fillColor={"#A2FF99"} // 채우기 색깔입니다
                            fillOpacity={0.7} // 채우기 불투명도 입니다
                            onCreate={(polygon)=> PolygonRef.current = polygon}
                            
                          />
                        })
                    }
                </KakaoMap>
            }
        </>
    )
}

export default Map