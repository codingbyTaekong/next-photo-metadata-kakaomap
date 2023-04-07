import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    if (req.method !== "GET")  {
        return res.status(405).end();
    }

    try {
        const area = await prismadb.area.findMany({
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