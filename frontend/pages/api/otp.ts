import { NextApiRequest, NextApiResponse } from 'next';
import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import { ENV } from '@pushprotocol/restapi/src/lib/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const PK = "da929af080327162f2420e94b265122d4478b61abdd6994e05191c7dfa0a368b";
    console.log("Private key", PK);
    const _signer = new ethers.Wallet(PK);

    function generateRandomNumber(): number {
        const randomNumber = Math.floor(Math.random() * 1000000);
        return randomNumber;
    }

    const sendNotification = async (otp:string) => {
        try {
            const apiResponse = await PushAPI.payloads.sendNotification({
                signer: _signer,
                type: 3, // broadcast
                identityType: 2, // direct payload
                notification: {
                    title: `[Solitiy] OTP Code`,
                    body: `[Solitiy] OTP Code`
                },
                payload: {
                    title: `[Solitiy] OTP Code`,
                    body: otp,
                    cta: '',
                    img: ''
                },
                recipients: 'eip155:5:0x6097f22127E2EF98C2cF31335Bede16D742f6890', // recipient address
                channel: 'eip155:5:0xfe9f407cb3223433EE11031a79E0EDd40371C52b', // your channel address
                env: ENV.STAGING
            });
            
            res.send(otp)
        } catch (err) {
            console.error('Error: ', err);
        }
    }


    try {
        const otp = generateRandomNumber().toString();
        sendNotification(otp);
        
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).json({ error: 'An error occurred while sending notification.' });
    }
}
