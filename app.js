class ImageDownloader {
    constructor() {
        this.urlInput = document.getElementById('urlInput');
        this.fetchButton = document.getElementById('fetchButton');
        this.status = document.getElementById('status');
        this.imageContainer = document.getElementById('imageContainer');
        this.downloadAllBtn = document.getElementById('downloadAll');
        
        this.fetchButton.addEventListener('click', () => this.fetchImages());
        this.downloadAllBtn.querySelector('button').addEventListener('click', () => this.downloadAllImages());
        
        this.images = [];
        this.compressedImages = [];
    }

    showStatus(message) {
        this.status.textContent = message;
        this.status.classList.remove('hidden');
    }

    async fetchImages() {
        const url = this.urlInput.value;
        if (!url) {
            this.showStatus('Please enter a valid URL');
            return;
        }

        try {
            this.showStatus('Fetching images...');
            this.imageContainer.innerHTML = '';
            this.images = [];
            this.compressedImages = [];

            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            const data = await response.json();
            const html = data.contents;

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const imgSources = [...doc.getElementsByTagName('img')]
                .map(img => {
                    const src = img.src || img.getAttribute('data-src') || img.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0];
                    const width = parseInt(img.getAttribute('width')) || img.width || 0;
                    const height = parseInt(img.getAttribute('height')) || img.height || 0;
                    return { src, width, height };
                })
                .filter(({src, width, height}) => {
                    if (!src || !src.startsWith('http')) return false;
                    
                    const isTrackingPixel = src.includes('pixel') || 
                                          src.includes('tracker') || 
                                          src.includes('analytics') ||
                                          src.includes('adServer') ||
                                          src.includes('impression');
                    const isTinyImage = (width > 0 && width < 10) || (height > 0 && height < 10);
                    
                    return !isTrackingPixel && !isTinyImage;
                })
                .map(({src}) => src);

            if (imgSources.length === 0) {
                this.showStatus('No valid images found on this website');
                return;
            }

            this.showStatus(`Found ${imgSources.length} images. Processing...`);
            
            const batchSize = 5;
            for (let i = 0; i < imgSources.length; i += batchSize) {
                const batch = imgSources.slice(i, i + batchSize);
                await Promise.all(batch.map(src => this.processImage(src)));
                this.showStatus(`Processed ${Math.min(i + batchSize, imgSources.length)} of ${imgSources.length} images...`);
            }

            this.downloadAllBtn.classList.remove('hidden');
            this.showStatus(`Successfully processed ${this.images.length} images!`);

        } catch (error) {
            this.showStatus(`Error: ${error.message}`);
            console.error('Fetch error:', error);
        }
    }

    async processImage(src) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(src, { 
                signal: controller.signal,
                mode: 'cors',
                headers: {
                    'Accept': 'image/*'
                }
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = await response.blob();
            
            if (!blob.type.startsWith('image/')) return;
            if (blob.size < 100) return; // Skip if less than 100 bytes
            if (blob.size > 15 * 1024 * 1024) return; // Skip if larger than 15MB

            this.images.push(blob);

            const compressedBlob = await this.compressImage(blob);
            this.compressedImages.push(compressedBlob);

            this.displayImage(blob, compressedBlob);

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`Timeout while fetching image: ${src}`);
            } else {
                console.error(`Error processing image ${src}:`, error);
            }
        }
    }

    async compressImage(blob) {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };

        try {
            return await imageCompression(blob, options);
        } catch (error) {
            console.error('Error compressing image:', error);
            return blob; // Return original if compression fails
        }
    }

    displayImage(originalBlob, compressedBlob) {
        const div = document.createElement('div');
        div.className = 'bg-white p-4 rounded-lg shadow';

        const img = document.createElement('img');
        img.src = URL.createObjectURL(compressedBlob);
        img.className = 'w-full h-48 object-cover rounded mb-2';

        const originalSize = (originalBlob.size / 1024).toFixed(2);
        const compressedSize = (compressedBlob.size / 1024).toFixed(2);
        
        const info = document.createElement('div');
        info.className = 'text-sm text-gray-600';
        info.innerHTML = `
            Original: ${originalSize} KB<br>
            Compressed: ${compressedSize} KB<br>
            Saved: ${((originalBlob.size - compressedBlob.size) / originalBlob.size * 100).toFixed(1)}%
        `;

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'mt-2 w-full bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 text-sm';
        downloadBtn.textContent = 'Download';
        downloadBtn.onclick = () => this.downloadImage(compressedBlob);

        div.appendChild(img);
        div.appendChild(info);
        div.appendChild(downloadBtn);
        this.imageContainer.appendChild(div);
    }

    async downloadImage(blob) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `compressed-image-${Date.now()}.${blob.type.split('/')[1]}`;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    async downloadAllImages() {
        const zip = new JSZip();
        
        this.compressedImages.forEach((blob, index) => {
            zip.file(`compressed-image-${index + 1}.${blob.type.split('/')[1]}`, blob);
        });

        const zipBlob = await zip.generateAsync({type: 'blob'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(zipBlob);
        a.download = `compressed-images-${Date.now()}.zip`;
        a.click();
        URL.revokeObjectURL(a.href);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImageDownloader();
});
