async function fileEncode (env, file) {
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    for (let i = 0; i < uint8Array.length; i += env.IMAGE_ENCODE_STEP) {
        uint8Array[i] = uint8Array[i] + env.IMAGE_ENCODE_OFFSET % 256
    }
    return new File([uint8Array], file.name, { type: file.type })
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
    for (let [name, file] of formData.entries()) {
        if (file instanceof File) {
            const _file = await fileEncode(env, file)
            formData.set(name, _file, _file.name)
        }
    }

    const response = await fetch('https://telegra.ph/upload', {
        method: request.method,
        headers: request.headers,
        body: formData,
    });

    const result = await response.json()

    // 相册
    const albumName = request.headers.get('x-album-name')
    await env.telegraph_image_album.put(albumName, '', {})

    // telegraph_image_album
    // telegraph_image_url
    // IMAGE_ENCODE_STEP
    // IMAGE_ENCODE_OFFSET

    const info = JSON.stringify({ result });
    return new Response(info);
}
