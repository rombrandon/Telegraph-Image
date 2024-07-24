export async function onRequestPost(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;


    const req = request.clone()
    const response = await fetch('https://telegra.ph/upload', {
        method: req.method,
        headers: req.headers,
        body: req.body,
    });

    const result = await response.json()

    // 相册
    const albumName = request.headers.get('x-album-name')

    if (result && result[0] && result[0].src && albumName) {
        const src = result[0].src.replace('/file/', '#')
        await env.telegraph_image_album.put(albumName, '')
        await env.telegraph_image_url.put(albumName + src, '')
    }

    return new Response(JSON.stringify(result), {
        headers: { 'content-type': 'application/json' }
    })
}
