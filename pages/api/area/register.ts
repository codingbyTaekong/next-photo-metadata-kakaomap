// import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { type, name, polygon, rectangle, circle } = req.body;
    // console.log(rectangle ,circle)
    // 
    if (polygon.length !==0) {

      // console.log(typeof polygon[0][0].x)
      // console.log(polygon.length)
      // console.log(rectangle.length)
      // console.log(circle.length)
      const Area = await prismadb.area.create({
          data : {
              name,
              type : 'testType',
              polygon : {
                create : polygon.map((poly : any) => ({
                  points : {
                    create : poly
                  }
                }))
              },
              rectangle : {
                create : rectangle
              },
              circle : {
                create : circle
              },
          },
          include : {
            polygon : {
              include : {
                points : true
              }
            },
            rectangle : true,
            circle : true,
          }
      })

      return res.status(200)
      // return res.status(200).json(Area)
    } else {
      const Area = await prismadb.area.create({
        data : {
            name,
            type : '테스트 타입',
            rectangle : {
              create : rectangle
            },
            circle : {
              create : circle
            },
        },
        include : {
          polygon : true,
          rectangle : true,
          circle : true,
        }
      })
    return res.status(200).json(Area)
    }
  } catch (error) {
    prismadb.$disconnect()
    console.log(error)
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
}