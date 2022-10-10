(function (document) {
    "use strict";

    var Pokedex = function() {

        // urls
        this.getPaginatedPokemon = (page) => `https://pokeapi.co/api/v2/pokemon/?limit=15&offset=${page}`;
        this.getPokemonSoloDetail = (name) => `https://pokeapi.co/api/v2/pokemon/${name}`;
        this.getPokemonSoloSpecies = (id) => `https://pokeapi.co/api/v2/pokemon-species/${id}`;
        this.getPokemonSoloEvolutionChain = (id) => `https://pokeapi.co/api/v2/evolution-chain/${id}`;
        this.getPokemonSoloWeaknessStrenght = (id) => `https://pokeapi.co/api/v2/type/${id}`;
        this.getPokemonTypes = `https://pokeapi.co/api/v2/type`;
        this.getPokemonGenders = `https://pokeapi.co/api/v2/gender`;
        // urls

        // sliders
        this.allSliderInstances = [];
        // sliders


        // range slider
        this.initiatorElementId = null;
        this.sliderElementId = null;
        // range slider

        // Formate: [{ element: null, eventType: null, functionDefination: null }],
        this.elementsHavingEventListenersRegistered = [];
        
        // search filter
        this.search = {
            name: '',
            gender: [
                {
                    isSelected: false,
                    name: 'male'
                },
                {
                    isSelected: false,
                    name: 'female'
                },
                {
                    isSelected: false,
                    name: 'genderless'
                }
            ],
            type: [
                {
                    isSelected: false,
                    name: 'normal'
                },
                {
                    isSelected: false,
                    name: 'normal'
                },
                {
                    isSelected: false,
                    name: 'normal'
                },
                {
                    isSelected: false,
                    name: 'poison'
                }],
            stats: {
                HP: '',
                Attack: '',
                Defense: '',
                Speed: '',
                'special-attack': '',
                'special-defense': '',
            }
        };

        this.navigationMenuDropdownCTA = null;
        this.filterItemDropdown = null;

        this.isMobile = window.matchMedia('only screen and (max-width: 767px)').matches;

        this.pokemonPool = [];
        this.pokemonCollection = [];
        this.pokemonDisplayPage = 0;

        // static colors per ability
        this.pokemonAbilityColors = {
            normal: '#DDCBD0',
            fire: '#EDC2C4',
            water: '#CBD5ED',
            electric: '#E2E2A0',
            grass: '#C0D4C8',
            ice: '#C7D7DF',
            fighting: '#FCC1B0',
            poison: '#CFB7ED',
            ground: '#F4D1A6',
            flying: '#B2D2E8',
            psychic: '#DDC0CF',
            bug: '#C1E0C8',
            rock: '#C5AEA8',
            ghost: '#D7C2D7',
            dragon: '#CADCDF',
            dark: '#C6C5E3',
            steel: '#C2D4CE',
            fairy: '#E4C0CF',
            showdow: '#CACACA',
            unknown: '#C0DFDD',
        };

        // placeholder for indiviual pokemon data
        this.pokemonSolo = {
            id: '',
            name: '',
            image: '',
            gradientColorPerAbilityType: '',
            description: '',
            weight: '',
            height: '',
            abilities: [],
            types: [],
            genders: [],
            eggGroup: [],
            weakAgainst: [],
            stats: [],
            evolutionChain: []
        };

        this.isFilter = false;

        this.genderPerPokemonSpecies = {};

        this.init();
    }
    
    // initialisize range slider
    Pokedex.prototype.initRangeSlider = function(sliderElementId, initiatorElementId) {
        const _selfObjectReference = this;
        let tempAllSliderInstances = [];

        const doWeHavePreviousStats = _selfObjectReference.readFromLocalSession('allStatsFilter', 'array');

        if (!!doWeHavePreviousStats) {
            _selfObjectReference.allSliderInstances = doWeHavePreviousStats;
        }

        // is there any previous stats recorded
        let isTargetGroupRecorded = (_selfObjectReference.allSliderInstances.filter((o, i) => o?.targetGroup === sliderElementId).length > 0);
        
        // run plugin for all sliderElementId instances
        document.querySelectorAll(sliderElementId).forEach((element) => {
            // default range
            let dynamicRangeValue = [70, 150];
            
            // set range based on history selection
            if (isTargetGroupRecorded) {
                dynamicRangeValue = (_selfObjectReference.allSliderInstances.filter((o) => o.label === element.getAttribute('data-statsfilter')))[0].value.split(',');
                dynamicRangeValue = dynamicRangeValue.map((o) => Number(o))
            }

            // each instance
            const instance = new rSlider({
                target: element,
                values: { min: 0, max: 210 },
                step: 1,
                range: true,
                set: dynamicRangeValue,
                scale: false,
                labels: false,
                tooltip: false,
                onChange: function (vals) {
                    _selfObjectReference.allSliderInstances
                        .filter((o, i) => o.targetGroup === vals['targetGroup'] && o.label === vals['label'])
                        .forEach((o, j) => {
                            o.value = vals['value'];
                        });
                    
                        for(let item of _selfObjectReference.allSliderInstances) {
                            _selfObjectReference.search.stats[item.label] = item.value;
                        }
                        _selfObjectReference.storeInLocalSession('statsFilter', JSON.stringify(_selfObjectReference.search.stats));
                },
            });
            // temporary placeholder collection for instance
            tempAllSliderInstances.push({
                initiatorElementId,
                instance,
                targetGroup: `.${element.getAttribute('class')}`,
                label: element.getAttribute('data-statsfilter'),
                value: '',
                element
            });
        });

    
        // if history exists, then update instances
        if (isTargetGroupRecorded) {
            for(let item of tempAllSliderInstances) {
                _selfObjectReference.allSliderInstances
                    .filter((o, i) => o.targetGroup === item.targetGroup && o.label === item.label)
                    .forEach((o, j) => {
                        o.instance = item.instance
                    });
            }
        } else {
            // record fresh slider instances
            _selfObjectReference.allSliderInstances = [...tempAllSliderInstances];
        }
        _selfObjectReference.storeInLocalSession('allStatsFilter', JSON.stringify(_selfObjectReference.allSliderInstances));
    }

    // clear history slider range instances
    Pokedex.prototype.clearSliderInstances = function (uniqueIdentifier) {
        const _selfObjectReference = this;
        const allRelevantIdentifier = _selfObjectReference.allSliderInstances.filter((item) => item.initiatorElementId === uniqueIdentifier);
        for (let item of allRelevantIdentifier) {
            if (item.instance instanceof rSlider) {
                item.instance.destroy();
                item.instance = null;
            }
        }
    }

    // initialize functions to run on specified target clicks 
    Pokedex.prototype.navigationDropdown = function() {
        const _selfObjectReference = this;
        document.addEventListener('click', function(event) {

            /* register all functions to be caught on addressing any prime 
                elements across landing page */

            if (!_selfObjectReference.isMobile) {
                //  act on selection made over desktop filter menus
                if (event.target.closest('.drop-down')) {
                    // found click inside drop-down

                    // TODO: future implemenetation
                    // const hasClickedOnResetApplyOrCloseCTAs = event.target.classList.contains('close') || 
                    // event.target.classList.contains('resets') || event.target.classList.contains('apply');
                    const dropdownCTA = event.target.closest('button');

                    _selfObjectReference.initiatorElementId = dropdownCTA?.getAttribute('id');
                    _selfObjectReference.sliderElementId =dropdownCTA?.getAttribute('data-sliderinstance');

                    // TODO: future implemenetation
                    // if (hasClickedOnResetApplyOrCloseCTAs) {
                    //     _selfObjectReference.closeNavigationDropDowns(); // for slider menu
                    //     return;
                    // }
                    
                    if (typeof dropdownCTA === 'object' 
                        && dropdownCTA !== null
                        && dropdownCTA.tagName.toLowerCase() === 'button' && 
                        dropdownCTA.classList.contains('display')) {
                            
                        // reset all open menus
                        _selfObjectReference.closeNavigationDropDowns();

                        // set menu open attributes for button
                        dropdownCTA.parentNode.classList.add("open");
                        dropdownCTA.setAttribute("aria-expanded", true);

                        // apply slider plugin for elements
                        if (!!_selfObjectReference.sliderElementId) {
                            _selfObjectReference.initRangeSlider(_selfObjectReference.sliderElementId, _selfObjectReference.initiatorElementId);
                        }

                        // TODO: future implemenetation
                        // const isResetCTA = dropdownCTA.nextElementSibling.querySelector('button.reset');
                        // // const isApplyCTA = dropdownCTA.nextElementSibling.querySelector('button.apply');
                        // if (!!isResetCTA) {
                        //     const reset = function() { 
                        //         // todo: reset function
                                
                        //         for (let item of _selfObjectReference.allSliderInstances) {
                        //             if (item.instance instanceof rSlider) {
                        //                 item.instance.destroy();
                        //             }
                        //         }
                        //     };
                        //     _selfObjectReference.elementsHavingEventListenersRegistered.push({
                        //         element: isResetCTA,
                        //         eventType: 'click',
                        //         functionDefination: reset
                        //     });
                        //     isResetCTA.addEventListener('click', reset);
                        // }

                        // if (!!isApplyCTA) {
                        //     const apply = function() { 
                        //         // todo: apply function
                        //     };
                        //     _selfObjectReference.elementsHavingEventListenersRegistered.push({
                        //         element: isApplyCTA,
                        //         eventType: 'click',
                        //         functionDefination: apply
                        //     });
                        //     isApplyCTA.addEventListener('click', apply);
                        // }

                        // register and track checkbox selections
                        // _selfObjectReference.navigationMenuDropdownCTA.nextElementSibling.querySelectorAll('input[type="checkbox"]').forEach((element) => {
                        //     element.addEventListener("click", function () {
                        //         primaryDisplay.innerHTML = this.value;
                        //         _selfObjectReference.closeNavigationDropDowns();
                        //     });
                        // });
                    }
                } else {
                    // reset upon click outside of dropdown
                    _selfObjectReference.closeNavigationDropDowns();
                }
            } else {

                if (event.target.tagName.toLowerCase() === 'button' && event.target.classList.contains('mobile-filter-switch')) {
                    _selfObjectReference.toggleMobileFilterModal();
                }

                if (event.target.closest('.pokemon-mobile-filter-modal-container') && event.target.tagName.toLowerCase() === 'button' && event.target.classList.contains('pokemon-mobile-filter-close')) {
                    _selfObjectReference.toggleMobileFilterModal();
                }
                //  act on selection made over mobile filter menus 
                if (event.target.closest('.filter-item') && 
                    event.target.tagName.toLowerCase() === 'button' && 
                    event.target.classList.contains('pokemon-mobile-filter-drawer')) {
                        const navigationMenuDropdownCTA = event.target;
                        _selfObjectReference.sliderElementId = event.target.getAttribute('data-sliderinstance');
                        _selfObjectReference.initiatorElementId = event.target.getAttribute('id');
                        const filterItemDropdown = event.target.parentNode.parentNode.parentNode;

                        let isClickedOnOpenButton = navigationMenuDropdownCTA.classList.contains('open');

                        _selfObjectReference.closeNavigationDropDowns();
                        
                        // prevent opening already opened drawer
                        if (!isClickedOnOpenButton) {
                            filterItemDropdown.classList.add('open');
                            filterItemDropdown.setAttribute("aria-expanded", true);
                            navigationMenuDropdownCTA.classList.add('open');
                            if (!!_selfObjectReference.sliderElementId) {
                                _selfObjectReference.initRangeSlider(_selfObjectReference.sliderElementId, _selfObjectReference.initiatorElementId);
                            }
                        }
                    }
            }

            //  act on selection made over pokemon detail modal
            if (event.target.closest('.pokemon-bio-modal-container')) {
                if (event.target.closest('.pokemon-bio')) {
                    if (event.target.tagName.toLowerCase() === 'button' && event.target.classList.contains('read-more')) {
                        document.getElementById('read-more-drawer').classList.toggle('d-none');
                    }

                    if (event.target.tagName.toLowerCase() === 'button' && event.target.classList.contains('close-read-more')) {
                        document.getElementById('read-more-drawer').classList.toggle('d-none');
                    }
                    
                    if (event.target.tagName.toLowerCase() === 'button' && event.target.classList.contains('close')) {
                        _selfObjectReference.closeModal();
                    }
                } else {
                    _selfObjectReference.closeModal();
                }
            }

            //  act on selection made over pokemon type dropdown 
            if (event.target.classList.contains('type-filter') && event.target.tagName.toLowerCase() === 'input') {
                let dropdownCTA = event.target.parentNode.parentNode.parentNode.parentNode.previousElementSibling;
                let primaryDisplay = dropdownCTA.querySelector('.regular-display');
                let secondaryDisplay = dropdownCTA.querySelector('.bold-display');
                let isChecked = event.target.checked;
                const value = event.target.value.trim();

                _selfObjectReference.search.type.filter((o) => o.name === value)[0].isSelected = isChecked;
                _selfObjectReference.storeInLocalSession('typeFilter', JSON.stringify(_selfObjectReference.search.type));

                _selfObjectReference.displaySelectedTypeFilters(primaryDisplay, secondaryDisplay);

                _selfObjectReference.tailorResultsPerTypeFilters();
            }

            //  act on selection made over pokemon gender dropdown 
            if (event.target.classList.contains('gender-filter') && event.target.tagName.toLowerCase() === 'input') {
                let dropdownCTA = event.target.parentNode.parentNode.parentNode.parentNode.previousElementSibling;
                let primaryDisplay = dropdownCTA.querySelector('.regular-display');
                let secondaryDisplay = dropdownCTA.querySelector('.bold-display');
                let isChecked = event.target.checked;
                const value = event.target.value.trim();

                _selfObjectReference.search.gender.filter((o) => o.name === value)[0].isSelected = isChecked;
                _selfObjectReference.storeInLocalSession('genderFilter', JSON.stringify(_selfObjectReference.search.gender));

                _selfObjectReference.displaySelectedGenderFilters(primaryDisplay, secondaryDisplay);

                _selfObjectReference.tailorResultsPerGenderFilters();
            }

            //  act on click made over pokemon grid at main display 
            if (event.target.closest('.pokemon-grid')) {
                const pokemonID = Number(event.target.closest('.pokemon-grid').getAttribute('data-id'));
                _selfObjectReference.getSoloPokemonDetail(pokemonID);
            }

            // scroll top 0, 0
            if (event.target.tagName.toLowerCase() === 'button' && event.target.getAttribute('id') === 'scroll-to-top') {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            }
        });

        // reflect selected values if any at type & gender filters
        _selfObjectReference.displaySelectedTypeFilters();
        _selfObjectReference.displaySelectedGenderFilters();

        document.getElementById('searchByName').addEventListener('keyup', (event) => {
            let timeout = null;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                _selfObjectReference.search.name = event.target.value.trim();
                _selfObjectReference.storeInLocalSession('nameFilter', _selfObjectReference.search.name);
                _selfObjectReference.tailorResultsPerNameFilters();
            }, 1000);
        });
        
        _selfObjectReference.search.name = document.getElementById('searchByName').value = _selfObjectReference.readFromLocalSession('nameFilter', 'string');
    }

    Pokedex.prototype.displaySelectedTypeFilters = function(primaryDisplay, secondaryDisplay) {
        const _selfObjectReference = this;

        const typeFilterID = _selfObjectReference.isMobile ? 'typeFilterMobile' : 'typeFilter';

        const primaryDisply = !primaryDisplay ? document.getElementById(typeFilterID).previousElementSibling.querySelector('.regular-display') : primaryDisplay;
        const secondaryDisply = !secondaryDisplay ? document.getElementById(typeFilterID).previousElementSibling.querySelector('.bold-display') : secondaryDisplay;

        const selectedItems = (_selfObjectReference.search.type.filter((o) => o.isSelected));
        primaryDisply.innerHTML = selectedItems.length > 0 ? selectedItems[0].name : '- Select -';
        secondaryDisply.innerHTML = selectedItems.length > 1 ? `+ ${selectedItems.length - 1} More` : '';
    }

    Pokedex.prototype.displaySelectedGenderFilters = function(primaryDisplay, secondaryDisplay) {
        const _selfObjectReference = this;
        const genderFilterID = _selfObjectReference.isMobile ? 'genderFilterMobile' : 'genderFilter';
        const primaryDisply = !primaryDisplay ? document.getElementById(genderFilterID).previousElementSibling.querySelector('.regular-display') : primaryDisplay;
        const secondaryDisply = !secondaryDisplay ? document.getElementById(genderFilterID).previousElementSibling.querySelector('.bold-display') : secondaryDisplay;

        const selectedItems = (_selfObjectReference.search.gender.filter((o) => o.isSelected));
        primaryDisply.innerHTML = selectedItems.length > 0 ? selectedItems[0].name : '- Select -';
        secondaryDisply.innerHTML = selectedItems.length > 1 ? `+ ${selectedItems.length - 1} More` : '';
    }

    // toggle open / close mobile filter panel
    Pokedex.prototype.toggleMobileFilterModal = function() {
        document.querySelector('body').classList.toggle('scroll-freeze');
        document.getElementById('pokemon-mobile-filter').classList.toggle('d-none');
    }

    // close dropdown navigations, destroy history range slider plugins, remove event handlers
    Pokedex.prototype.closeNavigationDropDowns = function() {
        const _selfObjectReference = this;

            // reset dropdown back to closed position
            if (!_selfObjectReference.isMobile) {
                const searchIfDropDownWithOpenExists = document.querySelectorAll(".navigation .filter-item .drop-down.open");
                if (searchIfDropDownWithOpenExists.length > 0) {
                    document.querySelectorAll(".navigation .filter-item .drop-down").forEach((element) => {
                        element.classList.remove("open");
                        element.children[0].setAttribute("aria-expanded", false);
                    });
                }
            } else {
                // reset all drawers to be closed
                document.querySelectorAll(".filter-fields .filter-item .pokemon-mobile-filter-drawer").forEach((element) => {
                    element.classList.remove("open");
                    element.setAttribute("aria-expanded", false);
                    element.closest('.filter-item').classList.remove('open');
                });
            }

            // remove slider instances when dropdown is closed
            _selfObjectReference.clearSliderInstances(_selfObjectReference.initiatorElementId);

            // remove event listener when dropdown is closed
            for(let ele of _selfObjectReference.elementsHavingEventListenersRegistered) {
                if (typeof ele.element === 'object') {
                    ele.element.removeEventListener(ele.eventType, ele.functionDefination);
                }
            }
    }

    // function to be called when instantiated
    Pokedex.prototype.init = function() {
        const _selfObjectReference = this;
        _selfObjectReference.navigationDropdown();
        _selfObjectReference.fetchPokemons();
        _selfObjectReference.scrollFunctions();
        _selfObjectReference.getDynamicTypeFilterOptions();
        _selfObjectReference.getDynamicGenderFilterOptions();
    }

    // fetches common pokemon types and creates checkbox markup for filters
    Pokedex.prototype.getDynamicTypeFilterOptions = async function() {
        const _selfObjectReference = this;
        const historyTypeFilter = _selfObjectReference.readFromLocalSession('typeFilter', 'array');

        if (historyTypeFilter.length === 0) {
            await fetch(_selfObjectReference.getPokemonTypes)
                .then((data) => data.json())
                .then((response) => {
                    _selfObjectReference.search.type = response.results.map((o) => ({
                        name: o.name, 
                        isSelected: false,
                        url: o.url
                    }));
                    _selfObjectReference.storeInLocalSession('typeFilter', JSON.stringify(_selfObjectReference.search.type));
                });
        } else {
            _selfObjectReference.search.type = historyTypeFilter;
        }
        const typeFilterID = _selfObjectReference.isMobile ? 'typeFilterMobile' : 'typeFilter';
        document.getElementById(typeFilterID).innerHTML = `<ul>
            ${_selfObjectReference.search.type.map((o) => (`<li class="checkbox-item">
                <label class="custom-checkbox-container pokemon-type-check">${o.name}
                    <input type="checkbox" class="type-filter"  ${o.isSelected ? 'checked' : '' } value="${o.name}" />
                    <span class="checkmark"></span>
                </label>
            </li>`)).join('')}
        </ul>`;

        // reflect selected values if any at type filters
        _selfObjectReference.displaySelectedTypeFilters();
    }

    // fetches common pokemon genders and creates checkbox markup for filters
    Pokedex.prototype.getDynamicGenderFilterOptions = async function() {
        const _selfObjectReference = this;
        const historyGenderFilter = _selfObjectReference.readFromLocalSession('genderFilter', 'array');

        if (historyGenderFilter.length === 0) {
            await fetch(this.getPokemonGenders)
            .then((data) => data.json())
            .then((commonGenderList) => {
                _selfObjectReference.search.gender = commonGenderList.results.map((o) => ({
                    name: o.name, 
                    isSelected: false
                }));
                _selfObjectReference.storeInLocalSession('genderFilter', JSON.stringify(_selfObjectReference.search.gender));
                _selfObjectReference.fetchGenderClassification(commonGenderList.results);
            })
            .catch((error) => {
                //  handle the error
            });
        } else {
            _selfObjectReference.search.gender = historyGenderFilter;
        }

        const genderFilterID = _selfObjectReference.isMobile ? 'genderFilterMobile' : 'genderFilter';
        
        document.getElementById(genderFilterID).innerHTML = `<ul>
            ${_selfObjectReference.search.gender.map((o) => (`<li class="checkbox-item">
                <label class="custom-checkbox-container pokemon-gender-check">${o.name}
                    <input type="checkbox" class="gender-filter" ${o.isSelected ? 'checked' : '' } value="${o.name}" />
                    <span class="checkmark"></span>
                </label>
            </li>`)).join('')}
        </ul>`;

        // reflect selected values if any at gender filters
        _selfObjectReference.displaySelectedGenderFilters();
    }

    // fetches gender along with applicable pokemons
    Pokedex.prototype.fetchGenderClassification = async function(commonGenderList) {
        const _selfObjectReference = this;
        for(let item of commonGenderList) {
            await fetch(item.url)
                .then((response) => response.json())
                .then((response) => {
                    _selfObjectReference.genderPerPokemonSpecies[response.name] = response.pokemon_species_details.map((o) => o.pokemon_species.name)
                })
                .catch((error) => {
                    // handle the error
                });
        }
        _selfObjectReference.storeInLocalSession('allGenderClassification', JSON.stringify(_selfObjectReference.genderPerPokemonSpecies));
    }

    // common localstorage value setting Fn
    Pokedex.prototype.storeInLocalSession = function(key, data) {
        sessionStorage.setItem(key, data);
    }

    // common localstorage value getting Fn
    Pokedex.prototype.readFromLocalSession = function(key, typeOfData) {
        let sessionValue = null;
        switch(typeOfData) {
            case 'string': 
                sessionValue = sessionStorage.getItem(key);
                break;
            case 'boolean': 
                sessionValue = (sessionStorage.getItem(key) === 'true');
                break;
            case 'object': 
                sessionValue = !!sessionStorage.getItem(key) ? JSON.parse(sessionStorage.getItem(key)) : {};
                break;
            case 'array': 
                sessionValue = !!sessionStorage.getItem(key) ? JSON.parse(sessionStorage.getItem(key)) : [];
                break;
        }
        
        return sessionValue;
    }

    // identify end of scroll on main display and load paginated results
    Pokedex.prototype.scrollFunctions = function() {
        const _selfObjectReference = this;
        const verticalOffset = 1;
        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY + verticalOffset) >= document.body.scrollHeight) {
                
                let count = ++_selfObjectReference.pokemonDisplayPage * 15;
                _selfObjectReference.fetchPokemons(count);
            }
        }, false);
    }

    // close pokemon card and display
    Pokedex.prototype.createPokemonCard = function(targetPokemon) {
        const _selfObjectReference = this;
        let markUpPrepared = '';

        const pokemonCardHTML = (name, id, types, image) => {
            return `<div class="pokemon-grid" data-name="${name.toLowerCase()}" 
                        data-type="${types.sort().join('-')}" 
                        data-gender="${_selfObjectReference.getGenderByPokemonName(name).sort().join('-')}" 
                        data-id="${id}" 
                        style="background: ${_selfObjectReference.getGradientForPokemonCard(types)}">
                <div class="picture">
                    <img src="${image}" alt="${name}" />
                </div>
                <div class="title">
                    <p class="name"> ${name} </p>
                    <p class="id"> ${_selfObjectReference.getPaddedId(id)} </p>
                </div>
            </div>`
        };

        for (let item of targetPokemon) {
            const { name, capitalizedName = _selfObjectReference.capitalizeFirstAlphabet(name), id, types, modifiedtypes = types.map((o) => o.type.name), sprites : { other : { dream_world: { front_default: image } }  }} = item;
            markUpPrepared+= pokemonCardHTML(capitalizedName, id, modifiedtypes, image);
        }

        if (this.pokemonDisplayPage > 0) {
            document.getElementById('pokemons').innerHTML+= markUpPrepared;
        } else {
            document.getElementById('pokemons').innerHTML = markUpPrepared;
        }

        _selfObjectReference.pageTopPreLoader(false);

        _selfObjectReference.tailorResultsPerNameFilters();
        _selfObjectReference.tailorResultsPerTypeFilters();
        _selfObjectReference.tailorResultsPerGenderFilters();
    }

    // prepare gradient background color based on pokemon-type
    Pokedex.prototype.getGradientForPokemonCard = function(types) {
        const _selfObjectReference = this;
        let gradientColorsAsPerAbility = '';
        if (types.length > 1) {
            gradientColorsAsPerAbility = 'linear-gradient(180deg';
            for(let item of types) {
                gradientColorsAsPerAbility+= ','+ _selfObjectReference.pokemonAbilityColors[item]
            }
            gradientColorsAsPerAbility+= ')';
        } else if (types.length === 1) {
            gradientColorsAsPerAbility = _selfObjectReference.pokemonAbilityColors[types[0]];
        } else {
            gradientColorsAsPerAbility = 'transparent';
        }
        return gradientColorsAsPerAbility;
    }

    // close pokemon detail display modal
    Pokedex.prototype.closeModal = function() {
        document.getElementById('modal-placeholder').innerHTML = '';
        document.body.classList.remove('scroll-freeze');
    }

    // create pokemon detail display modal and display
    Pokedex.prototype.createModal = function(pokemonDetail) {
        const _selfObjectReference = this;
        const { id, name, image, weight, height, abilities, types, description
            , eggGroup, genders, weakAgainst, stats, gradientColorPerAbilityType, evolutionChain } = pokemonDetail;
            
        let paddedID = _selfObjectReference.getPaddedId(id);

        if (document.querySelectorAll('#pokemon-variant-modal').length > 0) return; // prevent additonal modal

        const markUpPrepared = `<div class="overlay" id="pokemon-variant-modal">
            <div class="pokemon-bio-modal-container">
                <div class="pokemon-bio">
                    <div class="modal-display">
                        <div class="pokemon-bio-mobile-header">
                            <div class="pokemon-bio-mobile-header-title">
                                <h1> ${name} </h1>
                                <p> ${paddedID} </p>
                            </div>
                            <div class="pokemon-bio-mobile-header-cta">
                                <button type="button" class="close"></button>
                            </div>
                        </div>
                        <div class="pokemon-description">
                            <div class="pokemon-visual" style="background: ${gradientColorPerAbilityType}">
                                <img src="${image}" alt="${name}" />
                            </div>
                            <div class="pokemon-story">
                                <div class="title-and-cta">
                                    <span class="title">
                                        <p>
                                            ${name}
                                        </p>
                                    </span>
                                    <span class="id">
                                        <p>
                                            ${paddedID}
                                        </p>
                                    </span>
                                    <span class="cta">
                                        <button type="button" class="left" disabled> move left </button>
                                        <button type="button" class="close"> close </button>
                                        <button type="button" class="right" disabled> move right </button>
                                    </span>
                                </div>
                                <div class="description">
                                    <p class="ellipsis"> ${description}</p>
                                    <button type="button" class="read-more">read more</button>
                                </div>
                            </div>
                            <div class="read-more-drawer d-none" id="read-more-drawer">
                                <div class="read-more-display">
                                    <button type="button" class="close-read-more"></button>
                                    <p> ${description} </p>
                                </div>
                            </div>
                        </div>

                        <div class="pokemon-features">
                            <div>
                                <label>Height</label>
                                <p>${height}</p>
                            </div>

                            <div>
                                <label>Weight</label>
                                <p>${weight} Kg </p>
                            </div>

                            <div>
                                <label>Gender(s)</label>
                                <p>${genders.join(', ')}</p>
                            </div>

                            <div>
                                <label>Egg Groups</label>
                                <p>${eggGroup.join(', ')}</p>
                            </div>

                            <div>
                                <label>Abilities</label>
                                <p>${abilities.join(', ')}</p>
                            </div>

                            <div>
                                <label>Types</label>
                                <div class="pills">
                                    ${types.map((o) => `<p style="background-color: ${o.color}"> ${o.name} </p>`).join('')}
                                </div>
                            </div>

                            <div class="weak-against">
                                <label>Weak Against</label>
                                <div class="pills">
                                    ${weakAgainst.map((o) => `<p style="background-color: ${o.color}"> ${o.name} </p>`).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="pokemon-stats">
                            <h2>Stats</h2>
                            <div class="stats-details-grid">
                                <div class="stats-detail-item">
                                    <label> HP </label>
                                    <div class="progress">
                                        ${
                                            (stats['hp'] === '1@1') ? '<div style="width:100%;"> 100+ </div>' : 
                                            `<div style="width: ${stats['hp']}%;"> ${stats['hp']} </div>`
                                        }
                                    </div>
                                </div>

                                <div class="stats-detail-item">
                                    <label> Defense </label>
                                    <div class="progress">
                                    ${
                                        (stats['defense'] === '1@1') ? '<div style="width:100%;"> 100+ </div>' : 
                                        `<div style="width: ${stats['defense']}%;"> ${stats['defense']} </div>`
                                    }
                                    </div>
                                </div>

                                <div class="stats-detail-item">
                                    <label> Sp. Attack </label>
                                    <div class="progress">
                                    ${
                                        (stats['special-attack'] === '1@1') ? '<div style="width:100%;"> 100+ </div>' : 
                                        `<div style="width: ${stats['special-attack']}%;"> ${stats['special-attack']} </div>`
                                    }
                                    </div>
                                </div>

                                <div class="stats-detail-item">
                                    <label> Attack </label>
                                    <div class="progress">
                                        ${
                                            (stats['attack'] === '1@1') ? '<div style="width:100%;"> 100+ </div>' : 
                                            `<div style="width: ${stats['attack']}%;"> ${stats['attack']} </div>`
                                        }
                                    </div>
                                </div>

                                <div class="stats-detail-item">
                                    <label> Speed </label>
                                    <div class="progress">
                                    ${
                                        (stats['speed'] === '1@1') ? '<div style="width:100%;"> 100+ </div>' : 
                                        `<div style="width: ${stats['speed']}%;"> ${stats['speed']} </div>`
                                    }
                                    </div>
                                </div>

                                <div class="stats-detail-item">
                                    <label> Sp. Def. </label>
                                    <div class="progress">
                                    ${
                                        (stats['special-defense'] === '1@1') ? '<div style="width:100%;"> 100+ </div>' : 
                                        `<div style="width: ${stats['special-defense']}%;"> ${stats['special-defense']} </div>`
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="evolution-chain">
                            <h2> Evolution chain </h2>
                            <div class="evolution-display">
                                ${evolutionChain.map((o, i) => {
                                    let markup = `
                                        <div class="evolution-display-type">
                                            <div class="picture">
                                                <img src="${o.image}" alt="${o.species_name}" />
                                            </div>
                                            <div class="title">
                                                <p class="name"> ${o.species_name} </p>
                                                <p class="id"> ${o.id} </p>
                                            </div>
                                        </div>`;

                                        if (i < evolutionChain.length-1) {
                                            markup+= `<div class="evolution-display-type-seperators"></div>`;
                                        }
                                    return markup;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        document.body.classList.add('scroll-freeze');
        document.getElementById('modal-placeholder').innerHTML = markUpPrepared;
    }

    // prepare data needed for creation & display of pokemons at main display
    Pokedex.prototype.getSoloPokemonDetail = async function(id) {
        const _selfObjectReference = this;
        
        let evolutionChainUrl = '';
        const targetPokemon = _selfObjectReference.pokemonCollection.filter((pokemon) => pokemon.id === id)[0];
        
        _selfObjectReference.pageTopPreLoader(true);

        _selfObjectReference.pokemonSolo = Object.assign(_selfObjectReference.pokemonSolo, {
            id: targetPokemon.id,
            name: _selfObjectReference.capitalizeFirstAlphabet(targetPokemon.name),
            image: targetPokemon.sprites.other.dream_world.front_default,
            weight: targetPokemon.weight,
            height: targetPokemon.height,
            abilities: targetPokemon.abilities.map((o) => _selfObjectReference.capitalizeFirstAlphabet(o.ability.name)),
            types: targetPokemon.types.map((o) => ({
                color: _selfObjectReference.pokemonAbilityColors[o.type.name.toLowerCase()],
                name: _selfObjectReference.capitalizeFirstAlphabet(o.type.name)
            })),
            stats: targetPokemon.stats.reduce((o, key) => {
                if (key.base_stat > 100) {
                    return { ...o, [key.stat.name]: '1@1' }; // identifier to denote {n}+ if value > 100
                } else {
                    return { ...o, [key.stat.name]: key.base_stat };
                }
            }, {}),
            gradientColorPerAbilityType: _selfObjectReference.getGradientForPokemonCard(targetPokemon.types.map((o) => o.type.name))
        });
        
        // fetch description & egg group
        await fetch(_selfObjectReference.getPokemonSoloSpecies(targetPokemon.id))
            .then((response) => response.json())
            .then((response) => {
                const { evolution_chain: { url }, flavor_text_entries, egg_groups } = response;
                evolutionChainUrl = url;
                _selfObjectReference.pokemonSolo.description = (flavor_text_entries.filter((o) => o.language.name === 'en').map((o) => o.flavor_text)).join(' ').replace(/\f|\n/g, " ");
                _selfObjectReference.pokemonSolo.eggGroup = egg_groups.map((o) => _selfObjectReference.capitalizeFirstAlphabet(o.name));
            })
            .catch((error) => {
                // handle the error
            }); 
            
        // calculate gender
        _selfObjectReference.pokemonSolo.genders = _selfObjectReference.getGenderByPokemonName(targetPokemon.name);

        // fetch weakness
        let historyPokemonTypes = _selfObjectReference.readFromLocalSession('typeFilter', 'array');
        
        let typeWeaknessCollection = {};
        if (historyPokemonTypes instanceof Array && historyPokemonTypes.length > 0) {
            for(let pokemonType of historyPokemonTypes) {
                typeWeaknessCollection[pokemonType.name] = [];
                await fetch(pokemonType.url)
                    .then((pokemonTypeStrenghtsWeakness) => pokemonTypeStrenghtsWeakness.json())
                    .then((pokemonTypeStrenghtsWeakness) => {
                        typeWeaknessCollection[pokemonType.name] = pokemonTypeStrenghtsWeakness.damage_relations.double_damage_from.map((o) => o.name);
                    })
                    .catch((error) => {
                        // handle the error
                    });
            }
        } else {
            await fetch(this.getPokemonTypes)
            .then((level0Response) => level0Response.json()
            .then(async (level0Response) => {
                for(let pokemonType of level0Response.results) {
                    typeWeaknessCollection[pokemonType.name] = [];
                    await fetch(pokemonType.url)
                        .then((pokemonTypeStrenghtsWeakness) => pokemonTypeStrenghtsWeakness.json())
                        .then((pokemonTypeStrenghtsWeakness) => {
                            typeWeaknessCollection[pokemonType.name] = pokemonTypeStrenghtsWeakness.damage_relations.double_damage_from.map((o) => o.name);
                        })
                        .catch((error) => {
                            // handle the error
                        });
                }
                
            }))
            .catch((error) => {
                // handle the error
            });
        }

        _selfObjectReference.pokemonSolo.weakAgainst = [];
        for(let pokemonType of targetPokemon.types) {
            const tailoredTypeWeaknessCollection = typeWeaknessCollection[pokemonType.type.name].map((o) => ({
                color: _selfObjectReference.pokemonAbilityColors[o.toLowerCase()],
                name: _selfObjectReference.capitalizeFirstAlphabet(o)
            }));
            _selfObjectReference.pokemonSolo.weakAgainst = [..._selfObjectReference.pokemonSolo.weakAgainst, ...tailoredTypeWeaknessCollection];
        }

        // fetch evolution chain
        await fetch(evolutionChainUrl)
            .then((data) => data.json())
            .then((response) => {
                let evolutionChain = [];
                let evolutionData = response.chain;

                do {
                    const id = evolutionData.species.url.split('https://pokeapi.co/api/v2/pokemon-species/')[1].replace('/', '');
                    evolutionChain.push({
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`,
                        'species_name': evolutionData.species.name,
                        id: _selfObjectReference.getPaddedId(id)
                    });

                    evolutionData = evolutionData['evolves_to'][0];
                } while (!!evolutionData && evolutionData.hasOwnProperty('evolves_to'));
                _selfObjectReference.pokemonSolo.evolutionChain = evolutionChain;
            })
            .catch((error) => {
                // handle the error
            });

        _selfObjectReference.pageTopPreLoader(false);
        _selfObjectReference.createModal(_selfObjectReference.pokemonSolo);
    }

    // tailor data to be shown at main pokemon display
    Pokedex.prototype.fetchPokemons = async function(page = 0) {
        const _selfObjectReference = this;
        _selfObjectReference.pageTopPreLoader(true);

        // fetch paginated pokemon results
        let url = _selfObjectReference.getPaginatedPokemon(page);
        let freshPokemons = [];
        await fetch(url)
            .then((data) => data.json())
            .then(response => {
                _selfObjectReference.pokemonPool = response.results;
            })
            .catch(error => {
                // handle the error
            });
        for (let pokemon of _selfObjectReference.pokemonPool) {
            // fetch & calculate indiviaul pokemon details
            await fetch(_selfObjectReference.getPokemonSoloDetail(pokemon.name))
                .then((data) => data.json())
                .then((response) => {
                    _selfObjectReference.pokemonCollection = [..._selfObjectReference.pokemonCollection, response];
                    freshPokemons.push(response);
                })
                .catch(error => {
                    // handle the error
                });
        }
        _selfObjectReference.createPokemonCard(freshPokemons);
    }

    // visual filters 
    Pokedex.prototype.tailorResultsPerNameFilters = function() {
        const _selfObjectReference = this;
        for(let item of document.querySelectorAll('.pokemon-grid')) {
            if (_selfObjectReference.search.name?.length > 0 && item.getAttribute('data-name').indexOf(_selfObjectReference.search.name.toLowerCase()) === -1) {
                item.classList.add('hide-per-name');
            } else {
                item.classList.remove('hide-per-name');
            }
        }
    }

    Pokedex.prototype.tailorResultsPerTypeFilters = function() {
        const _selfObjectReference = this;
        const searchWithTypes = _selfObjectReference.search.type.filter((o) => o.isSelected).map((o) => o.name);
        for(let item of document.querySelectorAll('.pokemon-grid')) {
            if (searchWithTypes.length > 0 && !item.getAttribute('data-type').split('-').some((o) => searchWithTypes.includes(o))) {
                item.classList.add('hide-per-type');
            } else {
                item.classList.remove('hide-per-type');
            }
        }
    }

    Pokedex.prototype.tailorResultsPerGenderFilters = function() {
        const _selfObjectReference = this;
        const searchWithGender = _selfObjectReference.search.gender.filter((o) => o.isSelected).map((o) => o.name);
        for(let item of document.querySelectorAll('.pokemon-grid')) {
            if (searchWithGender.length > 0 && !item.getAttribute('data-gender').split('-').some((o) => searchWithGender.includes(o))) {
                item.classList.add('hide-per-gender');
            } else {
                item.classList.remove('hide-per-gender');
            }
        }
    }
    // visual filters

    Pokedex.prototype.getGenderByPokemonName = function(targetPokemon) {
        const _selfObjectReference = this;
        let genders = [];
        _selfObjectReference.genderPerPokemonSpecies = _selfObjectReference.readFromLocalSession('allGenderClassification', 'object')
        if(Object.keys(_selfObjectReference.genderPerPokemonSpecies).length === 0) return [];
        for(const [gender, pokemonsPerGender] of Object.entries(_selfObjectReference.genderPerPokemonSpecies)) {
            for(let pokemon of pokemonsPerGender) {
                if (pokemon.toLowerCase() === targetPokemon.toLowerCase()) {
                    genders.push(gender);
                }
            }

            
        }
       return genders;
    }

    // helper methods
    Pokedex.prototype.capitalizeFirstAlphabet = function(str) {
        return (str).charAt(0).toUpperCase() + str.slice(1);
    }

    Pokedex.prototype.getPaddedId = function(id) {
        return id.toString().padStart(3, "0");
    }

    Pokedex.prototype.pageTopPreLoader = function(isOn = false) {
        isOn ? document.getElementById('pokemon-pre-loader').classList.remove('d-none') : 
        document.getElementById('pokemon-pre-loader').classList.add('d-none');
    }
    // helper methods

    window.pokedex = Pokedex;
})(document);

new pokedex();