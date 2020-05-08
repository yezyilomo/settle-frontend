import React from 'react';
import './ConfirmModal.scss';
import { Button, Modal } from 'react-bootstrap';
import { setTabColorDark } from '../utils';


function ConfirmModal(props) {
    setTabColorDark(props.modalShow);

    return (
        <Modal animation={false} className="confirm-modal" backdropClassName="confirm-modal-backdrop" show={props.modalShow} onHide={() => props.setModalShow(false)} size={props.size} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body className="modal-body p-4 m-0 bg-light">
                {props.text}
            </Modal.Body>
            <Modal.Footer className="modal-footer px-4 py-2 m-0 bg-light">
                {props.options.map(option =>
                    <Button className="col-3" variant={option.variant} onClick={option.onClick}>{option.label}</Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export { ConfirmModal }
