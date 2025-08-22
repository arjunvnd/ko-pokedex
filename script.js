var BASE_URL = "https://pokeapi.co/api/v2/";

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
    this.text = ko.observable((params && params.initialText) || "");
  },
  template: `
    <div>Details</div>
  `,
});

ko.applyBindings(new RootViewModel(), document.getElementById("root"));
