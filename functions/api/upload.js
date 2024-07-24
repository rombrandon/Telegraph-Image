export async function onRequestPost(context) {
    const req = context.request.clone()
    const response = await fetch('https://telegra.ph/upload', {
        method: req.method,
        headers: req.headers,
        body: req.body,
    });

    const result = await response.json()

    // 相册
    const formData = await context.request.formData()
    const albumName = formData.get('x-album-name')

    if (result?.[0]?.src && albumName) {
        await context.env.telegraph_image_album.put(albumName, '', {})
        await context.env.telegraph_image_url.put(`${albumName}_${result[0].src}`, '', {})
    }
    return response
}
