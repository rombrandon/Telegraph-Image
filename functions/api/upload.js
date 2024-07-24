export async function onRequestPost(context) {  // Contents of context object
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

    // return response
    const albumName = req.headers.get('x-album-name')

    const info = JSON.stringify({
        albumName,
        type: typeof response,
        data: response.data,
        keys: Object.keys(response)
    });
    return new Response(info);
}
