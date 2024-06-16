{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/24.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = inputs:
    let
      overlay = final: prev:
        {
          app-env = prev.buildEnv {
            name = "app-env";
            paths = with final; [
              nodejs-18_x
              yarn
              python3
              tree-sitter
            ];
          };
        };

      perSystem = system:
        let
          pkgs = import inputs.nixpkgs { inherit system; overlays = [ overlay ]; };
        in
        {
          devShell = pkgs.mkShell {
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
