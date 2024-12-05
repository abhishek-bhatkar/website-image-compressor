importScripts('https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.1/dist/browser-image-compression.js');

self.onmessage = async function(event) {
    const { imageBlob, options } = event.data;
    try {
        const compressedBlob = await imageCompression(imageBlob, options);
        self.postMessage({ status: 'success', compressedBlob });
    } catch (error) {
        self.postMessage({ status: 'error', error: error.message });
    }
};
