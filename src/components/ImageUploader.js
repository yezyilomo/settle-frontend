import React, { useEffect } from 'react';
import { } from 'react-router-dom';
import './ImageUploader.css';
import { useLocalState } from 'simple-react-state';

function ImageUploader(props){
    let images = props.src||[]
    images = images.map(img => ({img_link: img.src , img: img}))
    let [files, updateFiles] = useLocalState(images);

    // Trigger sythentic onChange event when files is updated
    useEffect(() => {
        if(props.onChange !== undefined){
            let value = files.map(file=>file.img)
            props.onChange(value);
        }
    }, [files]);

    let addImg = (e) => {
        let src = URL.createObjectURL(e.target.files[0]);
        updateFiles({
            type: "PUSH",
            value: {
                img_link: src,
                img: {
                    id: null, tool_tip: null, is_main: true,
                    src: e.target.files[0]
                }
            }
        });
    }

    let removeImg = (img) => {
        updateFiles({
            type: "REMOVE",
            value: img
        })

        if(props.onChange !== undefined){
            let value = files.map(file=>file.img)
            props.onChange(value);
        }
        if(props.onDelete !== undefined){
            props.onDelete(img.img)
        }
    }

    let src = () => {
        if(files.length === 0){
            return null;
        }
        return files[0].img_link
    }

    return (
        <div class="row p-0 m-0 justify-content-center">
            {files.length > 0?
                <>
                    <i class="fas fa-times remove-main-img" onClick={(e)=>{removeImg(files[0])}}></i>
                    <div class="main-img">
                        <img class="main-img-preview" src={src()} alt=""/>
                    </div>
                </>:
                null
            }
            <input type="file" accept="image/*" name={props.name} id={props.name} class="file-input" onChange={addImg}/>
            {files.length === 0?
                <label for={props.name} class="file-input-label">
                    <div class="upload-main-img d-flex flex-column align-content-center justify-content-center flex-wrap">
                        <div>Upload main image</div>
                        <div class="d-flex flex-row justify-content-end">
                            <span class="camera fa fa-camera"/>
                            <span class="plus fa fa-plus"/>
                        </div>
                    </div>
                </label>:
                null
            }
        </div>
    );
}


export {ImageUploader}
