import React, { } from 'react';
import { } from 'react-router-dom';
import './ImageUploader.css';
import { Block} from './'
import { useLocalState } from '../hooks';

function ImageUploader(props){
    let images = props.src||[]
    images = images.map(img => ({img_link: img.src , img: img}))
    let [files, updateFiles] = useLocalState(images);

    let addImg = (e) => {
        let src = URL.createObjectURL(e.target.files[0]);
        updateFiles({
            action: "push",
            value: {
                img_link: src,
                img: {
                    id: null, tool_tip: null, is_main: true,
                    src: e.target.files[0]
                }
            }
        });
        if(props.onChange !== undefined){
            let value = files.map(file=>file.img)
            props.onChange(value);
        }
    }

    let removeImg = (img) => {
        updateFiles({
            action: "remove",
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
        <div class="row p-0 m-0 mt-3 mt-md-1 justify-content-center">
            {files.length > 0?
                <Block>
                    <div class="remove-main-img col-12">
                        <i class="far fa-times-circle" onClick={(e)=>{removeImg(files[0])}}></i>
                    </div>
                    <div class="main-img">
                        <img class="main-img-preview" src={src()} alt=""/>
                    </div>
                </Block>:
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
