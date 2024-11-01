{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    inputs:
    let
      overlay = final: prev: {
        app-env = prev.buildEnv {
          name = "app-env";
          paths = with final; [
            nodejs_22
            yarn
            python3
            clang-tools # clangd
            graphviz # dot
          ];
        };
      };

      perSystem =
        system:
        let
          pkgs = import inputs.nixpkgs {
            inherit system;
            overlays = [ overlay ];
          };
        in
        {
          devShell = pkgs.mkShell {
            shellHook = ''
              export PATH=$PWD/node_modules/.bin:$PATH
            '';

            buildInputs = with pkgs; [
              app-env

              watchexec
              gnumake
            ];
          };
        };
    in
    { inherit overlay; } // inputs.flake-utils.lib.eachDefaultSystem perSystem;
}
