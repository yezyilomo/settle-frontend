import React, { useEffect, useState } from 'react';
import './ProfilePictureUploader.scss';
import { Modal, Spinner } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import { cropImage } from '../utils';
import 'react-image-crop/lib/ReactCrop.scss';


function ProfilePictureUploader(props) {
    let initialImageState = null;
    if (props.src) {
        initialImageState = {
            src: props.src,
            file: undefined
        }
    }
    else {
        initialImageState = {
            src: null,
            file: undefined
        }
    }

    let [image, setImage] = useState(initialImageState);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [imageToCropDimensions, setImageToCropDimensions] = useState({
        width: 0,
        height: 0
    });
    const [isLoading, setLoading] = useState(false);
    const [crop, setCrop] = useState({
        unit: '%',
        aspect: 1,
        width: 100,
        height: 100,
        x: 0,
        y: 0
    });

    // Trigger sythentic onChange event when files is updated
    useEffect(() => {
        if (props.onChange !== undefined) {
            props.onChange(image.file);
        }
    }, [image]);


    let removePicture = (img) => {
        setImage({
            src: null,
            file: null
        });
    }

    let addImage = (e) => {
        let file = e.target.files[0];
        // Reset file input
        e.target.value = null;
        // Reset crop dimensions
        setCrop({
            unit: '%',
            aspect: 1,
            width: 100,
            height: 100,
            x: 0,
            y: 0
        });

        setImageToCrop(file);
    }

    function saveImage(blob) {
        blob.lastModifiedDate = new Date();
        blob.name = imageToCrop.name.replace(/\./g, '') + ".jpeg";

        let src = URL.createObjectURL(blob);

        setImage({
            src: src,
            file: blob
        });

        setImageToCrop(null);
        setLoading(false);
    }

    function finishCroping(e) {
        setLoading(true);
        let img = document.createElement('img');
        img.src = URL.createObjectURL(imageToCrop);
        img.height = imageToCropDimensions.height;
        img.width = imageToCropDimensions.width;
        cropImage(img, crop, saveImage)
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
        <>
            <Modal animation={false} scrollable={true} className={`crop-image-modal ${props.modalClass || ''}`}
                dialogClassName="custom-modal-dialog" show={imageToCrop !== null}
                onHide={() => setImageToCrop(null)} size="lg" aria-labelledby="" centered>
                <div class="modal-close" onClick={() => setImageToCrop(null)}>
                    <span class="icon icon-close"></span>
                </div>
                <Modal.Body className="p-0 m-0 modal-body">
                    <ReactCrop className="crop-img" src={imageToCropSrc()}
                        crop={crop} onChange={newCrop => setCrop(newCrop)}
                        circularCrop onImageLoaded={setImageDimensions} />
                    <div class="col-12 text-center crop-done-btn">
                        <div class="btn btn-primary mt-2 col-6 col-md-3" onClick={finishCroping}>
                            {isLoading ? <Spinner animation="border" size="sm" /> : 'Done'}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <div class="profile-picture-container text-center">
                <input type="file" accept="image/*" name={props.name} id={props.name} class="file-input" onChange={addImage} />
                {!image.src ?
                    <label for={props.name} class="file-input-label w-100 h-100">
                        <span class="icon icon-user" />
                    </label> :
                    <img class="profile-picture-preview" src={image.src} alt="" />
                }
            </div>
            {image.src ?
                <div class="profile-picture-remove">
                    <i class="fas fa-times profile-picture-remove-icon" onClick={(e) => { removePicture(image) }}></i>
                </div> :
                <div>Upload Profile Picture</div>
            }
        </>
    );
}


export { ProfilePictureUploader }
