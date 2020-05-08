import React from 'react';
import './InfoModal.scss';
import { Modal } from 'react-bootstrap';


function InfoModal(props) {
    var metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (props.modalShow) {
        metaThemeColor.setAttribute("content", "rgb(14, 14, 14)");
    }
    else {
        metaThemeColor.setAttribute("content", "white");
    }

    return (
        <Modal className="info-modal" animation={false} dialogClassName="cusom-modal-dialog"
            show={props.modalShow} onHide={() => props.setModalShow(false)} size="lg"
            aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header className="modal-header p-2 pt-3 bg-light" closeButton>
                <Modal.Title>
                    <h4 class="modal-title">{props.header}</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body p-0 m-0 pb-5 bg-light">
                {props.children}
            </Modal.Body>
        </Modal>
    );
}

export { InfoModal }