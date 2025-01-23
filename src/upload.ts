import {toastError} from "./utils";

export const uploadHandler = async (file : File,type : 'image' | 'video',selectedModel : string) => {
    // Host/upload/?model_name=&file_type=
    const loadingElement = document.querySelector('.loader') as HTMLSpanElement;
    const formData = new FormData();
    formData.append('file',file);

    try {
        loadingElement.classList.remove('hidden');
        // @ts-ignore
        let response : Response = await axios.post(`http://127.0.0.1:8000/Host/upload/?model_name=${selectedModel}&file_type=${type}`,formData,{
            headers : {
                "Content-Type" : "multipart/form-data"
            }
        })
        if(response.status === 202) {
            toastError('به صف پردازش اضافه شد' , '#07ad02')
        }
    } catch (error : any) {
        toastError('خطا در رنگی کردن تصویر');
    } finally {
        loadingElement.classList.add('hidden');
    }

}