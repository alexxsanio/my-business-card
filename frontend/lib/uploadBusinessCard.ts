export async function uploadBusinessCard(
    image: Blob,
    name: string,
    title: string
) {
    const form = new FormData();

    form.append(
        "business_card",
        image,
        "business_card.png"
    );

    form.append("name", name);

    form.append("title", title);

    const response = await fetch(
        "http://localhost:5000/api/save_businesscard",
        {
            method: "POST",
            body: form,
        }
    );

    if (!response.ok) {
        throw new Error("Upload failed");
    }

    return response.json();
}