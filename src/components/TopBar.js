import React from 'react';
import {Link} from 'react-router-dom';
import './TopBar.css';

function TopBar(props) {
    return (
        <nav class="navbar fixed-top  navbar-expand-lg navbar-light bg-light p-2" id="top-navbar">
            <div class="navbar-brand col-1 col-sm-2 col-md-2 col-lg-3 px-0 py-1">
                <Link class="col-12 col-sm-4 px-0 px-sm-2 py-3" to="/">Settle</Link>
            </div>

            <form class="form-inline m-0 p-0 col-7 col-sm-8 col-md-8 col-lg-6">
                <input class="search-input form-control m-0 col-12 col-sm-9 col-md-9 rounded" type="search"
                    placeholder="Search..." aria-label="Search" />
                <button class="search-button btn btn-info m-0 px-sm-3 d-none d-sm-block" type="submit">
                    <i class="fa fa-search" />
                </button>
            </form>

            <button class="navbar-toggler" type="button" data-toggle="collapse"
                data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03"
                aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse col-lg-3 ml-2" id="navbarTogglerDemo03">
                <hr class="p-0 m-0 d-lg-none"/>
                <ul class="navbar-nav ml-auto mt-1 mt-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
                        <hr class="p-0 m-0 d-lg-none"/>
                    </li>
                    <li class="nav-item d-lg-none" data-toggle="collapse" data-target="#navbarTogglerDemo03">
                        <Link class="nav-link" to="/filter">Quick Filter <span class="sr-only">(current)</span></Link>
                        <hr class="p-0 m-0 d-lg-none"/>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/">Disabled</a>
                        <hr class="p-0 m-0 d-lg-none"/>
                    </li>
                    <li class="nav-item dropdown pb-3 pb-lg-0">
                        <a class="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Yezy
                        </a>
                        <hr class="p-0 m-0 d-lg-none"/>
                        <div class="dropdown-menu dropdown-menu-right border-0 bg-light" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="/">Action</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="/">Another action</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="/">Something else here</a>
                            <div class="dropdown-divider"></div>
                        </div>
                    </li>
                </ul>

            </div>
        </nav>
    );
}

export { TopBar };