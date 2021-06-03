import React from 'react';
import './InfoModal.scss';
import { Modal } from 'react-bootstrap';
import { setTabColorDark } from '../utils';


function InfoModal(props) {
    setTabColorDark(props.modalShow, "#151515");
    
    let bottomModalClass = '';
    if(props.positionBottom){
        bottomModalClass = 'bottom-info-modal';
    }
    
    return (
        <Modal className={`info-modal ${bottomModalClass}`} animation={false} 
            dialogClassName="custom-modal-dialog"  backdropClassName="info-modal-backdrop"
            show={props.modalShow} onHide={() => props.setModalShow(false)} size="lg"
            aria-labelledby="contained-modal-title-vcenter" scrollable centered>
            <div class="modal-close" onClick={() => props.setModalShow(false)}>
                <span class="icon icon-close"></span>
            </div>
            <Modal.Header className="modal-header p-2 pt-3 bg-light">
                <span class="modal-title">{props.header}</span>
            </Modal.Header>
            <Modal.Body className="modal-body p-0 m-0 pb-5 bg-light">
                {props.children}
            </Modal.Body>
        </Modal>
    );
}

export { InfoModal }