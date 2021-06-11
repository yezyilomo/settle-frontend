import React, { useState, useEffect } from 'react';
import './MultipleImageUploader.css';
import { useLocalState } from 'state-pool';
import { Modal, Spinner } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import { cropImage, getSuitableImageQuality, setTabColorDark } from '../utils';
import 'react-image-crop/lib/ReactCrop.scss';


function MultipleImageUploader(props) {
    let images = props.src || [];
    images = images.map(img => ({ img_link: img.src, img: img }));

    const [files, updateFiles] = useLocalState(images);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [imageToCropDimensions, setImageToCropDimensions] = useState({
        width: 0,
        height: 0
    });
    const [isLoading, setLoading] = useState(false);
    const [crop, setCrop] = useState({
        unit: '%',
        aspect: 1.5,
        width: 100,
        height: 100,
        x: 0,
        y: 0
    });

    setTabColorDark(imageToCrop !== null);

    // Trigger sythentic onChange event when files is updated
    useEffect(() => {
        if (props.onChange !== undefined) {
            let value = files.map(file => file.img)
            props.onChange(value);
        }
    }, [files]);


    let addImage = (e) => {
        let file = e.target.files[0];
        // Reset file input
        e.target.value = null;
        // Reset crop dimensions
        setCrop({
            unit: '%',
            aspect: 1.5,
            width: 100,
            height: 100,
            x: 0,
            y: 0
        });

        setImageToCrop(file);
    }

    let removeImg = (img) => {
        updateFiles(draftFiles => {
            return files.filter(file => file !== img);
        })

        if (props.onDelete !== undefined) {
            props.onDelete(img.img)
        }
    }

    function saveImage(blob) {
        blob.lastModifiedDate = new Date();
        blob.name = imageToCrop.name.replace(/\./g, '') + ".jpeg";

        let src = URL.createObjectURL(blob);

        updateFiles(files => {
            files.push({
                img_link: src,
                img: {
                    id: null, tool_tip: null,
                    is_main: false, src: blob
                }
            })
        });
        setImageToCrop(null);
        setLoading(false);
    }

    function finishCroping(e) {
        setLoading(true);
        let img = document.createElement('img');
        let quality = getSuitableImageQuality(imageToCrop.size)

        img.src = URL.createObjectURL(imageToCrop);
        img.height = imageToCropDimensions.height;
        img.width = imageToCropDimensions.width;
        cropImage(img, crop, saveImage, quality)
    }

    let setImageDimensions = (image) => {
        setImageToCropDimensions({ width: image.width, height: image.height });
    };

    let imageToCropSrc = () => {
        if (imageToCrop !== null) {
            return URL.createObjectURL(imageToCrop);
        }
        return null;
    }

    return (
        <div class="row p-0 m-0 justify-content-start">
            <Modal animation={false} scrollable={true} className="crop-image-modal"
                dialogClassName="custom-modal-dialog" show={imageToCrop !== null}
                onHide={() => setImageToCrop(null)} size="lg" aria-labelledby="" centered>
                <Modal.Body className="p-0 m-0 modal-body text-center">
                    <ReactCrop className="crop-img" src={imageToCropSrc()}
                        crop={crop} onChange={newCrop => setCrop(newCrop)}
                        onImageLoaded={setImageDimensions} keepSelection ruleOfThirds />
                    <div class="row p-0 m-0 text-center crop-done-btn">
                        <div class="col cancel-btn" onClick={() => setImageToCrop(null)}>
                            Cancel
                        </div>
                        <div class="col next-btn" onClick={finishCroping}>
                            {isLoading ? <Spinner animation="border" size="sm" /> : 'Next'}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {files.map(img =>
                <>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-4 m-0 py-1 px-1">
                        <div class="p-0 m-0 row">
                            <i class="fas fa-times remove-other-img" onClick={(e) => { removeImg(img) }}></i>
                            <div class="other-img col-12">
                                <div class="lazy-container">
                                    <img src={img.img_link} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <label for={props.name} class="other-file-input-label">
                <div class="upload-other-img m-0 py-1 px-1 d-flex flex-column align-content-center justify-content-center flex-wrap">
                    <div class="d-flex flex-row justify-content-end m-0 p-0">
                        <span class="camera fa fa-camera" />
                        <span class="plus fa fa-plus" />
                    </div>
                </div>
            </label>
            <input type="file" accept="image/*" name={props.name} class="file-input" id={props.name} onChange={addImage} />
        </div>
    );
}


export { MultipleImageUploader }
