import { AREA } from '@/src/types';
import { atom } from 'recoil';
import { v1 } from 'uuid';



export const areaState = atom({
  key: `areaState/${v1()}`,
  default: [] as AREA[],
});
