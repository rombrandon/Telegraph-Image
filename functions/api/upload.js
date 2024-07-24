export async function onRequestPost(context) {  // Contents of context object
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    const clonedRequest = request.clone()
    const url = new URL(clonedRequest.url)
    const response = await fetch('https://telegra.ph/upload', {
        method: clonedRequest.method,
        headers: clonedRequest.headers,
        body: clonedRequest.body,
    });

    // response.headers.set('x-log', JSON.stringify(params))

    return response
}
