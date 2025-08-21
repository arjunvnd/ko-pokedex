function RootViewModel() {
  var self = this;
  var BASE_URL = "https://pokeapi.co/api/v2/";

  self.pokemonList = ko.observableArray([]);

  self.loadPokemonList = function () {
    fetch(BASE_URL + "pokemon?limit=151")
      .then((resp) => resp.json())
      .then((data) => {
        self.pokemonList(data.results);
      });
  };

  self.loadPokemonList();
}

ko.applyBindings(new RootViewModel(), document.getElementById("root"));
