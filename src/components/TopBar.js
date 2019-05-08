import React from 'react';
import {Link} from 'react-router-dom';
import './TopBar.css';

function TopBar(props) {
    return (
        <nav class="navbar fixed-top  navbar-expand-lg navbar-light bg-white p-1 p-lg-2" id="top-navbar">
            <div class="navbar-brand col-1 col-sm-2 col-md-2 col-lg-3 px-0 py-1">
                <Link class="click-effect col-12 col-sm-4 px-0 px-sm-2 py-2" to="/">Settle</Link>
            </div>

            <form class="form-inline m-0 p-0 col-7 col-sm-8 col-md-8 col-lg-6">
                <input class="search-input form-control m-0 col-12 col-sm-9 col-md-9 rounded" type="search"
                    placeholder="Search..." aria-label="Search" />
                <button class="search-button btn m-0 px-sm-3 d-none d-sm-block" type="submit">
                    <i class="fa fa-search" />
                </button>
            </form>

            <button class="navbar-toggler" type="button" data-toggle="collapse"
                data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03"
                aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse col-lg-3 m-0 px-0 px-lg-3" id="navbarTogglerDemo03">
                <hr class="d-lg-none m-0 p-0 mt-3 mt-lg-0"/>
                <ul class="navbar-nav ml-0 ml-lg-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
                        <hr class="p-0 m-0 d-lg-none"/>
                    </li>
                    <li class="nav-item d-lg-none" data-toggle="collapse" data-target="#navbarTogglerDemo03">
                        <Link class="nav-link" to="/filter">Quick Filter <span class="sr-only">(current)</span></Link>
                        <hr class="p-0 m-0 d-lg-none"/>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/">Help</a>
                        <hr class="p-0 m-0 d-lg-none"/>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/">Sign up</a>
                        <hr class="p-0 m-0 d-lg-none"/>
                    </li>
                    <li class="nav-item dropdown pb-0 pb-lg-0">
                        <a class="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Profile
                        </a>
                        <div class="dropdown-menu dropdown-menu-right border-xs-0 border-lg-1 py-0 my-0 mt-lg-3" aria-labelledby="navbarDropdown">
                            <div class="dropdown-divider d-lg-none py-0 my-0"></div>
                            <a class="dropdown-item py-2" href="/">Edit Info</a>
                            <div class="dropdown-divider py-0 my-0"></div>
                            <a class="dropdown-item py-2" href="/">Manage</a>
                            <div class="dropdown-divider py-0 my-0"></div>
                            <a class="dropdown-item py-2" href="/">My Properties</a>
                        </div>
                    </li>
                </ul>

            </div>
        </nav>
    );
}

export { TopBar };