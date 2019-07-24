import React, { } from 'react';
import { } from 'react-router-dom';
import './MultipleImageUploader.css';
import { Block} from './'
import { useLocalState } from '../hooks';

function MultipleImageUploader(props){
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
                    id: null, tool_tip: null, is_main: false,
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

    return (
        <div class="row p-0 m-0 mt-3 mt-md-1 justify-content-start">
            {files.map(img =>
                <Block>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-4 py-1 px-1 m-0">
                        <div class="col-12 p-0 m-0">
                            <div class="other-img col-12">
                                <i class="remove-other-img far fa-times-circle" onClick={(e)=>{removeImg(img)}}></i>
                                <img src={img.img_link} alt="" />
                            </div>
                        </div>
                    </div>
                </Block>
            )}
            <label for={props.name} class="other-file-input-label">
                <div class="upload-other-img d-flex flex-column align-content-center justify-content-center flex-wrap">
                    <div class="d-flex flex-row justify-content-end mt-2">
                        <span class="camera fa fa-camera"/>
                        <span class="plus fa fa-plus"/>
                    </div>
                </div>
            </label>
            <input type="file" name={props.name} class="file-input" id={props.name} onChange={addImg}/>
        </div>
    );
}


export {MultipleImageUploader}
