export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');

    // 1. Policy File Validation
    // Matches: /.well-known/openpgpkey/[domain]/policy
    if (
      pathParts[1] === '.well-known' && 
      pathParts[2] === 'openpgpkey' && 
      pathParts[4] === 'policy'
    ) {
      return new Response('', {
        status: 200,
        headers: { 
          'Content-Type': 'text/plain', 
          'Access-Control-Allow-Origin': '*', // Bypasses browser CORS validator blocks
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // 2. Key Lookup Path
    // Matches: /.well-known/openpgpkey/[domain]/hu/[hash]
    if (
      pathParts[1] === '.well-known' && 
      pathParts[2] === 'openpgpkey' && 
      pathParts[4] === 'hu' && 
      pathParts[5]
    ) {
      const wkdHash = pathParts[5]; // Extracts the 32-char Z-Base-32 hash accurately

      try {
        // Read the database entry natively as an ArrayBuffer (Binary)
        const keyBuffer = await env.WKD_STORAGE.get(wkdHash, { type: 'arrayBuffer' });

        if (keyBuffer !== null) {
          // Stream the raw bytes instantly to the mail client with no processing loops
          return new Response(keyBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'application/octet-stream',
              'Content-Length': keyBuffer.byteLength.toString(),
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'public, max-age=3600',
              'X-Content-Type-Options': 'nosniff'
            }
          });
        }
      } catch (err) {
        return new Response('Not Found', { status: 404 });
      }
    }
    return new Response('Not Found', { status: 404 });
  }
};
