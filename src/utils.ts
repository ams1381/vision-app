const previewContainer = document.querySelector('.preview-container') as HTMLDivElement;

export const setUpImagePreview = (file: File) => {
    previewContainer.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="image" id="preview-image" >`;
}

export const setUpVideoPreview = (file: File) => {
    previewContainer.innerHTML = `<video width="400" height="400" controls>
    <source src="${URL.createObjectURL(file)}" type="video/mp4">
        Your browser does not support the video tag.
    </video>`;
}

export const toastError = (content : string,background? : string) => {
    // @ts-ignore
    Toastify({
        text: content ,
        duration: 3000, // مدت زمان نمایش به میلی‌ثانیه
        gravity: "top", // "top" یا "bottom"
        position: "right", // "left", "center" یا "right"
        backgroundColor: background ?? "#d90000", // رنگ پس‌زمینه
    }).showToast();
}