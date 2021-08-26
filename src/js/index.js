import Glide from '@glidejs/glide';
import './../scss/index.scss';
import { init, send } from 'emailjs-com';
init('user_1Tg0LGrhPHu9gtvjP1siV');

// Next.js
// Nuxt.js

document.addEventListener('DOMContentLoaded', () => {
  const glideInstance = new Glide('.glide', {
    type: 'carousel',
  });

  glideInstance.mount();
});

const CONFIGURATION = {
  locations: [
    {
      title: 'PIXELLAB',
      address1: 'Etaj 1',
      address2: 'Strada Matei Voievod 116, București 021453, Romania',
      coords: { lat: 44.43737246942555, lng: 26.13441272023773 },
      placeId: 'ChIJM4qzh0b_sUAR3CjNaTf4Z0E',
    },
  ],
  mapOptions: {
    center: { lat: 38.0, lng: -100.0 },
    fullscreenControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    zoom: 4,
    zoomControl: true,
    maxZoom: 17,
  },
  mapsApiKey: 'AIzaSyCMwm1pt2211FZunDThMlQHQBLAlgHPge0',
};

// hoisting works only for the function kw
/* eslint-disable */
window.initMap = () => {
  new LocatorPlus(CONFIGURATION);
};
/* eslint-enable */

/**
 * Defines an instance of the Locator+ solution, to be instantiated
 * when the Maps library is loaded.
 */
function LocatorPlus(configuration) {
  const locator = this;

  locator.locations = configuration.locations || [];
  locator.capabilities = configuration.capabilities || {};

  const mapEl = document.getElementById('map');
  const panelEl = document.getElementById('locations-panel');
  locator.panelListEl = document.getElementById('locations-panel-list');
  const sectionNameEl = document.getElementById(
    'location-results-section-name',
  );
  const resultsContainerEl = document.getElementById('location-results-list');

  const itemsTemplate = Handlebars.compile(
    document.getElementById('locator-result-items-tmpl').innerHTML,
  );

  locator.selectedLocationIdx = null;
  locator.userCountry = null;

  // Initialize the map -------------------------------------------------------
  locator.map = new google.maps.Map(mapEl, configuration.mapOptions);

  // Store selection.
  const selectResultItem = function (locationIdx, panToMarker, scrollToResult) {
    locator.selectedLocationIdx = locationIdx;
    for (let locationElem of resultsContainerEl.children) {
      locationElem.classList.remove('selected');
      if (getResultIndex(locationElem) === locator.selectedLocationIdx) {
        locationElem.classList.add('selected');
        if (scrollToResult) {
          panelEl.scrollTop = locationElem.offsetTop;
        }
      }
    }
    if (panToMarker && locationIdx != null) {
      locator.map.panTo(locator.locations[locationIdx].coords);
    }
  };

  // Create a marker for each location.
  const markers = locator.locations.map(function (location, index) {
    const marker = new google.maps.Marker({
      position: location.coords,
      map: locator.map,
      title: location.title,
    });
    marker.addListener('click', function () {
      selectResultItem(index, false, true);
    });
    return marker;
  });

  // Fit map to marker bounds.
  locator.updateBounds = function () {
    const bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < markers.length; i++) {
      bounds.extend(markers[i].getPosition());
    }
    locator.map.fitBounds(bounds);
  };
  if (locator.locations.length) {
    locator.updateBounds();
  }

  // Render the results list --------------------------------------------------
  const getResultIndex = function (elem) {
    return parseInt(elem.getAttribute('data-location-index'));
  };

  locator.renderResultsList = function () {
    let locations = locator.locations.slice();
    for (let i = 0; i < locations.length; i++) {
      locations[i].index = i;
    }
    sectionNameEl.textContent = `All locations (${locations.length})`;
    const resultItemContext = { locations: locations };
    resultsContainerEl.innerHTML = itemsTemplate(resultItemContext);
    for (let item of resultsContainerEl.children) {
      const resultIndex = getResultIndex(item);
      if (resultIndex === locator.selectedLocationIdx) {
        item.classList.add('selected');
      }

      const resultSelectionHandler = function () {
        selectResultItem(resultIndex, true, false);
      };

      // Clicking anywhere on the item selects this location.
      // Additionally, create a button element to make this behavior
      // accessible under tab navigation.
      item.addEventListener('click', resultSelectionHandler);
      item
        .querySelector('.select-location')
        .addEventListener('click', function (e) {
          resultSelectionHandler();
          e.stopPropagation();
        });
    }
  };

  // Optional capability initialization --------------------------------------

  // Initial render of results -----------------------------------------------
  locator.renderResultsList();
}

// my code - G maps
const googleScriptUri = `https://maps.googleapis.com/maps/api/js?key=${CONFIGURATION.mapsApiKey}&callback=initMap&libraries=places&channel=GMPSB_locatorplus_v4_c`;
const script = document.createElement('script');
script.src = googleScriptUri;
script.async = true;
document.body.append(script);

// my code - emailjs
const newsletterForm = document.querySelector('.home-newsletter form');
newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailField = event.currentTarget.querySelector('#email');
  const value = emailField.value; // in jQuery => val()

  if (value.trim().length < 1) {
    return;
  }

  send('pixellab-pp', 'template_mistjsq').then(() => {
    event.currentTarget.remove(); // scoatem form din DOM dupa ce a fost trimis
  });
});
