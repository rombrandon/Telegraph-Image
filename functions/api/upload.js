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

    const logs = []
    const body = new FormData()
    const formData = await request.formData()
    for (let [name, file] of formData.entries()) {
        logs.push('formData.' + name)
        if (file instanceof File) {
            logs.push('file.' + file.name)
            logs.push('file.' + file.size)
            const _file = await fileEncode(env, file)
            logs.push('_file.' + _file.name)
            logs.push('_file.' + _file.size)
            formData.delete(name)
            formData.append(name, _file, _file.name)
            body.append(name, file, file.name)
            // body.append(name, _file, _file.name)
        }
    }



    const response = await fetch('https://telegra.ph/upload', {
        method: request.method,
        headers: request.headers,
        body: body,
    });

    const result = await response.json()

    // 相册
    const albumName = formData.get('x-album-name')
    await env.telegraph_image_album.put(albumName, '', {})

    // telegraph_image_album
    // telegraph_image_url
    // IMAGE_ENCODE_STEP
    // IMAGE_ENCODE_OFFSET

    const info = JSON.stringify({ result, logs });
    return new Response(info);
}
