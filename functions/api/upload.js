function encode (env, arrayBuffer) {
    const uint8Array = new Uint8Array(arrayBuffer)
    for (let i = 0; i < uint8Array.length; i += env.IMAGE_ENCODE_STEP) {
        uint8Array[i] = uint8Array[i] + env.IMAGE_ENCODE_OFFSET % 256
    }
    const blob = new Blob([uint8Array], { type: 'application/octet-stream' })
    const formData = new FormData()
    formData.append('file', blob, 'filename.bin')
}


export async function onRequestPost(context) {  // Contents of context object
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    const formData = await request.formData()
    if (formData.has('file')) {
        const file = formData.get('file')

        return new Response(JSON.stringify({
            name: file.name
        }));
    }
    const req = request.clone()
    const response = await fetch('https://telegra.ph/upload', {
        method: req.method,
        headers: req.headers,
        body: req.body,
    });

    //context.env.BASIC_USER="admin"

    console.log(request)
    // return response
    const albumName = req.headers.get('x-album-name')

    const arrayBuffer = await request.body.arrayBuffer()

    // telegraph_image_album
    // telegraph_image_url
    // IMAGE_ENCODE_STEP
    // IMAGE_ENCODE_OFFSET

    const info = JSON.stringify({
        text: await response.json(),
        headers: response.headers,


        ok: response.ok,

        redirected: response.redirected,
        status: response.status,
        statusText: response.statusText,
        type: response.type,
        url: response.url,

        albumName,
    });
    return new Response(info);
}
