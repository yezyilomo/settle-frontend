import React, {useEffect} from 'react';
import './AddToHomeScreen.scss';


function AddToHomeScreen(props){
    useEffect(()=>{
        let deferredPrompt;
        const addBtn = document.querySelector('.add-button');
        const addBtnContainer = document.querySelector('.add-to-home-screen');
    
        window.addEventListener('beforeinstallprompt', (e) => {
            //Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt = e;
            // Update UI to notify the user they can add to home screen
            addBtnContainer.style.display = 'block';
    
            addBtn.addEventListener('click', (e) => {
                // hide our user interface that shows our A2HS button
                addBtnContainer.style.display = 'none';
                // Show the prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                    } else {
                        console.log('User dismissed the A2HS prompt');
                    }
                    deferredPrompt = null;
                });
            });
        });
    }, []);

    function removeAddToHomeScreen(e){
        const addBtnContainer = document.querySelector('.add-to-home-screen');
        addBtnContainer.style.display = "none";
    }

    return (
        <div class="add-to-home-screen">
            <div class="row p-0 m-0">
                <div class="col-10 m-0 add-button">Add Settle to home screen</div>
                <div class="col m-0 cancel-button" onClick={removeAddToHomeScreen}>
                    <span class="icon icon-close"></span>
                </div>
            </div>
        </div>
    );
}

export {AddToHomeScreen}