import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    if (req.method !== "GET")  {
        return res.status(405).end();
    }

    try {
        const {areaId} = req.query;
        console.log(typeof areaId)
        if (typeof areaId !== "string") {
            throw new Error("Invalid ID");
        }

        if (!areaId) {
            throw new Error("Invalid ID");
        }
        const area = await prismadb.area.findUnique({
            where : {
                idx : parseInt(areaId)
            },
            include : {
                rectangle : true,
                circle : true,
                polygon : {
                    include : {
                        points : true
                    }
                }
            }
        })
        if (!area) {
            throw new Error("Invalid ID");
        }

        return res.status(200).json(area);
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}