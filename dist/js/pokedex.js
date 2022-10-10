!function(){"use strict";var e=function(e){for(var t in this.input=null,this.inputDisplay=null,this.slider=null,this.sliderWidth=0,this.sliderLeft=0,this.pointerWidth=0,this.pointerR=null,this.pointerL=null,this.activePointer=null,this.selected=null,this.scale=null,this.step=0,this.tipL=null,this.tipR=null,this.timeout=null,this.valRange=!1,this.values={start:null,end:null},this.conf={target:null,values:null,set:null,range:!1,width:null,scale:!0,labels:!0,tooltip:!0,step:null,disabled:!1,onChange:null},this.cls={container:"rs-container",background:"rs-bg",selected:"rs-selected",pointer:"rs-pointer",scale:"rs-scale",noscale:"rs-noscale",tip:"rs-tooltip"},this.conf)e.hasOwnProperty(t)&&(this.conf[t]=e[t]);this.init()};e.prototype.init=function(){return("object"==typeof this.conf.target?this.input=this.conf.target:this.input=document.getElementById(this.conf.target.replace("#","")),this.input)?(this.inputDisplay=getComputedStyle(this.input,null).display,this.input.style.display="none",this.valRange=!(this.conf.values instanceof Array),!this.valRange||this.conf.values.hasOwnProperty("min")&&this.conf.values.hasOwnProperty("max"))?this.createSlider():console.log("Missing min or max value..."):console.log("Cannot find target element...")},e.prototype.createSlider=function(){return this.slider=t("div",this.cls.container),this.slider.innerHTML='<div class="rs-bg"></div>',this.selected=t("div",this.cls.selected),this.pointerL=t("div",this.cls.pointer,["dir","left"]),this.scale=t("div",this.cls.scale),this.conf.tooltip&&(this.tipL=t("div",this.cls.tip),this.tipR=t("div",this.cls.tip),this.pointerL.appendChild(this.tipL)),this.slider.appendChild(this.selected),this.slider.appendChild(this.scale),this.slider.appendChild(this.pointerL),this.conf.range&&(this.pointerR=t("div",this.cls.pointer,["dir","right"]),this.conf.tooltip&&this.pointerR.appendChild(this.tipR),this.slider.appendChild(this.pointerR)),this.input.parentNode.insertBefore(this.slider,this.input.nextSibling),this.conf.width&&(this.slider.style.width=parseInt(this.conf.width)+"px"),this.sliderLeft=this.slider.getBoundingClientRect().left,this.sliderWidth=this.slider.clientWidth,this.pointerWidth=this.pointerL.clientWidth,this.conf.scale||this.slider.classList.add(this.cls.noscale),this.setInitialValues()},e.prototype.setInitialValues=function(){if(this.disabled(this.conf.disabled),this.valRange&&(this.conf.values=s(this.conf)),this.values.start=0,this.values.end=this.conf.range?this.conf.values.length-1:0,this.conf.set&&this.conf.set.length&&l(this.conf)){var e=this.conf.set;this.conf.range?(this.values.start=this.conf.values.indexOf(e[0]),this.values.end=this.conf.set[1]?this.conf.values.indexOf(e[1]):null):this.values.end=this.conf.values.indexOf(e[0])}return this.createScale()},e.prototype.createScale=function(e){this.step=this.sliderWidth/(this.conf.values.length-1);for(var i=0,s=this.conf.values.length;i<s;i++){var l=t("span"),a=t("ins");l.appendChild(a),this.scale.appendChild(l),l.style.width=i===s-1?0:this.step+"px",this.conf.labels?a.innerHTML=this.conf.values[i]:(0===i||i===s-1)&&(a.innerHTML=this.conf.values[i]),a.style.marginLeft=-(a.clientWidth/2*1)+"px"}return this.addEvents()},e.prototype.updateScale=function(){this.step=this.sliderWidth/(this.conf.values.length-1);for(var e=this.slider.querySelectorAll("span"),t=0,i=e.length;t<i;t++)e[t].style.width=this.step+"px";return this.setValues()},e.prototype.addEvents=function(){var e=this.slider.querySelectorAll("."+this.cls.pointer),t=this.slider.querySelectorAll("span");i(document,"mousemove touchmove",this.move.bind(this)),i(document,"mouseup touchend touchcancel",this.drop.bind(this));for(var s=0,l=e.length;s<l;s++)i(e[s],"mousedown touchstart",this.drag.bind(this));for(var s=0,l=t.length;s<l;s++)i(t[s],"click",this.onClickPiece.bind(this));return window.addEventListener("resize",this.onResize.bind(this)),this.setValues()},e.prototype.drag=function(e){if(e.preventDefault(),!this.conf.disabled){var t=e.target.getAttribute("data-dir");return"left"===t&&(this.activePointer=this.pointerL),"right"===t&&(this.activePointer=this.pointerR),this.slider.classList.add("sliding")}},e.prototype.move=function(e){if(this.activePointer&&!this.conf.disabled){var t=("touchmove"===e.type?e.touches[0].clientX:e.pageX)-this.sliderLeft-this.pointerWidth/2;return(t=Math.round(t/this.step))<=0&&(t=0),t>this.conf.values.length-1&&(t=this.conf.values.length-1),this.conf.range?(this.activePointer===this.pointerL&&(this.values.start=t),this.activePointer===this.pointerR&&(this.values.end=t)):this.values.end=t,this.setValues()}},e.prototype.drop=function(){this.activePointer=null},e.prototype.setValues=function(e,t){var i=this.conf.range?"start":"end";return e&&this.conf.values.indexOf(e)>-1&&(this.values[i]=this.conf.values.indexOf(e)),t&&this.conf.values.indexOf(t)>-1&&(this.values.end=this.conf.values.indexOf(t)),this.conf.range&&this.values.start>this.values.end&&(this.values.start=this.values.end),this.pointerL.style.left=this.values[i]*this.step-this.pointerWidth/2+"px",this.conf.range?(this.conf.tooltip?(this.tipL.innerHTML=this.conf.values[this.values.start],this.tipR.innerHTML=this.conf.values[this.values.end]):(this.pointerL.innerHTML=this.conf.values[this.values.start],this.pointerR.innerHTML=this.conf.values[this.values.end]),this.input.value=this.conf.values[this.values.start]+","+this.conf.values[this.values.end],this.pointerR.style.left=this.values.end*this.step-this.pointerWidth/2+"px"):(this.conf.tooltip?this.tipL.innerHTML=this.conf.values[this.values.end]:this.pointerL.innerHTML=this.conf.values[this.values.start],this.input.value=this.conf.values[this.values.end]),this.values.end>this.conf.values.length-1&&(this.values.end=this.conf.values.length-1),this.values.start<0&&(this.values.start=0),this.selected.style.width=(this.values.end-this.values.start)*this.step+"px",this.selected.style.left=this.values.start*this.step+"px",this.onChange()},e.prototype.onClickPiece=function(e){if(!this.conf.disabled){var t=Math.round((e.clientX-this.sliderLeft)/this.step);return t>this.conf.values.length-1&&(t=this.conf.values.length-1),t<0&&(t=0),this.conf.range&&t-this.values.start<=this.values.end-t?this.values.start=t:this.values.end=t,this.slider.classList.remove("sliding"),this.setValues()}},e.prototype.onChange=function(){var e=this;this.timeout&&clearTimeout(this.timeout),this.timeout=setTimeout(function(){if(e.conf.onChange&&"function"==typeof e.conf.onChange)return e.conf.onChange({targetGroup:`.${e.conf.target.getAttribute("class")}`,label:e.conf.target.getAttribute("data-statsfilter"),value:e.input.value})},500)},e.prototype.onResize=function(){return this.sliderLeft=this.slider.getBoundingClientRect().left,this.sliderWidth=this.slider.clientWidth,this.updateScale()},e.prototype.disabled=function(e){this.conf.disabled=e,this.slider.classList[e?"add":"remove"]("disabled")},e.prototype.getValue=function(){return this.input.value},e.prototype.destroy=function(){this.input.style.display=this.inputDisplay,this.slider.remove()};var t=function(e,t,i){var s=document.createElement(e);return t&&(s.className=t),i&&2===i.length&&s.setAttribute("data-"+i[0],i[1]),s},i=function(e,t,i){for(var s=t.split(" "),l=0,a=s.length;l<a;l++)e.addEventListener(s[l],i)},s=function(e){var t=[],i=e.values.max-e.values.min;if(!e.step)return console.log("No step defined..."),[e.values.min,e.values.max];for(var s=0,l=i/e.step;s<l;s++)t.push(e.values.min+s*e.step);return 0>t.indexOf(e.values.max)&&t.push(e.values.max),t},l=function(e){return!(!e.set||e.set.length<1||0>e.values.indexOf(e.set[0])||e.range&&(e.set.length<2||0>e.values.indexOf(e.set[1])))||null};window.rSlider=e}(),function(e){"use strict";var t=function(){this.getPaginatedPokemon=e=>`https://pokeapi.co/api/v2/pokemon/?limit=15&offset=${e}`,this.getPokemonSoloDetail=e=>`https://pokeapi.co/api/v2/pokemon/${e}`,this.getPokemonSoloSpecies=e=>`https://pokeapi.co/api/v2/pokemon-species/${e}`,this.getPokemonSoloEvolutionChain=e=>`https://pokeapi.co/api/v2/evolution-chain/${e}`,this.getPokemonSoloWeaknessStrenght=e=>`https://pokeapi.co/api/v2/type/${e}`,this.getPokemonTypes="https://pokeapi.co/api/v2/type",this.getPokemonGenders="https://pokeapi.co/api/v2/gender",this.allSliderInstances=[],this.initiatorElementId=null,this.sliderElementId=null,this.elementsHavingEventListenersRegistered=[],this.search={name:"",gender:[{isSelected:!1,name:"male"},{isSelected:!1,name:"female"},{isSelected:!1,name:"genderless"}],type:[{isSelected:!1,name:"normal"},{isSelected:!1,name:"normal"},{isSelected:!1,name:"normal"},{isSelected:!1,name:"poison"}],stats:{HP:"",Attack:"",Defense:"",Speed:"","special-attack":"","special-defense":""}},this.navigationMenuDropdownCTA=null,this.filterItemDropdown=null,this.isMobile=window.matchMedia("only screen and (max-width: 767px)").matches,this.pokemonPool=[],this.pokemonCollection=[],this.pokemonDisplayPage=0,this.pokemonAbilityColors={normal:"#DDCBD0",fire:"#EDC2C4",water:"#CBD5ED",electric:"#E2E2A0",grass:"#C0D4C8",ice:"#C7D7DF",fighting:"#FCC1B0",poison:"#CFB7ED",ground:"#F4D1A6",flying:"#B2D2E8",psychic:"#DDC0CF",bug:"#C1E0C8",rock:"#C5AEA8",ghost:"#D7C2D7",dragon:"#CADCDF",dark:"#C6C5E3",steel:"#C2D4CE",fairy:"#E4C0CF",showdow:"#CACACA",unknown:"#C0DFDD"},this.pokemonSolo={id:"",name:"",image:"",gradientColorPerAbilityType:"",description:"",weight:"",height:"",abilities:[],types:[],genders:[],eggGroup:[],weakAgainst:[],stats:[],evolutionChain:[]},this.isFilter=!1,this.genderPerPokemonSpecies={},this.init()};t.prototype.initRangeSlider=function(t,i){let s=this,l=[],a=s.readFromLocalSession("allStatsFilter","array");a&&(s.allSliderInstances=a);let n=s.allSliderInstances.filter((e,i)=>e?.targetGroup===t).length>0;if(e.querySelectorAll(t).forEach(e=>{let t=[70,150];n&&(t=(t=s.allSliderInstances.filter(t=>t.label===e.getAttribute("data-statsfilter"))[0].value.split(",")).map(e=>Number(e)));let a=new rSlider({target:e,values:{min:0,max:210},step:1,range:!0,set:t,scale:!1,labels:!1,tooltip:!1,onChange:function(e){for(let t of(s.allSliderInstances.filter((t,i)=>t.targetGroup===e.targetGroup&&t.label===e.label).forEach((t,i)=>{t.value=e.value}),s.allSliderInstances))s.search.stats[t.label]=t.value;s.storeInLocalSession("statsFilter",JSON.stringify(s.search.stats))}});l.push({initiatorElementId:i,instance:a,targetGroup:`.${e.getAttribute("class")}`,label:e.getAttribute("data-statsfilter"),value:"",element:e})}),n)for(let o of l)s.allSliderInstances.filter((e,t)=>e.targetGroup===o.targetGroup&&e.label===o.label).forEach((e,t)=>{e.instance=o.instance});else s.allSliderInstances=[...l];s.storeInLocalSession("allStatsFilter",JSON.stringify(s.allSliderInstances))},t.prototype.clearSliderInstances=function(e){let t=this.allSliderInstances.filter(t=>t.initiatorElementId===e);for(let i of t)i.instance instanceof rSlider&&(i.instance.destroy(),i.instance=null)},t.prototype.navigationDropdown=function(){let t=this;e.addEventListener("click",function(i){if(t.isMobile){if("button"===i.target.tagName.toLowerCase()&&i.target.classList.contains("mobile-filter-switch")&&t.toggleMobileFilterModal(),i.target.closest(".pokemon-mobile-filter-modal-container")&&"button"===i.target.tagName.toLowerCase()&&i.target.classList.contains("pokemon-mobile-filter-close")&&t.toggleMobileFilterModal(),i.target.closest(".filter-item")&&"button"===i.target.tagName.toLowerCase()&&i.target.classList.contains("pokemon-mobile-filter-drawer")){let s=i.target;t.sliderElementId=i.target.getAttribute("data-sliderinstance"),t.initiatorElementId=i.target.getAttribute("id");let l=i.target.parentNode.parentNode.parentNode,a=s.classList.contains("open");t.closeNavigationDropDowns(),!a&&(l.classList.add("open"),l.setAttribute("aria-expanded",!0),s.classList.add("open"),t.sliderElementId&&t.initRangeSlider(t.sliderElementId,t.initiatorElementId))}}else if(i.target.closest(".drop-down")){let n=i.target.closest("button");t.initiatorElementId=n?.getAttribute("id"),t.sliderElementId=n?.getAttribute("data-sliderinstance"),"object"==typeof n&&null!==n&&"button"===n.tagName.toLowerCase()&&n.classList.contains("display")&&(t.closeNavigationDropDowns(),n.parentNode.classList.add("open"),n.setAttribute("aria-expanded",!0),t.sliderElementId&&t.initRangeSlider(t.sliderElementId,t.initiatorElementId))}else t.closeNavigationDropDowns();if(i.target.closest(".pokemon-bio-modal-container")&&(i.target.closest(".pokemon-bio")?("button"===i.target.tagName.toLowerCase()&&i.target.classList.contains("read-more")&&e.getElementById("read-more-drawer").classList.toggle("d-none"),"button"===i.target.tagName.toLowerCase()&&i.target.classList.contains("close-read-more")&&e.getElementById("read-more-drawer").classList.toggle("d-none"),"button"===i.target.tagName.toLowerCase()&&i.target.classList.contains("close")&&t.closeModal()):t.closeModal()),i.target.classList.contains("type-filter")&&"input"===i.target.tagName.toLowerCase()){let o=i.target.parentNode.parentNode.parentNode.parentNode.previousElementSibling,r=o.querySelector(".regular-display"),d=o.querySelector(".bold-display"),c=i.target.checked,p=i.target.value.trim();t.search.type.filter(e=>e.name===p)[0].isSelected=c,t.storeInLocalSession("typeFilter",JSON.stringify(t.search.type)),t.displaySelectedTypeFilters(r,d),t.tailorResultsPerTypeFilters()}if(i.target.classList.contains("gender-filter")&&"input"===i.target.tagName.toLowerCase()){let h=i.target.parentNode.parentNode.parentNode.parentNode.previousElementSibling,u=h.querySelector(".regular-display"),m=h.querySelector(".bold-display"),g=i.target.checked,v=i.target.value.trim();t.search.gender.filter(e=>e.name===v)[0].isSelected=g,t.storeInLocalSession("genderFilter",JSON.stringify(t.search.gender)),t.displaySelectedGenderFilters(u,m),t.tailorResultsPerGenderFilters()}if(i.target.closest(".pokemon-grid")){let f=Number(i.target.closest(".pokemon-grid").getAttribute("data-id"));t.getSoloPokemonDetail(f)}"button"===i.target.tagName.toLowerCase()&&"scroll-to-top"===i.target.getAttribute("id")&&window.scrollTo({top:0,left:0,behavior:"smooth"})}),t.displaySelectedTypeFilters(),t.displaySelectedGenderFilters(),e.getElementById("searchByName").addEventListener("keyup",e=>{let i=null;clearTimeout(i),i=setTimeout(function(){t.search.name=e.target.value.trim(),t.storeInLocalSession("nameFilter",t.search.name),t.tailorResultsPerNameFilters()},1e3)}),t.search.name=e.getElementById("searchByName").value=t.readFromLocalSession("nameFilter","string")},t.prototype.displaySelectedTypeFilters=function(t,i){let s=this.isMobile?"typeFilterMobile":"typeFilter",l=t||e.getElementById(s).previousElementSibling.querySelector(".regular-display"),a=i||e.getElementById(s).previousElementSibling.querySelector(".bold-display"),n=this.search.type.filter(e=>e.isSelected);l.innerHTML=n.length>0?n[0].name:"- Select -",a.innerHTML=n.length>1?`+ ${n.length-1} More`:""},t.prototype.displaySelectedGenderFilters=function(t,i){let s=this.isMobile?"genderFilterMobile":"genderFilter",l=t||e.getElementById(s).previousElementSibling.querySelector(".regular-display"),a=i||e.getElementById(s).previousElementSibling.querySelector(".bold-display"),n=this.search.gender.filter(e=>e.isSelected);l.innerHTML=n.length>0?n[0].name:"- Select -",a.innerHTML=n.length>1?`+ ${n.length-1} More`:""},t.prototype.toggleMobileFilterModal=function(){e.querySelector("body").classList.toggle("scroll-freeze"),e.getElementById("pokemon-mobile-filter").classList.toggle("d-none")},t.prototype.closeNavigationDropDowns=function(){if(this.isMobile)e.querySelectorAll(".filter-fields .filter-item .pokemon-mobile-filter-drawer").forEach(e=>{e.classList.remove("open"),e.setAttribute("aria-expanded",!1),e.closest(".filter-item").classList.remove("open")});else{let t=e.querySelectorAll(".navigation .filter-item .drop-down.open");t.length>0&&e.querySelectorAll(".navigation .filter-item .drop-down").forEach(e=>{e.classList.remove("open"),e.children[0].setAttribute("aria-expanded",!1)})}for(let i of(this.clearSliderInstances(this.initiatorElementId),this.elementsHavingEventListenersRegistered))"object"==typeof i.element&&i.element.removeEventListener(i.eventType,i.functionDefination)},t.prototype.init=function(){this.navigationDropdown(),this.fetchPokemons(),this.scrollFunctions(),this.getDynamicTypeFilterOptions(),this.getDynamicGenderFilterOptions()},t.prototype.getDynamicTypeFilterOptions=async function(){let t=this,i=t.readFromLocalSession("typeFilter","array");0===i.length?await fetch(t.getPokemonTypes).then(e=>e.json()).then(e=>{t.search.type=e.results.map(e=>({name:e.name,isSelected:!1,url:e.url})),t.storeInLocalSession("typeFilter",JSON.stringify(t.search.type))}):t.search.type=i;let s=t.isMobile?"typeFilterMobile":"typeFilter";e.getElementById(s).innerHTML=`<ul>
            ${t.search.type.map(e=>`<li class="checkbox-item">
                <label class="custom-checkbox-container pokemon-type-check">${e.name}
                    <input type="checkbox" class="type-filter"  ${e.isSelected?"checked":""} value="${e.name}" />
                    <span class="checkmark"></span>
                </label>
            </li>`).join("")}
        </ul>`,t.displaySelectedTypeFilters()},t.prototype.getDynamicGenderFilterOptions=async function(){let t=this,i=t.readFromLocalSession("genderFilter","array");0===i.length?await fetch(this.getPokemonGenders).then(e=>e.json()).then(e=>{t.search.gender=e.results.map(e=>({name:e.name,isSelected:!1})),t.storeInLocalSession("genderFilter",JSON.stringify(t.search.gender)),t.fetchGenderClassification(e.results)}).catch(e=>{}):t.search.gender=i;let s=t.isMobile?"genderFilterMobile":"genderFilter";e.getElementById(s).innerHTML=`<ul>
            ${t.search.gender.map(e=>`<li class="checkbox-item">
                <label class="custom-checkbox-container pokemon-gender-check">${e.name}
                    <input type="checkbox" class="gender-filter" ${e.isSelected?"checked":""} value="${e.name}" />
                    <span class="checkmark"></span>
                </label>
            </li>`).join("")}
        </ul>`,t.displaySelectedGenderFilters()},t.prototype.fetchGenderClassification=async function(e){let t=this;for(let i of e)await fetch(i.url).then(e=>e.json()).then(e=>{t.genderPerPokemonSpecies[e.name]=e.pokemon_species_details.map(e=>e.pokemon_species.name)}).catch(e=>{console.log(e)});t.storeInLocalSession("allGenderClassification",JSON.stringify(t.genderPerPokemonSpecies))},t.prototype.storeInLocalSession=function(e,t){sessionStorage.setItem(e,t)},t.prototype.readFromLocalSession=function(e,t){let i=null;switch(t){case"string":i=sessionStorage.getItem(e);break;case"boolean":i="true"===sessionStorage.getItem(e);break;case"object":i=sessionStorage.getItem(e)?JSON.parse(sessionStorage.getItem(e)):{};break;case"array":i=sessionStorage.getItem(e)?JSON.parse(sessionStorage.getItem(e)):[]}return i},t.prototype.scrollFunctions=function(){let t=this;window.addEventListener("scroll",()=>{if(window.innerHeight+window.scrollY+1>=e.body.scrollHeight){let i=15*++t.pokemonDisplayPage;t.fetchPokemons(i)}},!1)},t.prototype.createPokemonCard=function(t){let i=this,s="",l=(e,t,s,l)=>`<div class="pokemon-grid" data-name="${e.toLowerCase()}" 
                        data-type="${s.sort().join("-")}" 
                        data-gender="${i.getGenderByPokemonName(e).sort().join("-")}" 
                        data-id="${t}" 
                        style="background: ${i.getGradientForPokemonCard(s)}">
                <div class="picture">
                    <img src="${l}" alt="${e}" />
                </div>
                <div class="title">
                    <p class="name"> ${e} </p>
                    <p class="id"> ${i.getPaddedId(t)} </p>
                </div>
            </div>`;for(let a of t){let{name:n,capitalizedName:o=i.capitalizeFirstAlphabet(n),id:r,types:d,modifiedtypes:c=d.map(e=>e.type.name),sprites:{other:{dream_world:{front_default:p}}}}=a;s+=l(o,r,c,p)}this.pokemonDisplayPage>0?e.getElementById("pokemons").innerHTML+=s:e.getElementById("pokemons").innerHTML=s,i.pageTopPreLoader(!1),i.tailorResultsPerNameFilters(),i.tailorResultsPerTypeFilters(),i.tailorResultsPerGenderFilters()},t.prototype.getGradientForPokemonCard=function(e){let t="";if(e.length>1){for(let i of(t="linear-gradient(180deg",e))t+=","+this.pokemonAbilityColors[i];t+=")"}else t=1===e.length?this.pokemonAbilityColors[e[0]]:"transparent";return t},t.prototype.closeModal=function(){e.getElementById("modal-placeholder").innerHTML="",e.body.classList.remove("scroll-freeze")},t.prototype.createModal=function(t){let{id:i,name:s,image:l,weight:a,height:n,abilities:o,types:r,description:d,eggGroup:c,genders:p,weakAgainst:h,stats:u,gradientColorPerAbilityType:m,evolutionChain:g}=t,v=this.getPaddedId(i);if(e.querySelectorAll("#pokemon-variant-modal").length>0)return;let f=`<div class="overlay" id="pokemon-variant-modal">
            <div class="pokemon-bio-modal-container">
                <div class="pokemon-bio">
                    <div class="modal-display">
                        <div class="pokemon-bio-mobile-header">
                            <div class="pokemon-bio-mobile-header-title">
                                <h1> ${s} </h1>
                                <p> ${v} </p>
                            </div>
                            <div class="pokemon-bio-mobile-header-cta">
                                <button type="button" class="close"></button>
                            </div>
                        </div>
                        <div class="pokemon-description">
                            <div class="pokemon-visual" style="background: ${m}">
                                <img src="${l}" alt="${s}" />
                            </div>
                            <div class="pokemon-story">
                                <div class="title-and-cta">
                                    <span class="title">
                                        <p>
                                            ${s}
                                        </p>
                                    </span>
                                    <span class="id">
                                        <p>
                                            ${v}
                                        </p>
                                    </span>
                                    <span class="cta">
                                        <button type="button" class="left" disabled> move left </button>
                                        <button type="button" class="close"> close </button>
                                        <button type="button" class="right" disabled> move right </button>
                                    </span>
                                </div>
                                <div class="description">
                                    <p class="ellipsis"> ${d}</p>
                                    <button type="button" class="read-more">read more</button>
                                </div>
                            </div>
                            <div class="read-more-drawer d-none" id="read-more-drawer">
                                <div class="read-more-display">
                                    <button type="button" class="close-read-more"></button>
                                    <p> ${d} </p>
                                </div>
                            </div>
                        </div>

                        <div class="pokemon-features">
                            <div>
                                <label>Height</label>
                                <p>${n}</p>
                            </div>

                            <div>
                                <label>Weight</label>
                                <p>${a} Kg </p>
                            </div>

                            <div>
                                <label>Gender(s)</label>
                                <p>${p.join(", ")}</p>
                            </div>

                            <div>
                                <label>Egg Groups</label>
                                <p>${c.join(", ")}</p>
                            </div>

                            <div>
                                <label>Abilities</label>
                                <p>${o.join(", ")}</p>
                            </div>

                            <div>
                                <label>Types</label>
                                <div class="pills">
                                    ${r.map(e=>`<p style="background-color: ${e.color}"> ${e.name} </p>`).join("")}
                                </div>
                            </div>

                            <div class="weak-against">
                                <label>Weak Against</label>
                                <div class="pills">
                                    ${h.map(e=>`<p style="background-color: ${e.color}"> ${e.name} </p>`).join("")}
                                </div>
                            </div>
                        </div>

                        <div class="pokemon-stats">
                            <h2>Stats</h2>
                            <div class="stats-details-grid">
                                <div class="stats-detail-item">
                                    <label> HP </label>
                                    <div class="progress">
                                        ${"1@1"===u.hp?'<div style="width:100%;"> 100+ </div>':`<div style="width: ${u.hp}%;"> ${u.hp} </div>`}
                                    </div>
                                </div>

                                <div class="stats-detail-item">
                                    <label> Defense </label>
                                    <div class="progress">
                                    ${"1@1"===u.defense?'<div style="width:100%;"> 100+ </div>':`<div style="width: ${u.defense}%;"> ${u.defense} </div>`}
                                    </div>
                                </div>

                                <div class="stats-detail-item">
                                    <label> Sp. Attack </label>
                                    <div class="progress">
                                    ${"1@1"===u["special-attack"]?'<div style="width:100%;"> 100+ </div>':`<div style="width: ${u["special-attack"]}%;"> ${u["special-attack"]} </div>`}
                                    </div>
                                </div>

                                <div class="stats-detail-item">
                                    <label> Attack </label>
                                    <div class="progress">
                                        ${"1@1"===u.attack?'<div style="width:100%;"> 100+ </div>':`<div style="width: ${u.attack}%;"> ${u.attack} </div>`}
                                    </div>
                                </div>

                                <div class="stats-detail-item">
                                    <label> Speed </label>
                                    <div class="progress">
                                    ${"1@1"===u.speed?'<div style="width:100%;"> 100+ </div>':`<div style="width: ${u.speed}%;"> ${u.speed} </div>`}
                                    </div>
                                </div>

                                <div class="stats-detail-item">
                                    <label> Sp. Def. </label>
                                    <div class="progress">
                                    ${"1@1"===u["special-defense"]?'<div style="width:100%;"> 100+ </div>':`<div style="width: ${u["special-defense"]}%;"> ${u["special-defense"]} </div>`}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="evolution-chain">
                            <h2> Evolution chain </h2>
                            <div class="evolution-display">
                                ${g.map((e,t)=>{let i=`
                                        <div class="evolution-display-type">
                                            <div class="picture">
                                                <img src="${e.image}" alt="${e.species_name}" />
                                            </div>
                                            <div class="title">
                                                <p class="name"> ${e.species_name} </p>
                                                <p class="id"> ${e.id} </p>
                                            </div>
                                        </div>`;return t<g.length-1&&(i+='<div class="evolution-display-type-seperators"></div>'),i}).join("")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;e.body.classList.add("scroll-freeze"),e.getElementById("modal-placeholder").innerHTML=f},t.prototype.getSoloPokemonDetail=async function(e){let t=this,i="",s=t.pokemonCollection.filter(t=>t.id===e)[0];t.pageTopPreLoader(!0),t.pokemonSolo=Object.assign(t.pokemonSolo,{id:s.id,name:t.capitalizeFirstAlphabet(s.name),image:s.sprites.other.dream_world.front_default,weight:s.weight,height:s.height,abilities:s.abilities.map(e=>t.capitalizeFirstAlphabet(e.ability.name)),types:s.types.map(e=>({color:t.pokemonAbilityColors[e.type.name.toLowerCase()],name:t.capitalizeFirstAlphabet(e.type.name)})),stats:s.stats.reduce((e,t)=>t.base_stat>100?{...e,[t.stat.name]:"1@1"}:{...e,[t.stat.name]:t.base_stat},{}),gradientColorPerAbilityType:t.getGradientForPokemonCard(s.types.map(e=>e.type.name))}),await fetch(t.getPokemonSoloSpecies(s.id)).then(e=>e.json()).then(e=>{let{evolution_chain:{url:s},flavor_text_entries:l,egg_groups:a}=e;i=s,t.pokemonSolo.description=l.filter(e=>"en"===e.language.name).map(e=>e.flavor_text).join(" ").replace(/\f|\n/g," "),t.pokemonSolo.eggGroup=a.map(e=>t.capitalizeFirstAlphabet(e.name))}).catch(e=>{}),t.pokemonSolo.genders=t.getGenderByPokemonName(s.name);let l=t.readFromLocalSession("typeFilter","array"),a={};if(l instanceof Array&&l.length>0)for(let n of l)a[n.name]=[],await fetch(n.url).then(e=>e.json()).then(e=>{a[n.name]=e.damage_relations.double_damage_from.map(e=>e.name)}).catch(e=>{});else await fetch(this.getPokemonTypes).then(e=>e.json().then(async e=>{for(let t of e.results)a[t.name]=[],await fetch(t.url).then(e=>e.json()).then(e=>{a[t.name]=e.damage_relations.double_damage_from.map(e=>e.name)}).catch(e=>{})})).catch(e=>{});for(let o of(t.pokemonSolo.weakAgainst=[],s.types)){let r=a[o.type.name].map(e=>({color:t.pokemonAbilityColors[e.toLowerCase()],name:t.capitalizeFirstAlphabet(e)}));t.pokemonSolo.weakAgainst=[...t.pokemonSolo.weakAgainst,...r]}await fetch(i).then(e=>e.json()).then(e=>{let i=[],s=e.chain;do{let l=s.species.url.split("https://pokeapi.co/api/v2/pokemon-species/")[1].replace("/","");i.push({image:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${l}.svg`,species_name:s.species.name,id:t.getPaddedId(l)}),s=s.evolves_to[0]}while(!!s&&s.hasOwnProperty("evolves_to"));t.pokemonSolo.evolutionChain=i}).catch(e=>{}),t.pageTopPreLoader(!1),t.createModal(t.pokemonSolo)},t.prototype.fetchPokemons=async function(e=0){let t=this;t.pageTopPreLoader(!0);let i=t.getPaginatedPokemon(e),s=[];for(let l of(await fetch(i).then(e=>e.json()).then(e=>{t.pokemonPool=e.results}).catch(e=>{}),t.pokemonPool))await fetch(t.getPokemonSoloDetail(l.name)).then(e=>e.json()).then(e=>{t.pokemonCollection=[...t.pokemonCollection,e],s.push(e)}).catch(e=>{});t.createPokemonCard(s)},t.prototype.tailorResultsPerNameFilters=function(){for(let t of e.querySelectorAll(".pokemon-grid"))this.search.name?.length>0&&-1===t.getAttribute("data-name").indexOf(this.search.name.toLowerCase())?t.classList.add("hide-per-name"):t.classList.remove("hide-per-name")},t.prototype.tailorResultsPerTypeFilters=function(){let t=this.search.type.filter(e=>e.isSelected).map(e=>e.name);for(let i of e.querySelectorAll(".pokemon-grid"))t.length>0&&!i.getAttribute("data-type").split("-").some(e=>t.includes(e))?i.classList.add("hide-per-type"):i.classList.remove("hide-per-type")},t.prototype.tailorResultsPerGenderFilters=function(){let t=this.search.gender.filter(e=>e.isSelected).map(e=>e.name);for(let i of e.querySelectorAll(".pokemon-grid"))t.length>0&&!i.getAttribute("data-gender").split("-").some(e=>t.includes(e))?i.classList.add("hide-per-gender"):i.classList.remove("hide-per-gender")},t.prototype.getGenderByPokemonName=function(e){let t=this,i=[];if(t.genderPerPokemonSpecies=t.readFromLocalSession("allGenderClassification","object"),0===Object.keys(t.genderPerPokemonSpecies).length)return[];for(let[s,l]of Object.entries(t.genderPerPokemonSpecies))for(let a of l)a.toLowerCase()===e.toLowerCase()&&i.push(s);return i},t.prototype.capitalizeFirstAlphabet=function(e){return e.charAt(0).toUpperCase()+e.slice(1)},t.prototype.getPaddedId=function(e){return e.toString().padStart(3,"0")},t.prototype.pageTopPreLoader=function(t=!1){t?e.getElementById("pokemon-pre-loader").classList.remove("d-none"):e.getElementById("pokemon-pre-loader").classList.add("d-none")},window.pokedex=t}(document),new pokedex;