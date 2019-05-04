import React from 'react';
import { Route } from 'react-router-dom';
import './Home.css';
import { PropertyGroup, SideBar, TopBar, Block, PropertyDetails } from './'

function Home(props) {
    let groupOne = [
        {
            price: 358,
            rating: 2,
            id: 1,
            category: "Rent",
            currency: "$",
            img: "https://a0.muscache.com/im/pictures/98853527/0780c37c_original.jpg",
            location: "Makumbusho, Dar es salaam",
            payment_terms: 5,
            unit_of_payment_terms: "Month"
        },
        {
            price: 230,
            rating: 3,
            id: 2,
            category: "Rent",
            currency: "$",
            img: "https://a0.muscache.com/im/pictures/939d23fe-ba17-468f-8a75-bc02fbf2300f.jpg",
            location: "Makumbusho, Dar es salaam",
            payment_terms: 10,
            unit_of_payment_terms: "Month"
        },
        {
            price: 432,
            rating: 5,
            id: 3,
            category: "Rent",
            currency: "$",
            img: "https://a0.muscache.com/im/pictures/98853843/545fc632_original.jpg",
            location: "Makumbusho, Dar es salaam",
            payment_terms: 6,
            unit_of_payment_terms: "Month"
        },
        {
            price: 554,
            rating: 1,
            id: 4,
            category: "Rent",
            currency: "$",
            img: "https://a0.muscache.com/im/pictures/c3ea4623-9f14-44d8-9426-ef58d3bd8acf.jpg",
            location: "Makumbusho, Dar es salaam",
            payment_terms: 6,
            unit_of_payment_terms: "Month"
        }
    ]

    let groupTwo = [
        {
            price: 440,
            rating: 4,
            id: 5,
            category: "Sale",
            currency: "$",
            img: "https://a0.muscache.com/im/pictures/98a003c3-3366-4d3f-ba2c-820f83d34d47.jpg",
            location: "Makumbusho, Dar es salaam",
            payment_terms: 5,
            unit_of_payment_terms: "Month"
        },
        {
            price: 450,
            rating: 3,
            id: 6,
            category: "Sale",
            currency: "$",
            img: "https://a0.muscache.com/im/pictures/65125756/be3ddba8_original.jpg",
            location: "Makumbusho, Dar es salaam",
            payment_terms: 10,
            unit_of_payment_terms: "Month"
        },
        {
            price: 270,
            rating: 1,
            id: 7,
            category: "Sale",
            currency: "$",
            img: "https://a0.muscache.com/im/pictures/33977646/21d39f72_original.jpg",
            location: "Kawe, Dar es salaam",
            payment_terms: 8,
            unit_of_payment_terms: "Month"
        },
        {
            price: 300,
            rating: 5,
            id: 8,
            category: "Sale",
            currency: "$",
            img: "https://a0.muscache.com/im/pictures/33977624/f7ee7eca_original.jpg",
            location: "Temeke, Dar es salaam",
            payment_terms: 6,
            unit_of_payment_terms: "Month"
        }
    ]
    return (
        <div class="container-fluid">
            <TopBar />

            <div class="row contents">
                <SideBar setting="sidebar-lg sticky-top d-none d-lg-block col-12 col-lg-2 bg-light pt-3" />
                <Route exact path="/filter" render={()=>{
                        window.scrollTo(0, 0);
                        return <SideBar setting="d-relative d-lg-none col-12 bg-white mt-4" />
                    }}/>
                <div class="row contents-body col-12 col-lg-10 bg-white p-3 m-0">
                    <Route exact path="/" render={() => (
                        <Block>
                            <PropertyGroup header="Rent a place" properties={groupOne} />
                            <PropertyGroup header="Buy a place" properties={groupTwo} />
                            <PropertyGroup header="Popular Places" properties={groupOne} />
                            <PropertyGroup header="Nearby Places" properties={groupTwo} />
                            <PropertyGroup header="Suggested places" properties={groupOne} />
                            <PropertyGroup header="Most rated places" properties={groupTwo} />
                        </Block>
                    )} />
                    <Route exact path="/property/:id" render={function ({match}){
                        window.scrollTo(0, 0);
                        let property = [
                            ...groupOne, 
                            ...groupTwo
                        ].filter((obj)=> obj.id.toString() === match.params.id)[0];
                        return <PropertyDetails property={property} properties={groupOne} />
                    }} />
                </div>
            </div>

            <div class="footer row bg-dark">

            </div>

        </div>
    );
}

export { Home };