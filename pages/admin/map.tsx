import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { Map as KakaoMap, MapMarker, Circle, DrawingManager, useInjectKakaoMapApi } from "react-kakao-maps-sdk";

type DrawingManagerType = kakao.maps.drawing.DrawingManager<
    | kakao.maps.drawing.OverlayType.CIRCLE
    | kakao.maps.drawing.OverlayType.ELLIPSE
    | kakao.maps.drawing.OverlayType.MARKER
    | kakao.maps.drawing.OverlayType.POLYLINE
    | kakao.maps.drawing.OverlayType.RECTANGLE
    | kakao.maps.drawing.OverlayType.POLYGON
  >

const Map : NextPage = () => {
    const ContainerRef = useRef<any>();
    const managerRef = useRef<DrawingManagerType>(null)
    const testPosition = {
        lat : 37.857248988949266,
        lng : 127.72709140606275
    }
    const [overlayData, setOverlayData] = useState<
    ReturnType<DrawingManagerType["getData"]>
  >({
    arrow: [],
    circle: [],
    ellipse: [],
    marker: [],
    polygon: [],
    polyline: [],
    rectangle: [],
  })
    const CircleRef = useRef<any>();
    const [load, setLoad] = useState(false)
    const [center, setCenter] = useState({
        lat : 37.85732475646546,
        lng : 127.72576266710679
    })
    useEffect(()=> {
        kakao.maps.load(()=> {
            setLoad(true)
            // 원에 포함되는 지
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
            // console.log(polyLine.getLength())
            // if (polyLine.getLength() >= circleRadius) {
            //     console.log("범위 안에 없음")
            // } else {
            //     console.log("범위 안에 있음")
            // }
        })
    },[])
    function selectOverlay(type:
        | kakao.maps.drawing.OverlayType.CIRCLE
        | kakao.maps.drawing.OverlayType.ELLIPSE
        | kakao.maps.drawing.OverlayType.MARKER
        | kakao.maps.drawing.OverlayType.POLYLINE
        | kakao.maps.drawing.OverlayType.RECTANGLE
        | kakao.maps.drawing.OverlayType.POLYGON) {
        const manager = managerRef.current
        manager?.cancel()
        manager?.select(type)
      }

    const getDrawData = () => {
        const manager = managerRef.current
        console.log(manager?.getData());
    }
    return (
        <>
            <div ref={ContainerRef} className="ddd">안녕하세요</div>
            {load && 
            <>
                <KakaoMap center={{lat: 37.85732475646546,
                    lng: 127.72576266710679}} level={3} style={{ width: "100%", height: "600px" }}>
                    <DrawingManager
                        ref={managerRef}
                        drawingMode={[
                            kakao.maps.drawing.OverlayType.ARROW,
                            kakao.maps.drawing.OverlayType.CIRCLE,
                            kakao.maps.drawing.OverlayType.ELLIPSE,
                            kakao.maps.drawing.OverlayType.MARKER,
                            kakao.maps.drawing.OverlayType.POLYLINE,
                            kakao.maps.drawing.OverlayType.RECTANGLE,
                            kakao.maps.drawing.OverlayType.POLYGON,
                        ]}
                        guideTooltip={["draw", "drag", "edit"]}
                        markerOptions={{
                            // 마커 옵션입니다
                            draggable: true, // 마커를 그리고 나서 드래그 가능하게 합니다
                            removable: true, // 마커를 삭제 할 수 있도록 x 버튼이 표시됩니다
                        }}
                        polylineOptions={{
                            // 선 옵션입니다
                            draggable: true, // 그린 후 드래그가 가능하도록 설정합니다
                            removable: true, // 그린 후 삭제 할 수 있도록 x 버튼이 표시됩니다
                            editable: true, // 그린 후 수정할 수 있도록 설정합니다
                            strokeColor: "#39f", // 선 색
                            hintStrokeStyle: "dash", // 그리중 마우스를 따라다니는 보조선의 선 스타일
                            hintStrokeOpacity: 0.5, // 그리중 마우스를 따라다니는 보조선의 투명도
                        }}
                        rectangleOptions={{
                            draggable: true,
                            removable: true,
                            editable: true,
                            strokeColor: "#39f", // 외곽선 색
                            fillColor: "#39f", // 채우기 색
                            fillOpacity: 0.5, // 채우기색 투명도
                        }}
                        circleOptions={{
                            draggable: true,
                            removable: true,
                            editable: true,
                            strokeColor: "#39f",
                            fillColor: "#39f",
                            fillOpacity: 0.5,
                        }}
                        polygonOptions={{
                            draggable: true,
                            removable: true,
                            editable: true,
                            strokeColor: "#39f",
                            fillColor: "#39f",
                            fillOpacity: 0.5,
                            hintStrokeStyle: "dash",
                            hintStrokeOpacity: 0.5,
                        }}
                        arrowOptions={{
                            draggable: true, // 그린 후 드래그가 가능하도록 설정합니다
                            removable: true, // 그린 후 삭제 할 수 있도록 x 버튼이 표시됩니다
                            editable: true, // 그린 후 수정할 수 있도록 설정합니다
                            strokeColor: "#39f", // 선 색
                            hintStrokeStyle: "dash", // 그리중 마우스를 따라다니는 보조선의 선 스타일
                            hintStrokeOpacity: 0.5, // 그리중 마우스를 따라다니는 보조선의 투명도
                        }}
                        ellipseOptions={{
                            draggable: true,
                            removable: true,
                            editable: true,
                            strokeColor: "#39f",
                            fillColor: "#39f",
                            fillOpacity: 0.5,
                        }}
                        />
                </KakaoMap>
                <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        <button
          onClick={(e) => {
            selectOverlay(kakao.maps.drawing.OverlayType.POLYLINE)
          }}
        >
          선
        </button>
        <button
          onClick={(e) => {
            selectOverlay(kakao.maps.drawing.OverlayType.CIRCLE)
          }}
        >
          원
        </button>
        <button
          onClick={(e) => {
            selectOverlay(kakao.maps.drawing.OverlayType.MARKER)
          }}
        >
          마커
        </button>
        <button
          onClick={(e) => {
            selectOverlay(kakao.maps.drawing.OverlayType.POLYGON)
          }}
        >
          다각형
        </button>
        <button
          onClick={(e) => {
            selectOverlay(kakao.maps.drawing.OverlayType.RECTANGLE)
          }}
        >
          사각형
        </button>
        <button onClick={getDrawData}>
            정보얻기
        </button>
      </div>
            </>
            
            }
        </>
    )
}

export default Map