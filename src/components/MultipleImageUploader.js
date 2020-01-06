import React, { useEffect } from 'react';
import { } from 'react-router-dom';
import './MultipleImageUploader.css';
import { useLocalState } from 'simple-react-state';

function MultipleImageUploader(props){
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
                    id: null, tool_tip: null, is_main: false,
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

        if(props.onDelete !== undefined){
            props.onDelete(img.img)
        }
    }

    return (
        <div class="row p-0 m-0 justify-content-start">
            {files.map(img =>
                <>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-4 m-0 py-1 px-1">
                        <div class="p-0 m-0 row">
                            <i class="fas fa-times remove-other-img" onClick={(e)=>{removeImg(img)}}></i>
                            <div class="other-img col-12">
                                <img src={img.img_link} alt="" />
                            </div>
                        </div>
                    </div>
                </>
            )}
            <label for={props.name} class="other-file-input-label">
                <div class="upload-other-img m-0 py-1 px-1 d-flex flex-column align-content-center justify-content-center flex-wrap">
                    <div class="d-flex flex-row justify-content-end m-0 p-0">
                        <span class="camera fa fa-camera"/>
                        <span class="plus fa fa-plus"/>
                    </div>
                </div>
            </label>
            <input type="file" accept="image/*" name={props.name} class="file-input" id={props.name} onChange={addImg}/>
        </div>
    );
}


export {MultipleImageUploader}
