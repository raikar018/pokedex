# pokedex

To run it - use any simple static HTTP server Eg: http-server or simply open index.html at any mordern standard browser.

Pokedex webapp has: 
  - listing of pokemon characters, loading dynamically 15 items per end of page scroll.
  - detail page on click on any visible pokemon, which shares certain details around chosen pokemon such as name, id, abilities, gender, evolution etc. 
  - one can filter the visible pokemon by name, type and gender.
  - the webapp could be accessed both on desktop and mobile browsers.
  
  
Know observations / future enhancements:
  - stats filter is currently inactive as its just static component for time being.
  - the drawers and menus may not work if one would access mobile UI at desktop machine. Eg: Viewing, acting on webapp by manually resizing browser etc, as
  specific portions of js scripts gets registered on load, for respective platforms mobile / desktop.
  - partial a11y support.

View webapp at: https://unique-cobbler-122f75.netlify.app
