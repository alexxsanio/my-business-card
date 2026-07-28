/**
 * Business card detection using OpenCV.js
 *
 * Pipeline:
 *
 * Image
 *  ↓
 * Grayscale
 *  ↓
 * Gaussian Blur
 *  ↓
 * Canny Edge Detection
 *  ↓
 * Find contours
 *  ↓
 * Filter rectangles
 *  ↓
 * Perspective transform
 *  ↓
 * Cropped card
 */


import { loadOpenCV } from "./opencv";



interface Point {
  x:number;
  y:number;
}



/*
  Sort points into:

  top-left
  top-right
  bottom-right
  bottom-left
*/
function sortCorners(
  points:Point[]
){

  const ordered = [
    ...points
  ];

  ordered.sort(
    (a,b)=>
      a.x + a.y -
      (b.x + b.y)
  );

  const topLeft =
    ordered[0];

  const bottomRight =
    ordered[3];

  const remaining=[
    ordered[1],
    ordered[2]
  ];

  remaining.sort(
    (a,b)=>
      a.y-a.x -
      (b.y-b.x)
  );

  const topRight =
    remaining[0];

  const bottomLeft =
    remaining[1];

  return [
    topLeft,
    topRight,
    bottomRight,
    bottomLeft
  ];

}



/*
 Distance between points
*/
function distance(
  a:Point,
  b:Point
){

  return Math.sqrt(
    Math.pow(
      b.x-a.x,
      2
    )
    +
    Math.pow(
      b.y-a.y,
      2
    )
  );

}



/*
 Find the largest valid business card contour
*/
function findCardContour(
  cv:any,
  contours:any,
  imageArea:number
){

  let bestContour=null;
  let bestArea=0;

  for(
    let i=0;
    i<contours.size();
    i++
  ){

    const contour =
      contours.get(i);

    const area =
      cv.contourArea(
        contour
      );

    /*
      Ignore small objects
    */
    if(
      area <
      imageArea*0.1
    ){
      contour.delete();
      continue;
    }

    const perimeter =
      cv.arcLength(
        contour,
        true
      );

    const approx =
      new cv.Mat();

    cv.approxPolyDP(
      contour,
      approx,
      0.02*perimeter,
      true
    );

    /*
      Must have 4 corners
    */
    if(
      approx.rows===4
    ){

      const rect =
        cv.boundingRect(
          approx
        );

      const ratio =
        rect.width /
        rect.height;

      /*
        Business cards are usually:

        1.4 - 2.0 ratio

        (horizontal cards)
      */
      if(
        ratio > 1.25 &&
        ratio < 2.2
      ){

        if(
          area >
          bestArea
        ){

          bestArea =area;

          if(bestContour){
            bestContour.delete();
          }

          bestContour =
            approx;

        }
        else{
          approx.delete();
        }

      }
      else{
        approx.delete();
      }

    }
    else{
      approx.delete();
    }

    contour.delete();
  }

  return bestContour;

}





export async function detectBusinessCard(
  image:HTMLImageElement
):Promise<HTMLCanvasElement>{

  const cv =
    await loadOpenCV();

  const src =
    cv.imread(image);

  const imageArea =
    src.rows *
    src.cols;

  const gray =
    new cv.Mat();

  const blur =
    new cv.Mat();

  const edges =
    new cv.Mat();

  cv.cvtColor(
    src,
    gray,
    cv.COLOR_RGBA2GRAY
  );

  cv.GaussianBlur(
    gray,
    blur,
    new cv.Size(
      5,
      5
    ),
    0
  );

  cv.Canny(
    blur,
    edges,
    75,
    200
  );

  const contours =
    new cv.MatVector();

  const hierarchy =
    new cv.Mat();

  cv.findContours(
    edges,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  const cardContour =
    findCardContour(
      cv,
      contours,
      imageArea
    );

  if(!cardContour){
    src.delete();
    gray.delete();
    blur.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();

    throw new Error(
      "Business card not found"
    );

  }

  const points:Point[]=[];

  for(
    let i=0;
    i<4;
    i++
  ){

    points.push({
      x:
      cardContour.intPtr(
        i,
        0
      )[0],

      y:
      cardContour.intPtr(
        i,
        0
      )[1]

    });

  }

  const corners =
    sortCorners(
      points
    );

  const width =
    Math.max(

      distance(
        corners[0],
        corners[1]
      ),

      distance(
        corners[2],
        corners[3]
      )

    );

  const height =
    Math.max(

      distance(
        corners[0],
        corners[3]
      ),

      distance(
        corners[1],
        corners[2]
      )

    );

  const srcPoints =
    cv.matFromArray(
      4,
      1,
      cv.CV_32FC2,
      [

        corners[0].x,
        corners[0].y,

        corners[1].x,
        corners[1].y,

        corners[2].x,
        corners[2].y,

        corners[3].x,
        corners[3].y

      ]

    );


  const dstPoints =
    cv.matFromArray(
      4,
      1,
      cv.CV_32FC2,
      [
        0,
        0,
        width,
        0,
        width,
        height,
        0,
        height
      ]

    );

  const transform =
    cv.getPerspectiveTransform(
      srcPoints,
      dstPoints
    );

  const output =
    new cv.Mat();

  cv.warpPerspective(
    src,
    output,
    transform,
    new cv.Size(
      width,
      height
    )
  );

  const canvas =
    document.createElement(
      "canvas"
    );

  cv.imshow(
    canvas,
    output
  );

  /*
    Cleanup
  */

  src.delete();
  gray.delete();
  blur.delete();
  edges.delete();
  contours.delete();
  hierarchy.delete();
  cardContour.delete();
  srcPoints.delete();
  dstPoints.delete();
  transform.delete();
  output.delete();

  return canvas;

}