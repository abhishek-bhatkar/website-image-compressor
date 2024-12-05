# Website Image Compressor

A browser-based tool that allows you to download and compress images from any website. Simply enter a website URL, and this tool will fetch all images and compress them automatically. Perfect for content creators, developers, and anyone who needs to optimize images from the web.

[![GitHub license](https://img.shields.io/github/license/abhishek-bhatkar/website-image-compressor)](https://github.com/abhishek-bhatkar/website-image-compressor/blob/main/LICENSE)

## 🌟 Live Demo

Try it now: [Website Image Compressor](https://abhishek-bhatkar.github.io/website-image-compressor)

## 🚀 Features

- 📥 Download images from any website
- 🗜️ Automatic image compression
- 📊 Shows original vs compressed size comparison
- 📦 Bulk download as ZIP
- 🎯 Smart filtering of tracking pixels and ads
- 💻 No backend required - runs entirely in browser
- 🎨 Clean, modern UI with Tailwind CSS

## 🛠️ Technologies Used

- HTML5
- JavaScript (ES6+)
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) - For image compression
- [JSZip](https://stuk.github.io/jszip/) - For creating ZIP archives
- [AllOrigins](https://allorigins.win/) - CORS proxy for fetching website content

## 🚦 Quick Start

### Option 1: Direct Use
Visit [https://abhishek-bhatkar.github.io/website-image-compressor](https://abhishek-bhatkar.github.io/website-image-compressor)

### Option 2: Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/abhishek-bhatkar/website-image-compressor.git
   cd website-image-compressor
   ```

2. Start a local server:
   ```bash
   # Using Python 3
   python3 -m http.server 3000
   
   # Or using Node.js
   npx serve
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 📝 How to Use

1. Enter a website URL in the input field
2. Click "Fetch Images" to start downloading and processing images
3. Wait for the images to be processed
4. You can:
   - Download individual images by clicking their respective download buttons
   - Download all compressed images as a ZIP file using the "Download All" button

## ⚙️ Features in Detail

### Image Filtering
- Automatically filters out tracking pixels and ad-related images
- Excludes images smaller than 100 bytes
- Skips images larger than 15MB
- Removes duplicate images
- Filters out tiny images (less than 10x10 pixels)

### Image Compression
- Compresses images while maintaining quality
- Maximum output size: 1MB
- Maximum width/height: 1920px
- Uses Web Workers when available for better performance

### Error Handling
- Timeout for slow image downloads (10 seconds)
- Graceful handling of CORS issues
- Detailed error reporting
- Progress updates during processing

## 🔒 Security Features

- All processing happens client-side
- No data is sent to external servers (except through the CORS proxy)
- No storage of user data
- Safe handling of cross-origin requests

## 💡 Tips

- For best results, use websites that don't block image downloads
- Some websites may block cross-origin requests
- Large websites with many images may take longer to process
- The tool works best with standard image formats (JPEG, PNG, GIF, WebP)

## ⚠️ Limitations

- Some websites may block image downloads due to CORS policies
- Very large images (>15MB) are skipped
- Some websites may detect and block automated access
- Browser memory limitations may affect processing of many large images

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Abhishek Bhatkar
- GitHub: [@abhishek-bhatkar](https://github.com/abhishek-bhatkar)
