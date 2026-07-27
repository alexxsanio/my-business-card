"use client";

import {
    ChangeEvent
} from "react";

import {
    detectAndCropCard
} from "@/lib/detectCard";

import {
    uploadBusinessCard
} from "@/lib/uploadBusinessCard";

export default function BusinessCardCapture(){

    async function handleImage(

        e:ChangeEvent<HTMLInputElement>

    ){

        const file=e.target.files?.[0];

        if(!file)return;

        try{

            alert(
                "Place the card on a plain background.\n\nMake sure all four corners are visible."
            );

            const cropped=
                await detectAndCropCard(file);

            await uploadBusinessCard(
                cropped
            );

            alert(
                "Business card uploaded!"
            );

        }

        catch(err){

            alert(
                "Unable to detect the business card."
            );

            console.error(err);

        }

    }

    return(

        <>
            <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImage}
            />
        </>

    );

}