async function uploadImage(file) {
    const blob = await put(file.name, file, {
        access: "public",
    });
    return blob;
}
