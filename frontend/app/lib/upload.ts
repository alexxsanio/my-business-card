/**
 * Sends business card data to Flask backend.
 *
 * Backend endpoint:
 *
 * POST /api/save_businesscard
 *
 * FormData:
 *  - name
 *  - title
 *  - business_card
 */


const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";



export interface BusinessCardResponse {
  success: boolean;
  message?: string;
  data?: {
    name:string;
    title:string;
    business_card:string;
  };
}

export async function uploadBusinessCard(
  file:File,
  name:string,
  title:string
):Promise<BusinessCardResponse>{

  const formData =
    new FormData();

  formData.append(
    "name",
    name
  );

  formData.append(
    "title",
    title
  );

  formData.append(
    "business_card",
    file
  );

  const response =
    await fetch(
      `${BACKEND_URL}/api/save_businesscard`,
      {
        method:"POST",
        body:formData,
      }
    );

  const data =
    await response.json();

  if(!response.ok){
    throw new Error(
      data.message ||
      "Upload failed"
    );
  }

  return data;

}