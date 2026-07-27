declare const cv: any;

export async function detectAndCropCard(
    file: File
): Promise<Blob> {

    const img = new Image();

    img.src = URL.createObjectURL(file);

    await new Promise((resolve) => {
        img.onload = resolve;
    });

    const canvas = document.createElement("canvas");

    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(img,0,0);

    const src = cv.imread(canvas);

    const gray = new cv.Mat();

    cv.cvtColor(
        src,
        gray,
        cv.COLOR_RGBA2GRAY
    );

    const blurred = new cv.Mat();

    cv.GaussianBlur(
        gray,
        blurred,
        new cv.Size(5,5),
        0
    );

    const edges = new cv.Mat();

    cv.Canny(
        blurred,
        edges,
        75,
        200
    );

    const contours = new cv.MatVector();

    const hierarchy = new cv.Mat();

    cv.findContours(
        edges,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
    );

    let biggest = null;

    let biggestArea = 0;

    for(let i=0;i<contours.size();i++){

        const contour = contours.get(i);

        const peri = cv.arcLength(contour,true);

        const approx = new cv.Mat();

        cv.approxPolyDP(
            contour,
            approx,
            0.02*peri,
            true
        );

        const area = cv.contourArea(contour);

        if(
            approx.rows===4 &&
            area>biggestArea
        ){
            biggest=approx;
            biggestArea=area;
        }
    }

    if(!biggest){
        throw new Error("Business card not found");
    }

    const pts = [];

    for(let i=0;i<4;i++){

        pts.push({
            x:biggest.intPtr(i,0)[0],
            y:biggest.intPtr(i,0)[1]
        });
    }

    pts.sort((a,b)=>a.y-b.y);

    const top=pts.slice(0,2).sort((a,b)=>a.x-b.x);

    const bottom=pts.slice(2).sort((a,b)=>a.x-b.x);

    const ordered=[
        top[0],
        top[1],
        bottom[1],
        bottom[0]
    ];

    const width=900;
    const height=550;

    const srcTri=cv.matFromArray(
        4,
        1,
        cv.CV_32FC2,
        [
            ordered[0].x,ordered[0].y,
            ordered[1].x,ordered[1].y,
            ordered[2].x,ordered[2].y,
            ordered[3].x,ordered[3].y
        ]
    );

    const dstTri=cv.matFromArray(
        4,
        1,
        cv.CV_32FC2,
        [
            0,0,
            width,0,
            width,height,
            0,height
        ]
    );

    const M=cv.getPerspectiveTransform(
        srcTri,
        dstTri
    );

    const dst=new cv.Mat();

    cv.warpPerspective(
        src,
        dst,
        M,
        new cv.Size(width,height)
    );

    const output=document.createElement("canvas");

    cv.imshow(output,dst);

    const blob=await new Promise<Blob>((resolve)=>{

        output.toBlob((b)=>{

            resolve(b!);

        },"image/png");
    });

    src.delete();
    gray.delete();
    blurred.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
    dst.delete();

    return blob;
}