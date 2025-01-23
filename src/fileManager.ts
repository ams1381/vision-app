import { toastError } from "./utils";

const colorizedList = document.querySelector('.colorized-list-container') as HTMLDivElement;

export const updateFilesList = async () => {
    try {
        // @ts-ignore
        const response = await axios.get('http://127.0.0.1:8000/files');
        const files = response.data.result; // Access the array of file names under the "result" key

        colorizedList.innerHTML = ''; // Clear the current list

        files.forEach((fileName: string) => {
            const listItem = document.createElement('div');
            listItem.className = 'file-item';

            // Determine the file type based on the file extension
            const fileExtension = fileName.split('.').pop()?.toLowerCase();
            const isImage = fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg';
            const isVideo = fileExtension === 'mp4';

            // Construct the file URL (adjust this based on your server's file-serving logic)
            const fileUrl = `http://127.0.0.1:8000/preview/${fileName}`;

            if (isImage) {
                listItem.innerHTML = `
                    <img src="${fileUrl}" alt="${fileName}" class="file-preview">
                    <button class="file-download-btn" data-filename="${fileName}">Download</button>
                `;
            } else if (isVideo) {
                listItem.innerHTML = `
                    <video src="${fileUrl}" class="file-preview" controls></video>
                    <button class="file-download-btn" data-filename="${fileName}">Download</button>
                `;
            } else {
                listItem.innerHTML = `
                    <button class="file-download-btn" data-filename="${fileName}">Download</button>
                `;
            }

            // Add a click event listener to the download button
            const downloadButton = listItem.querySelector('.file-download-btn');
            downloadButton?.addEventListener('click', async (event: Event) => {
                event.preventDefault();
                const filename = (event.target as HTMLElement).getAttribute('data-filename');
                if (filename) {
                    await downloadFile(filename);
                }
            });

            colorizedList.appendChild(listItem);
        });
    } catch (error) {
        toastError('خطا در دریافت لیست فایل‌ها');
        console.error('Error fetching files:', error);
    }
};

const downloadFile = async (filename: string) => {
    try {
        // @ts-ignore
        const response = await axios.get(`http://127.0.0.1:8000/files/${filename}/`, {
            responseType: 'blob', // Ensure the file is downloaded as a Blob
        });

        // Create a URL for the Blob and trigger download
        const url = URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        toastError('خطا در دانلود فایل');
        console.error('Error downloading file:', error);
    }
};