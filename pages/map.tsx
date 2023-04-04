import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { Map as KakaoMap, MapMarker, Circle } from "react-kakao-maps-sdk";

const Map : NextPage = () => {
    const ContainerRef = useRef<any>();
    const testPosition = {
        lat : 37.857248988949266,
        lng : 127.72709140606275
    }
    const CircleRef = useRef<any>();
    const [load, setLoad] = useState(false)
    const [center, setCenter] = useState({
        lat : 37.85732475646546,
        lng : 127.72576266710679
    })
    useEffect(()=> {
        kakao.maps.load(()=> {
            const Circle = new kakao.maps.Circle({
                radius : 50,
                center : new kakao.maps.LatLng(center.lat, center.lng),
            })
            console.log(CircleRef.current)
            const circleCenter = Circle.getPosition();
            const circleRadius = Circle.getRadius();
            const path = [new kakao.maps.LatLng(testPosition.lat, testPosition.lng), circleCenter];
            const polyLine = new kakao.maps.Polyline({
                path : path,
            })
            console.log(polyLine.getLength())
            if (polyLine.getLength() >= circleRadius) {
                console.log("범위 안에 없음")
            } else {
                console.log("범위 안에 있음")
            }
        })
    },[])
    useEffect(()=> {
        // console.log(CircleRef.current)
        
    },[CircleRef.current])
    // console.log(ContainerRef.current)
    return (
        <>
            <div ref={ContainerRef} className="ddd">안녕하세요</div>
            <KakaoMap center={{lat: 37.85732475646546,
                lng: 127.72576266710679}} level={3} style={{ width: "100%", height: "600px" }}>
                <MapMarker position={{ lat: 37.85732475646546, lng: 127.72576266710679 }}>
                    <div style={{ color: "#000" }}>Hello World!</div>
                </MapMarker>
                <Circle
                    ref={CircleRef}
                    center={{
                    lat: 37.85732475646546,
                    lng: 127.72576266710679,
                    }}
                    radius={100}
                    strokeWeight={5} // 선의 두께입니다
                    strokeColor={"#75B8FA"} // 선의 색깔입니다
                    strokeOpacity={2} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    strokeStyle={"dash"} // 선의 스타일 입니다
                    fillColor={"#CFE7FF"} // 채우기 색깔입니다
                    fillOpacity={0.7} // 채우기 불투명도 입니다
                />
            </KakaoMap>
        </>
    )
}

export default Map