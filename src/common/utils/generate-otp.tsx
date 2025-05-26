import { nanoid } from "nanoid";


export default function generateOTP() {
  return nanoid(7);
}
