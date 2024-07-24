export async function onRequestPost(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    // 相册
    // const formData = await request.formData()
    // const albumName = formData.get('x-album-name')

    const req = request.clone()
    const response = await fetch('https://telegra.ph/upload', {
        method: req.method,
        headers: req.headers,
        body: req.body,
    });

    const result = await response.json()

    // if (result && result[0] && result[0].src && albumName) {
    //     await env.telegraph_image_album.put(albumName, '')
    //     await env.telegraph_image_url.put(albumName + '_' + result[0].src, '')
    // }

    return new Response(JSON.stringify(result), {
        headers: { 'content-type': 'application/json' }
    })
}
