{
  description = "Full Stack Web development env";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      pythonEnv = pkgs.python312.withPackages (ps: with ps; [
        django
        # daphne   # to use ASGI later
        mutagen
        django-cors-headers
        djangorestframework
        pillow
      ]);
      submit50 = pkgs.submit50;
      nodeJS = pkgs.nodejs_24;

    in {
      devShells.${system}.default = pkgs.mkShell {
        packages = [
          pythonEnv
          submit50
	        nodeJS
        ];
      };
    };
}
