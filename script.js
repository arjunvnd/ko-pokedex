var BASE_URL = "https://pokeapi.co/api/v2/";

// https://stackoverflow.com/questions/69239521/unable-to-display-pokemon-image-from-pokeapi-co

function RootViewModel() {
  var self = this;

  self.someExpressionGoesHere = false;

  self.showPokemonDetails = ko.observable(false);
  self.selectedPokemonData = ko.observable({});

  self.showDetails = function (data) {
    self.showPokemonDetails(true);
    self.selectedPokemonData(data);
  };

  self.showList = function () {
    self.showPokemonDetails(false);
    self.selectedPokemonData({});
  };
}

ko.components.register("pokemon-list", {
  viewModel: function (params) {
    var self = this;
    self.pokemonList = ko.observableArray([]);

    self.loadPokemonList = function () {
      fetch(BASE_URL + "pokemon?limit=151")
        .then((resp) => resp.json())
        .then((data) => {
          self.pokemonList(data.results);
        });
    };

    self.showPokemonDetails = function (data) {
      params.showPokemonDetails(data);
    };

    self.loadPokemonList();
  },
  template: `
    <div class="flex flex-col items-center">
      <h1 class="text-xl">Pokemon List</h1>
      <ul data-bind="foreach: pokemonList">
        <li>
          <button
            class="!capitalize"
            data-bind="text: ($index() + 1) + ' ' + name, click: $parent.showPokemonDetails"
          ></button>
        </li>
      </ul>
    </div>
  `,
});

ko.components.register("pokemon-details", {
  viewModel: function (params) {
    var self = this;
    self.text = ko.observable((params && params.initialText) || "");
    self.pokemonDetail = ko.observable(null);
    self.pokemonSpecies = ko.observable(null);
    self.selectedPokemonData = params.selectedPokemonData;

    self.types = ko.computed(function () {
      const detail = self.pokemonDetail();
      return detail?.types?.map((type) => type.type.name) || [];
    });

    self.pokemonBasicDetails = ko.computed(function () {
      const details = self.pokemonDetail();
      const species = self.pokemonSpecies();
      if (details && species) {
        const pokemonName = details.name;
        const index = details.id;
        const description = species.flavor_text_entries[0];
        const pokemonSpeciesObj = species.genera.find(
          (genusObj) => genusObj.language.name === "en"
        );
        const pokemonSpecies = pokemonSpeciesObj && pokemonSpeciesObj.genus;
        const height = details.height * 10;
        let heightInInches = (height * 0.393700787).toFixed(0);
        const heightInFt = Math.floor(heightInInches / 12);
        heightInInches %= 12;
        const weight = ((details.weight / 10) * 2.2046).toFixed(1);
        const types = details?.types?.map((type) => type.type.name) || [];

        return {
          pokemonName,
          index,
          description,
          pokemonSpecies,
          weight,
          heightInFt,
          heightInInches,
          types,
        };
      }
      return null;
    });

    self.loadPokemonData = function () {
      const species = fetch(params.selectedPokemonData().url)
        .then((resp) => resp.json())
        .then((data) => {
          self.pokemonDetail(data);
          return data.species;
        });
      species.then((speciesObj) => {
        fetch(speciesObj.url)
          .then((resp) => resp.json())
          .then((data) => {
            self.pokemonSpecies(data);
            return data.species;
          });
      });
    };
    self.loadPokemonData();
  },
  template: `
    <div>
      <div data-bind="if: pokemonBasicDetails()">
        <p class="capitalize" data-bind="text: pokemonBasicDetails().index"></p>
        <p class="capitalize" data-bind="text: pokemonBasicDetails().pokemonName"></p>
        <p class="capitalize" data-bind="text: pokemonBasicDetails().pokemonSpecies"></p>
      </div>
      <div data-bind="ifnot: pokemonBasicDetails()">
        <p>Fetching pokemon details</p>
      </div>
    </div>
  `,
});

ko.applyBindings(new RootViewModel(), document.getElementById("root"));
