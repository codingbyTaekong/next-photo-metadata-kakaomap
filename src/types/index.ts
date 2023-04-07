export interface AREA {
    idx: number
    name: string
    type: string
    rectangle: RECTANGLE[]
    circle : CIRCLE[],
    polygon : POLYGON[]
}

export interface RECTANGLE {
    idx : number
    sPointX : number
    sPointY : number
    ePointX : number
    ePointY : number
    areaId : number
}

export interface CIRCLE {
    idx : number
    centerX : number
    centerY : number
    radius : number
    areaId : number
}

export interface POLYGON {
    idx : number
    areaId : number
    points : POINT[]
}

export interface POINT {
    idx : number
    x : number
    y : number
    polygonId : number
}