import "toastify-js/src/toastify.css";
import {setUpImagePreview, setUpVideoPreview, toastError} from "./utils";
import {uploadHandler} from "./upload";


const inputElement = document.querySelector('#file-input') as HTMLInputElement;
const previewContainer = document.querySelector('.preview-container') as HTMLDivElement;
const [eccv16,siggraph17] = document.querySelectorAll<HTMLInputElement>('.model-input');
const inputLabel = document.querySelector('.input-label') as HTMLLabelElement;
const toolbar= document.querySelector('.toolbar') as HTMLDivElement;
const colorizedList = document.querySelector('.colorized-list-container') as HTMLDivElement;


let selectedModel = 'eccv16';

if (inputElement) {
    inputElement.addEventListener('input', (event: Event) => {
        const fileList = (event.target as HTMLInputElement).files;

        if (fileList && fileList.length > 0) {
            Array.from(fileList).forEach((file) => {
                const fileType = getFileCategory(file);

                if(fileType !== 'image' && fileType !== 'video') {
                    toastError("لطفا عکس یا ویدیو آپلود کنید");
                    setTimeout(() => {
                        inputElement.value = ''
                    },200)
                    return
                }

                if (fileType === 'image') setUpImagePreview(file);
                else
                    setUpVideoPreview(file);
                inputLabel.style.display = 'none';
                let uploadButtonElement = new DOMParser().parseFromString(`<div class="upload-button">
                        Convert 
                        <span class="loader hidden"></span>
                </div>`,'text/html').body.firstChild as ChildNode;
                let resetButtonElement = new DOMParser().parseFromString(`<div class="reset-button">
                        reset 
                </div>`,'text/html').body.firstChild as ChildNode;
                uploadButtonElement.addEventListener('click',() => {
                    uploadHandler(file,fileType,selectedModel).then();
                })
                resetButtonElement.addEventListener('click',() => {
                    previewContainer.innerHTML = '';
                    inputLabel.style.display = 'flex';
                    uploadButtonElement.remove();
                    resetButtonElement.remove();
                    inputElement.value = ''
                });
                toolbar.append(uploadButtonElement,resetButtonElement);

                // uploadHandler(file,fileType).then();
            });
        }
    });
}




const updateFilesList = async () => {
    try {
        // @ts-ignore
        const response = await axios.get('Host/files');
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
        const response = await axios.get(`Host/download/${filename}/`, {
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



eccv16.addEventListener('input',() => {
    selectedModel = 'eccv16'
    // @ts-ignore
    eccv16.parentNode!.classList.add('active');
    // @ts-ignore
    siggraph17.parentNode!.classList.remove('active');
})
siggraph17.addEventListener('input',() => {
    selectedModel = 'siggraph17'
    // @ts-ignore
    eccv16.parentNode!.classList.remove('active');
    // @ts-ignore
    siggraph17.parentNode!.classList.add('active');
})




function getFileCategory(file: File): string {
    const mimeType = file.type;

    if (mimeType.startsWith('image/')) {
        return 'image';
    } else if (mimeType.startsWith('video/')) {
        return 'video';
    } else if (mimeType.startsWith('audio/')) {
        return 'audio';
    } else if (
        mimeType === 'application/pdf' ||
        mimeType.startsWith('text/') ||
        mimeType.startsWith('application/vnd.')
    ) {
        return 'document';
    } else {
        return 'other';
    }
}
setInterval(updateFilesList, 2 * 60 * 1000);