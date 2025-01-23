import {toastError} from "./utils";

const colorizedList = document.querySelector('.colorized-list-container') as HTMLDivElement;

export const updateFilesList = async () => {
    try {
        // @ts-ignore
        const response = await axios.get('http://127.0.0.1:8000/Host/files');
        const files = response.data; // Assuming the response contains an array of files

        colorizedList.innerHTML = ''; // Clear the current list

        files.forEach((file: { name: string, url: string, type: string }) => {
            const listItem = document.createElement('div');
            listItem.className = 'file-item';

            if (file.type === 'image') {
                listItem.innerHTML = `
                    <img src="${file.url}" alt="${file.name}" class="file-preview">
                    <a href="#" class="file-download" data-filename="${file.name}">${file.name}</a>
                `;
            } else if (file.type === 'video') {
                listItem.innerHTML = `
                    <video src="${file.url}" class="file-preview" controls></video>
                    <a href="#" class="file-download" data-filename="${file.name}">${file.name}</a>
                `;
            } else {
                listItem.innerHTML = `
                    <a href="#" class="file-download" data-filename="${file.name}">${file.name}</a>
                `;
            }

            listItem.querySelector('.file-download')?.addEventListener('click', async (event: Event) => {
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
        const response = await axios.get(`http://127.0.0.1:8000/Host/download/${filename}/`, {
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