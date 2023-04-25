import './css/styles.css';

import {fetchCountries} from './fetchCountries';

let debounce = require('lodash.debounce');

import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

//enlace a elementos de DOM
const serchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

/**
 * funcion para controlar la entrada de valores y aplicar el metodo trim()
 * para resolver el problema de los espoacios en blanco
 */

const searchCountry = debounce(event =>{
    let country = event.target.value.trim().toLowerCase();
    if (country === '') {
        countryInfo.innerHTML = '';
        countryList.innerHTML = '';
    }
    if (country !=='') {
        console.log(fetchCountries(country));
        fetchCountries(country)
        .then(country => {
            renderCards(country)
        })
        .catch(error =>{
            Notify.failure('Oops, there is no country with that name');
            countryInfo.innerHTML = '';
            countryList.innerHTML = '';
        });
    }
},DEBOUNCE_DELAY);

/** 
 * funcion para delimitar el min y max de posibles paises arrojados en
 * la busqueda por medio de la consulta a la API
 */
const renderCards = country =>{
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';

    if (country.length > 10) {
        Notify.info('Too many matches found. Please enter a more especific name');
    }
    if (country.length >= 2 && country.length <= 10) {
        renderListCountry(country);
        console.log(country);
    }
    if (country.length < 2) {
        renderCardCountry(country);
    }
};


const renderListCountry = country => {
    const markup = country
    .map(({name, flags})=>{
        return `<li class= "country-item">
            <img class ="country-img" src="${flags.svg}" alt="Flag of ${name.official}">
            <h3 class="countries-name">${name.official}</h3>
        </li>`;
    })
    .join('');
    countryList.insertAdjacentHTML('beforeend', markup)
};
/**
 * funcion para mostrar info del nombre y de la bandera segun si cumple los 
 * parametros de longitud
 */



const renderCardCountry = country =>{
    const markup = country
    .map(({name, capital, population, flags, languages}) => {
        return `
        <div class ="country-container">
            <img class = "country-img" src ="${flags.svg}" alt="Flag of ${name.official}">
            <h3 class="country-name__card">${name.official}</h3>
        </div>
        <p class ="country-capital"><span class="country-title">Capital: </span>${capital}</p>
        <p class ="country-population"><span class="country-title">Population: </span>${population}</p>
        <p class="country__languages"><span class="country-title">Languages: </span> ${Object.values(languages)}</p>
        
        `;
    })
    .join('');
    countryInfo.insertAdjacentHTML('beforeend', markup);
};

serchBox.addEventListener('input',searchCountry);

countryList.style.marginRight = '20px'
