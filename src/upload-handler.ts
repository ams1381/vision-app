import "toastify-js/src/toastify.css";


const inputElement = document.querySelector('#file-input') as HTMLInputElement;
const previewContainer = document.querySelector('.preview-container') as HTMLDivElement;
const [eccv16,siggraph17] = document.querySelectorAll<HTMLInputElement>('.model-input');
const inputLabel = document.querySelector('.input-label') as HTMLLabelElement;
const toolbar= document.querySelector('.toolbar') as HTMLDivElement;

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
                    uploadHandler(file,fileType).then();
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


const uploadHandler = async (file : File,type : 'image' | 'video') => {
    // Host/upload/?model_name=&file_type=
    const lodingElement = document.querySelector('.loader') as HTMLSpanElement;
    const formData = new FormData();
    formData.append('file',file);

    try {
        lodingElement.classList.remove('hidden');
        // @ts-ignore
        await axios.post(`Host/upload/?model_name=${selectedModel}&file_type=${type}`,formData,{
            headers : {
                "Content-Type" : "multipart/form-data"
            }
        })
    } catch (error : any) {
        toastError('خطا در رنگی کردن تصویر');
    } finally {
        lodingElement.classList.add('hidden');
    }

}

// const fetchFilesHandler = async () => {
//     try {
//         await fetch('Host/files');
//     } catch (error) {
//
//     }
// }

const setUpImagePreview = (file: File) => {
    previewContainer.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="image" id="preview-image" >`;
}
const setUpVideoPreview = (file: File) => {
    previewContainer.innerHTML = `<video width="400" height="400" controls>
    <source src="${URL.createObjectURL(file)}" type="video/mp4">
        Your browser does not support the video tag.
    </video>`;


}
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


const toastError = (content : string) => {
    // @ts-ignore
    Toastify({
        text: content ,
        duration: 3000, // مدت زمان نمایش به میلی‌ثانیه
        gravity: "top", // "top" یا "bottom"
        position: "right", // "left", "center" یا "right"
        backgroundColor: "#d90000", // رنگ پس‌زمینه
    }).showToast();
}

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
