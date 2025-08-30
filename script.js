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
    self.selectedPokemonData = params.selectedPokemonData;

    self.types = ko.computed(function () {
      const detail = self.pokemonDetail();
      return detail?.types?.map((type) => type.type.name) || [];
    });

    self.loadPokemonData = function () {
      fetch(params.selectedPokemonData().url)
        .then((resp) => resp.json())
        .then((data) => {
          console.log("data", data);
          self.pokemonDetail(data);
          console.log("Types computed:", self.types());
        });
      console.log("This is it", self.pokemonDetail());
    };
    self.loadPokemonData();
  },
  template: `
    <div>Details <span class="capitalize" data-bind="text: selectedPokemonData() ? selectedPokemonData().name : ''"></span>
    <div data-bind="foreach:types">
      <span data-bind="text: $data"></span>
    </div>
    </div>
  `,
});

ko.applyBindings(new RootViewModel(), document.getElementById("root"));
