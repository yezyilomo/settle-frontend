import React, { } from 'react';
import './Errors.css';
import { Link } from 'react-router-dom';


function PageError(props) {
    function refetch(e){
        if(props.refetch){
            props.refetch();
        }
    }

    return (
        <div class="col-12 text-center">
            <div class="col-12 page-error">
                <i class="error-icon fas fa-exclamation-triangle"></i>
                <div>Error,&nbsp;
                    <Link onClick={refetch}>
                        Try again
                    </Link>
                </div>
            </div>
        </div>
    );
}

function InlineError(props) {
    function refetch(e){
        if(props.refetch){
            props.refetch();
        }
    }

    return (
        <div class="col-12 text-center mx-0 px-0">
            <div class="col-12 inline-error py-1">
                <i class="error-icon fas fa-exclamation-triangle"></i>
                <div>Error,&nbsp;
                    <Link onClick={refetch}>
                        Try again
                    </Link>
                </div>
            </div>
        </div>
    );
}


function renderPageError (fetchAgain) {
    return <PageError refetch={fetchAgain}/>
}

function renderInlineError (fetchAgain) {
    return <InlineError refetch={fetchAgain}/>
}

export { PageError, InlineError, renderPageError, renderInlineError };
