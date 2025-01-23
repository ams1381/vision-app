import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="container">
    <div class="preview-container"></div>
    <div class="colorized-list-container">
        
    </div>
    <div class="toolbar">
        <div class="model-selector-container">
            <p style="color: gray">select model</p>
            <div class="radio-input-container active">
                <input class="model-input" name="modelName" id="eccv16" type="radio" checked />
                <label for="eccv16">eccv16</label>
            </div>
            <div class="radio-input-container">
               <input class="model-input" name="modelName" id="siggraph17" type="radio" />
               <label for="siggraph17">siggraph17</label>
            </div>
        </div>
        <label for="file-input" class="input-label">
            Upload Your Image/Video
    
        </label>
    </div>
    <input type="file" id="file-input" />
  </div>
`

